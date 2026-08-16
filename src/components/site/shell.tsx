import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

export function Container({
  children,
  className = "",
  maxWidth = "max-w-7xl",
}: {
  children: React.ReactNode;
  className?: string;
  /** Overrides the default max-width. Use instead of appending a conflicting max-w class. */
  maxWidth?: "max-w-3xl" | "max-w-4xl" | "max-w-5xl" | "max-w-6xl" | "max-w-7xl";
}) {
  return (
    <div
      className={cn(
        `mx-auto w-full ${maxWidth} px-4 sm:px-6 lg:px-8`,
        className
      )}
    >
      {children}
    </div>
  );
}

export function Eyebrow({
  children,
  light = false,
  className = "",
}: {
  children: React.ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em]",
        light ? "text-gold-300" : "text-gold-600",
        className
      )}
    >
      <span
        aria-hidden
        className={cn("h-px w-8", light ? "bg-gold-300" : "bg-gold-500")}
      />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  dark = true,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  dark?: boolean;
}) {
  const centered = align === "center";
  return (
    <div className={cn(centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl")}>
      {eyebrow && (
        <Eyebrow light={dark} className={cn(centered && "justify-center")}>
          {eyebrow}
        </Eyebrow>
      )}
      <h2
        className={cn(
          "font-display mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]",
          dark ? "text-cream" : "text-slate-100"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed sm:text-lg",
            dark ? "text-cream/65" : "text-slate-300"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="border-b border-gold-500/20 bg-[#08090c] py-14 sm:py-18">
      <Container className="text-center">
        {eyebrow && (
          <Reveal variant="up" className="flex justify-center">
            <Eyebrow light className="justify-center">{eyebrow}</Eyebrow>
          </Reveal>
        )}
        <Reveal variant="up" delay={100}>
          <h1 className="font-display mt-4 text-balance text-4xl font-semibold tracking-tight text-slate-100 sm:text-5xl">
            {title}
          </h1>
        </Reveal>
        {description && (
          <Reveal variant="up" delay={200}>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-slate-300 sm:text-lg">
              {description}
            </p>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
