import { PortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity";
import { cn } from "@/lib/cn";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-medium text-current">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  },
};

export function RichText({
  value,
  className,
}: {
  value: PortableTextBlock[] | null | undefined;
  className?: string;
}) {
  if (!value?.length) return null;
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <PortableText value={value} components={components} />
    </div>
  );
}
