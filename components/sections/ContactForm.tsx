"use client";

import Script from "next/script";
import { useActionState, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { submitEnquiry } from "@/app/actions/contact";
import { Arrow, buttonClasses } from "@/components/ui/Button";
import { INTEREST_EVENT, type InterestEventDetail } from "@/components/ui/EnquireLink";
import { pushEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { contactSchema, toErrors, type ContactErrors, type ContactField, type ContactState } from "@/lib/contact";

declare global {
  interface Window {
    turnstile?: { reset: (widget?: string) => void };
  }
}

type Option = { value: string; label: string };

const initialState: ContactState = { status: "idle" };

const fieldBase =
  "block w-full border bg-surface px-4 py-3 text-base text-ink placeholder:text-muted/70 transition-colors focus:border-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2";

export function ContactForm({ interests, turnstileSiteKey }: { interests: Option[]; turnstileSiteKey?: string }) {
  const t = useTranslations("contact");
  const locale = useLocale();
  const id = useId();
  const [state, formAction, pending] = useActionState(submitEnquiry, initialState);
  const [values, setValues] = useState({ name: "", email: "", phone: "", interest: "", message: "" });
  const [clientErrors, setClientErrors] = useState<ContactErrors | null>(null);
  const [sourcePage, setSourcePage] = useState("");
  const [dismissed, setDismissed] = useState<ContactState | null>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const interestRef = useRef<HTMLSelectElement>(null);
  const tracked = useRef<ContactState | null>(null);

  const serverErrors = state.status === "invalid" ? state.errors : null;
  const errors = clientErrors ?? serverErrors ?? {};
  const hasErrors = Object.keys(errors).length > 0;
  const showSuccess = state.status === "success" && dismissed !== state;

  // Pre-select interest from ?interest= (deep links) and from residence buttons.
  useEffect(() => {
    const valid = (v: string | null) => (v && interests.some((o) => o.value === v) ? v : null);
    const fromQuery = valid(new URLSearchParams(window.location.search).get("interest"));
    setSourcePage(window.location.pathname);
    if (fromQuery) setValues((v) => ({ ...v, interest: fromQuery }));

    const onSelect = (e: Event) => {
      const interest = valid((e as CustomEvent<InterestEventDetail>).detail?.interest ?? null);
      if (!interest) return;
      setValues((v) => ({ ...v, interest }));
      window.setTimeout(() => interestRef.current?.focus({ preventScroll: true }), 600);
    };
    window.addEventListener(INTEREST_EVENT, onSelect);
    return () => window.removeEventListener(INTEREST_EVENT, onSelect);
  }, [interests]);

  useEffect(() => {
    if (state.status === "success" && tracked.current !== state) {
      tracked.current = state;
      pushEvent({ event: "generate_lead", form: "contact", interest: values.interest, locale });
      successRef.current?.focus();
      window.turnstile?.reset();
    }
    if (state.status === "invalid") summaryRef.current?.focus();
    if (state.status === "error") window.turnstile?.reset();
  }, [state, values.interest, locale]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      event.preventDefault();
      setClientErrors(toErrors(parsed.error));
      window.setTimeout(() => summaryRef.current?.focus(), 0);
      return;
    }
    setClientErrors(null);
  }

  const update = (field: ContactField) => (e: { target: { value: string } }) => {
    const value = e.target.value;
    setValues((v) => ({ ...v, [field]: value }));
    if (clientErrors?.[field]) {
      setClientErrors((errs) => {
        if (!errs) return errs;
        const next = { ...errs };
        delete next[field];
        return Object.keys(next).length ? next : null;
      });
    }
  };

  const describedBy = (field: ContactField) => (errors[field] ? `${id}-${field}-error` : undefined);
  const inputClass = (field: ContactField) => cn(fieldBase, errors[field] ? "border-[#9b2c2c]" : "border-line");

  const errorText = (field: ContactField) =>
    errors[field] ? (
      <p id={`${id}-${field}-error`} className="mt-2 text-sm text-[#9b2c2c]">
        {t(`errors.${errors[field]}` as "errors.nameRequired")}
      </p>
    ) : null;

  const label = (field: ContactField, optional = false) => (
    <label htmlFor={`${id}-${field}`} className="mb-2 block text-sm font-medium text-ink">
      {t(field)}
      {optional ? <span className="font-normal text-muted"> ({t("optional")})</span> : null}
    </label>
  );

  if (showSuccess) {
    return (
      <div className="border border-line bg-surface p-8 md:p-10" role="status">
        <h3 ref={successRef} tabIndex={-1} className="font-heading text-[2rem] leading-tight focus:outline-none">
          {t("successTitle")}
        </h3>
        <p className="mt-4 text-muted">{t("successBody")}</p>
        <button
          type="button"
          className={buttonClasses("outline", "mt-8")}
          onClick={() => {
            setDismissed(state);
            setValues({ name: "", email: "", phone: "", interest: "", message: "" });
            setClientErrors(null);
          }}
        >
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} onSubmit={onSubmit} noValidate aria-label={t("formLabel")} className="flex flex-col gap-6">
      {turnstileSiteKey ? (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
      ) : null}

      <div ref={summaryRef} tabIndex={-1} aria-live="assertive" className="focus:outline-none">
        {hasErrors ? (
          <p className="border-l-2 border-[#9b2c2c] bg-surface px-4 py-3 text-sm text-[#9b2c2c]">{t("errors.summary")}</p>
        ) : null}
        {state.status === "error" && !clientErrors ? (
          <div className="border-l-2 border-[#9b2c2c] bg-surface px-4 py-3 text-sm" role="alert">
            {state.reason === "rateLimited" ? (
              <p className="text-ink">{t("rateLimited")}</p>
            ) : state.reason === "spamCheck" ? (
              <p className="text-ink">{t("spamCheck")}</p>
            ) : (
              <>
                <p className="font-medium text-ink">{t("failureTitle")}</p>
                <p className="mt-1 text-muted">{t("failureBody")}</p>
              </>
            )}
          </div>
        ) : null}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          {label("name")}
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            value={values.name}
            onChange={update("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name")}
            className={inputClass("name")}
          />
          {errorText("name")}
        </div>
        <div>
          {label("email")}
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={update("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email")}
            className={inputClass("email")}
          />
          {errorText("email")}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          {label("phone", true)}
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={update("phone")}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describedBy("phone")}
            className={inputClass("phone")}
          />
          {errorText("phone")}
        </div>
        <div>
          {label("interest")}
          <select
            ref={interestRef}
            id={`${id}-interest`}
            name="interest"
            required
            value={values.interest}
            onChange={update("interest")}
            aria-invalid={Boolean(errors.interest)}
            aria-describedby={describedBy("interest")}
            className={cn(inputClass("interest"), "appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10")}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235E5D57' stroke-width='1.25'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
            }}
          >
            <option value="" disabled>
              {t("interestPlaceholder")}
            </option>
            {interests.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {errorText("interest")}
        </div>
      </div>

      <div>
        {label("message", true)}
        <textarea
          id={`${id}-message`}
          name="message"
          rows={5}
          value={values.message}
          onChange={update("message")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy("message")}
          className={cn(inputClass("message"), "resize-y")}
        />
        {errorText("message")}
      </div>

      {/* Honeypot: hidden from people and assistive tech, attractive to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-company`}>{t("honeypot")}</label>
        <input id={`${id}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="sourcePage" value={sourcePage} />

      {turnstileSiteKey ? (
        <div className="cf-turnstile min-h-[65px]" data-sitekey={turnstileSiteKey} data-theme="light" data-language={locale} />
      ) : null}

      <div>
        <button type="submit" disabled={pending} aria-disabled={pending} className={buttonClasses("primary", "disabled:opacity-70")}>
          <span>{pending ? t("sending") : t("submit")}</span>
          <Arrow />
        </button>
      </div>
    </form>
  );
}
