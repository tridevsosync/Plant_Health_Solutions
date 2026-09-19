import type { ReactNode } from "react";

export function PageHero({ title, subtitle, image }: { title: string; subtitle: string; image?: string }) {
  return (
    <section className="relative isolate overflow-hidden">
      <img
        src={image ?? "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1920&q=70"}
        alt=""
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-primary/85" />
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-bold text-white md:text-5xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-white/85 md:text-base">{subtitle}</p>
      </div>
    </section>
  );
}

export function Section({
  title,
  kicker,
  children,
  muted,
}: {
  title?: string;
  kicker?: string;
  children: ReactNode;
  muted?: boolean;
}) {
  return (
    <section className={muted ? "bg-muted/60 py-14" : "py-14"}>
      <div className="mx-auto max-w-7xl px-4">
        {title && (
          <div className="mb-8 text-center">
            {kicker && <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">{kicker}</span>}
            <h2 className="mt-2 font-display text-3xl font-bold text-primary md:text-4xl">{title}</h2>
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export function Prose({ title, paragraphs }: { title: string; paragraphs: string[] }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-display text-3xl font-bold text-primary">{title}</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}
