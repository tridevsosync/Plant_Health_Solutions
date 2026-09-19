"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Facebook, Linkedin, Twitter } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/store";

export default function BlogDetailPage() {
  const params = useParams();
  const id = (params?.id as string) ?? "";
  const { state } = useApp();
  const blog = state.blogs.find((b) => b.id === id);
  const [comments, setComments] = React.useState<{ name: string; text: string }[]>([]);
  const [form, setForm] = React.useState({ name: "", text: "" });

  if (!blog) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-primary">Article not found</h1>
        <Link href="/blog" className="mt-4 inline-block text-secondary underline">Back to blog</Link>
      </div>
    );
  }

  return (
    <div>
      <section className="relative isolate overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#122b17]/95 via-[#183a1f]/90 to-[#285724]/80 backdrop-blur-[0.5px]" />
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-20 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent mb-3">
            {blog.category}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white">
            {blog.title}
          </h1>
          <p className="mt-3 text-sm text-white/85">
            By {blog.author} · {blog.date} · {blog.readTime} min read
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 py-12">
        <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
          {blog.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

      <div className="mt-8 flex items-center gap-3 border-y border-border py-4">
        <span className="text-sm font-medium">Share:</span>
        {[Facebook, Twitter, Linkedin].map((Icon, i) => (
          <button key={i} onClick={() => toast.success("Link copied for sharing")} className="rounded-full border border-border p-2">
            <Icon className="h-4 w-4 text-primary" />
          </button>
        ))}
      </div>

      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold text-primary">Comments ({comments.length})</h2>
        <div className="mt-4 space-y-3">
          {comments.map((c, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4">
              <p className="font-semibold">{c.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{c.text}</p>
            </div>
          ))}
        </div>
        <form
          className="mt-4 grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.name || !form.text) return;
            setComments([...comments, form]);
            setForm({ name: "", text: "" });
            toast.success("Comment posted");
          }}
        >
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
          />
          <textarea
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            rows={3}
            placeholder="Write a comment"
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
          />
          <button className="w-fit rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground">Post Comment</button>
        </form>
      </section>
    </article>
    </div>
  );
}
