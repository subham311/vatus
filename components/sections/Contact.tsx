import { Mail } from "lucide-react";
import { stegaClean } from "next-sanity";
import { getTranslations } from "next-intl/server";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DEFAULT_INTERESTS } from "@/lib/contact";
import { whatsappHref } from "@/lib/links";
import type { Home, Settings } from "@/sanity/lib/data";
import { ContactForm } from "./ContactForm";
import { TrackedWhatsAppLink } from "./TrackedWhatsAppLink";

export async function Contact({
  data,
  settings,
}: {
  data: NonNullable<Home["contact"]>;
  settings: Settings | null;
}) {
  const t = await getTranslations("contact");
  const tc = await getTranslations("common");

  const cmsInterests = (settings?.contactInterests ?? []).flatMap((o) =>
    o.value && o.label ? [{ value: stegaClean(o.value) as string, label: o.label as string }] : [],
  );
  const interests = cmsInterests.length
    ? cmsInterests
    : DEFAULT_INTERESTS.map((value) => ({ value, label: t(`interests.${value}`) }));

  const email = stegaClean(settings?.email);
  const whatsapp = whatsappHref(settings?.whatsappNumber, settings?.whatsappMessage);
  const instagram = stegaClean(settings?.instagramUrl);
  const detailClass = "inline-flex min-h-11 items-center gap-3 text-ink transition-colors hover:text-olive";

  return (
    <section id="contact" aria-labelledby="contact-heading" className="section-y border-t border-line">
      <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          {data.heading ? <SectionHeading id="contact-heading">{data.heading}</SectionHeading> : null}
          {data.subheading ? (
            <p className="mt-6 font-display text-[1.625rem] leading-snug text-ink">{data.subheading}</p>
          ) : null}
          {data.body ? <p className="mt-6 max-w-[28rem] text-muted">{data.body}</p> : null}

          {email || whatsapp || instagram ? (
            <ul className="mt-10 flex flex-col gap-1 border-t border-line pt-6">
              {email ? (
                <li>
                  <a href={`mailto:${email}`} className={detailClass}>
                    <Mail aria-hidden="true" strokeWidth={1.25} className="h-5 w-5 text-olive-soft" />
                    <span className="sr-only">{tc("email")}: </span>
                    {email}
                  </a>
                </li>
              ) : null}
              {whatsapp ? (
                <li>
                  <TrackedWhatsAppLink href={whatsapp} className={detailClass}>
                    <WhatsAppIcon className="h-5 w-5 text-olive-soft" />
                    <span>{tc("whatsapp")}</span>
                    <span className="sr-only">{tc("opensInNewTab")}</span>
                  </TrackedWhatsAppLink>
                </li>
              ) : null}
              {instagram ? (
                <li>
                  <a href={instagram} target="_blank" rel="noopener noreferrer" className={detailClass}>
                    <InstagramIcon className="h-5 w-5 text-olive-soft" />
                    <span>{tc("instagram")}</span>
                    <span className="sr-only">{tc("opensInNewTab")}</span>
                  </a>
                </li>
              ) : null}
            </ul>
          ) : null}
        </Reveal>

        <div className="lg:col-span-7">
          <ContactForm interests={interests} turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || undefined} />
        </div>
      </div>
    </section>
  );
}
