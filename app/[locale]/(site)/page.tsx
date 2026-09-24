import { setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id="main" className="container-site section-y">
      <SectionHeading as="h1" size="display">
        Homes designed for better living.
      </SectionHeading>
      <div className="mt-10">
        <Button href="/#contact">Explore our work</Button>
      </div>
    </main>
  );
}
