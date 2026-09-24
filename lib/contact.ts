import { z } from "zod";

/** Stable keys; labels come from Site settings (or the UI messages). */
export const DEFAULT_INTERESTS = [
  "available-residence",
  "future-developments",
  "architecture",
  "residential-construction",
  "general",
] as const;

/** Error values are message keys under `contact.errors`. */
export const contactSchema = z.object({
  name: z.string().trim().min(1, "nameRequired").max(120, "nameRequired"),
  email: z.string().trim().max(200, "emailInvalid").pipe(z.email("emailInvalid")),
  phone: z
    .string()
    .trim()
    .max(30, "phoneInvalid")
    .refine((v) => v === "" || /^[+()\d\s.-]{8,30}$/.test(v), "phoneInvalid")
    .optional()
    .default(""),
  interest: z.string().trim().min(1, "interestRequired").max(60, "interestRequired"),
  message: z.string().trim().max(2000, "messageTooLong").optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;
export type ContactErrors = Partial<Record<ContactField, string>>;

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "invalid"; errors: ContactErrors }
  | { status: "error"; reason: "rateLimited" | "spamCheck" | "failure" };

export function toErrors(error: z.ZodError): ContactErrors {
  const errors: ContactErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as ContactField | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}
