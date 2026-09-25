// zod/mini keeps the client bundle small; the same schema runs on the server.
import * as z from "zod/mini";

/** Stable keys; labels come from Site settings (or the UI messages). */
export const DEFAULT_INTERESTS = [
  "available-residence",
  "future-developments",
  "architecture",
  "residential-construction",
  "general",
] as const;

const PHONE = /^[+()\d\s.-]{8,30}$/;

/** Error values are message keys under `contact.errors`. */
export const contactSchema = z.object({
  name: z.string().check(z.trim(), z.minLength(1, "nameRequired"), z.maxLength(120, "nameRequired")),
  email: z.string().check(z.trim(), z.maxLength(200, "emailInvalid"), z.email("emailInvalid")),
  phone: z._default(
    z.optional(
      z.string().check(
        z.trim(),
        z.maxLength(30, "phoneInvalid"),
        z.refine((v) => v === "" || PHONE.test(v), "phoneInvalid"),
      ),
    ),
    "",
  ),
  interest: z.string().check(z.trim(), z.minLength(1, "interestRequired"), z.maxLength(60, "interestRequired")),
  message: z._default(z.optional(z.string().check(z.trim(), z.maxLength(2000, "messageTooLong"))), ""),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;
export type ContactErrors = Partial<Record<ContactField, string>>;

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "invalid"; errors: ContactErrors }
  | { status: "error"; reason: "rateLimited" | "spamCheck" | "failure" };

export function toErrors(error: { issues: ReadonlyArray<{ path: PropertyKey[]; message: string }> }): ContactErrors {
  const errors: ContactErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as ContactField | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}
