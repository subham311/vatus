"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { routing } from "@/i18n/routing";
import { contactSchema, DEFAULT_INTERESTS, toErrors, type ContactState } from "@/lib/contact";
import { client } from "@/sanity/lib/client";
import { getWriteClient } from "@/sanity/lib/write-client";

/* ---------- Simple in-memory rate limit (per server instance) ---------- */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

async function verifyTurnstile(token: string | null, ip: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.warn("[contact] TURNSTILE_SECRET_KEY is not set: relying on honeypot and rate limit only.");
    }
    return true;
  }
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch (err) {
    console.error("[contact] Turnstile verification failed", err);
    return false;
  }
}

async function allowedInterests(locale: string) {
  const values = await client
    .withConfig({ stega: false })
    .fetch<string[] | null>(
      `*[_type == "siteSettings" && language in [$locale, "en"]].contactInterests[].value`,
      { locale },
    )
    .catch(() => null);
  return new Set<string>([...DEFAULT_INTERESTS, ...(values ?? [])]);
}

async function sendNotification(enquiry: Record<string, string>) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) return;
  const from = process.env.CONTACT_FROM_EMAIL || "VATUS website <onboarding@resend.dev>";
  const lines = [
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `Telephone / WhatsApp: ${enquiry.phone || "-"}`,
    `Interested in: ${enquiry.interest}`,
    `Language: ${enquiry.locale}`,
    `Page: ${enquiry.sourcePage}`,
    "",
    enquiry.message || "(no message)",
  ];
  try {
    const { error } = await new Resend(key).emails.send({
      from,
      to: to.split(",").map((s) => s.trim()),
      replyTo: enquiry.email,
      subject: `New enquiry: ${enquiry.name} (${enquiry.interest})`,
      text: lines.join("\n"),
    });
    if (error) console.error("[contact] Resend error", error);
  } catch (err) {
    console.error("[contact] Resend failed", err);
  }
}

export async function submitEnquiry(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: bots fill every field. Pretend success and store nothing.
  if (String(formData.get("company") ?? "").trim() !== "") {
    return { status: "success" };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || null;
  if (rateLimited(ip ?? "unknown")) {
    return { status: "error", reason: "rateLimited" };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    interest: formData.get("interest") ?? "",
    message: formData.get("message") ?? "",
  });
  if (!parsed.success) {
    return { status: "invalid", errors: toErrors(parsed.error) };
  }

  const rawLocale = String(formData.get("locale") ?? "");
  const locale = (routing.locales as readonly string[]).includes(rawLocale) ? rawLocale : routing.defaultLocale;

  if (!(await allowedInterests(locale)).has(parsed.data.interest)) {
    return { status: "invalid", errors: { interest: "interestRequired" } };
  }

  const token = formData.get("cf-turnstile-response");
  if (!(await verifyTurnstile(typeof token === "string" ? token : null, ip))) {
    return { status: "error", reason: "spamCheck" };
  }

  const sourcePage = String(formData.get("sourcePage") ?? "").slice(0, 300);
  const enquiry = {
    ...parsed.data,
    locale,
    sourcePage,
    createdAt: new Date().toISOString(),
  };

  const writeClient = getWriteClient();
  if (!writeClient) {
    console.error("[contact] SANITY_API_WRITE_TOKEN is not set: cannot store enquiries.");
    return { status: "error", reason: "failure" };
  }

  try {
    await writeClient.create({ _type: "enquiry", ...enquiry });
  } catch (err) {
    console.error("[contact] Could not save enquiry", err);
    return { status: "error", reason: "failure" };
  }

  await sendNotification(enquiry);
  return { status: "success" };
}
