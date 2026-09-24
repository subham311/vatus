import { PortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity";
import { cn } from "@/lib/cn";
import { SanityImage, type SanityImageData } from "./SanityImage";

function Figure({ image, wide, label }: { image: SanityImageData; wide?: boolean; label: string }) {
  return (
    <figure className={cn("my-12", wide && "lg:-mx-24")}>
      <SanityImage image={image} sizes={wide ? "(min-width: 1024px) 60rem, 100vw" : "(min-width: 768px) 44rem, 100vw"} placeholderLabel={label} />
      {image?.caption ? <figcaption className="mt-3 text-sm text-muted">{image.caption}</figcaption> : null}
    </figure>
  );
}

export function ArticleBody({
  value,
  placeholderLabel,
  className,
}: {
  value: PortableTextBlock[] | null | undefined;
  placeholderLabel: string;
  className?: string;
}) {
  if (!value?.length) return null;

  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => <p className="my-6">{children}</p>,
      h2: ({ children }) => <h2 className="mt-16 mb-6 font-display text-[2.25rem] leading-tight">{children}</h2>,
      h3: ({ children }) => <h3 className="mt-12 mb-4 font-display text-[1.75rem] leading-tight">{children}</h3>,
      blockquote: ({ children }) => (
        <blockquote className="my-10 border-l border-ink pl-6 font-display text-[1.5rem] leading-snug italic">{children}</blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => <ul className="my-6 list-disc space-y-2 pl-6">{children}</ul>,
      number: ({ children }) => <ol className="my-6 list-decimal space-y-2 pl-6">{children}</ol>,
    },
    marks: {
      link: ({ children, value: mark }) => {
        const href = (mark as { href?: string } | undefined)?.href ?? "#";
        const external = /^https?:/.test(href);
        return (
          <a href={href} className="underline decoration-1 underline-offset-4" {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {children}
          </a>
        );
      },
    },
    types: {
      imageWithAlt: ({ value: img }) => <Figure image={img as SanityImageData} label={placeholderLabel} />,
      diagram: ({ value: d }) => {
        const diagram = d as { image?: SanityImageData; wide?: boolean };
        return <Figure image={diagram.image} wide={diagram.wide !== false} label={placeholderLabel} />;
      },
      pullQuote: ({ value: q }) => {
        const quote = q as { quote?: string; attribution?: string };
        return (
          <figure className="my-16 border-y border-line py-10">
            <blockquote className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight">“{quote.quote}”</blockquote>
            {quote.attribution ? <figcaption className="eyebrow mt-6 text-[0.6875rem] text-muted">{quote.attribution}</figcaption> : null}
          </figure>
        );
      },
    },
  };

  return (
    <div className={cn("text-[1.0625rem] leading-[1.75] text-ink/90", className)}>
      <PortableText value={value} components={components} />
    </div>
  );
}
