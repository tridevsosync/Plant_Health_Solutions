import type { ReactNode } from "react";

export function PageHero({
  title,
  subtitle,
  image,
  kicker,
}: {
  title: string;
  subtitle: string;
  image?: string;
  kicker?: string;
}) {
  const bgImage =
    image ??
    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&q=80";

  return (
    <section className="relative isolate overflow-hidden">
      <img
        src={bgImage}
        alt=""
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#122b17]/95 via-[#183a1f]/90 to-[#285724]/80 backdrop-blur-[0.5px]" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8 text-center">
        {kicker && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent mb-3">
            {kicker}
          </span>
        )}
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-white/85 leading-relaxed">
          {subtitle}
        </p>
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="mb-8 text-center">
            {kicker && (
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                {kicker}
              </span>
            )}
            <h2 className="mt-2 font-display text-3xl font-bold text-primary md:text-4xl">
              {title}
            </h2>
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export function Prose({
  title,
  subtitle,
  paragraphs,
  image,
}: {
  title: string;
  subtitle?: string;
  paragraphs: string[];
  image?: string;
}) {
  return (
    <div>
      <PageHero
        title={title}
        subtitle={
          subtitle ??
          "Plant Health Solutions Pvt. Ltd. — Agricultural Research, Manufacturing & Extension."
        }
        image={
          image ??
          "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&q=80"
        }
      />
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-card p-8 sm:p-12 shadow-sm space-y-5 text-base leading-relaxed text-foreground/80">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
