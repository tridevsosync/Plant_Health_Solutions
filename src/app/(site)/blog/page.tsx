"use client";

import * as React from "react";
import Link from "next/link";
import { PageHero } from "@/components/site/Section";
import { Pagination } from "@/components/site/Pagination";
import { useApp } from "@/lib/store";

export default function BlogListPage() {
  const { state } = useApp();
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState("");
  const [page, setPage] = React.useState(1);
  const pageSize = 6;

  const cats = Array.from(new Set(state.blogs.map((b) => b.category)));
  const featured = state.blogs.find((b) => b.featured);
  const list = state.blogs.filter(
    (b) => (!q || b.title.toLowerCase().includes(q.toLowerCase())) && (!cat || b.category === cat),
  );

  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, list.length);
  const paginatedList = list.slice(startIndex, endIndex);

  return (
    <div>
      <PageHero title="Research & Agronomy Blog" subtitle="Practical guidance from the PHS research and extension team." />
      <div className="mx-auto max-w-7xl px-4 py-12">
        {featured && (
          <Link href={`/blog/${featured.id}`} className="mb-10 grid overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:grid-cols-2">
            <img src={featured.image} alt={featured.title} className="h-64 w-full object-cover md:h-full" />
            <div className="p-8">
              <span className="text-xs font-semibold uppercase tracking-wide text-secondary">Featured · {featured.category}</span>
              <h2 className="mt-2 font-display text-2xl font-bold text-primary">{featured.title}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{featured.excerpt}</p>
              <p className="mt-4 text-xs text-muted-foreground">{featured.author} · {featured.date} · {featured.readTime} min read</p>
            </div>
          </Link>
        )}

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search articles"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm"
          />
          <button
            onClick={() => {
              setCat("");
              setPage(1);
            }}
            className={`rounded-full px-4 py-1.5 text-sm ${!cat ? "bg-primary text-primary-foreground" : "border border-border bg-card"}`}
          >
            All
          </button>
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCat(c);
                setPage(1);
              }}
              className={`rounded-full px-4 py-1.5 text-sm ${cat === c ? "bg-primary text-primary-foreground" : "border border-border bg-card"}`}
            >
              {c}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
            No articles found matching your criteria.
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedList.map((b) => (
                <Link key={b.id} href={`/blog/${b.id}`} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                  <img src={b.image} alt={b.title} className="h-44 w-full object-cover" />
                  <div className="p-5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-secondary">{b.category}</span>
                    <h3 className="mt-2 font-display text-lg font-semibold leading-snug">{b.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{b.excerpt}</p>
                    <p className="mt-3 text-xs text-muted-foreground">{b.author} · {b.date} · {b.readTime} min read</p>
                  </div>
                </Link>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={list.length}
              pageSize={pageSize}
              onPageChange={setPage}
              showPageSize={false}
            />
          </>
        )}
      </div>
    </div>
  );
}
