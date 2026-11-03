"use client";

import * as React from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";

export function AdSection() {
  const { state } = useApp();
  const settings = state.settings;

  const showAd = settings.showAdSection !== false;
  const image = settings.adSectionImage;
  const link = settings.adSectionLink;
  const title = settings.adSectionTitle || "Special Advertisement";

  if (!showAd || !image) {
    return null;
  }

  const content = (
    <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card shadow-md transition-all duration-300 hover:shadow-xl group">
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="w-full h-auto max-h-[440px] md:max-h-[500px] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
    </div>
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {link ? (
        <Link href={link} className="block cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded-3xl">
          {content}
        </Link>
      ) : (
        content
      )}
    </section>
  );
}
