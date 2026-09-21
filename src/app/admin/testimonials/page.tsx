"use client";

import * as React from "react";
import {
  Pencil,
  Plus,
  Trash2,
  Star,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquareQuote,
  AlertTriangle,
  Sparkles,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/store";
import type { Testimonial, Review } from "@/lib/data";
import { AdminPage, Btn, Field, Modal, TableWrap, inputCls, td, th } from "@/components/site/AdminUI";

const blankTestimonial: Testimonial = {
  id: "",
  name: "",
  place: "Vijayapura, Karnataka",
  crop: "Sugarcane",
  rating: 5,
  quote: "",
  productId: "",
  productName: "",
  status: "Approved",
};

export default function AdminTestimonialsPage() {
  const {
    state,
    saveTestimonial,
    updateTestimonialStatus,
    deleteTestimonial,
    deleteAllTestimonials,
    updateReviewStatus,
    deleteReview,
    deleteAllReviews,
  } = useApp();

  // Active section: "reviews" (Product Reviews) or "testimonials" (Farmer Stories)
  const [activeSection, setActiveSection] = React.useState<"reviews" | "testimonials">("reviews");

  // Testimonials state
  const [editingTestimonial, setEditingTestimonial] = React.useState<Testimonial | null>(null);
  const [isNewTestimonial, setIsNewTestimonial] = React.useState(false);
  const [confirmDeleteTestimonialId, setConfirmDeleteTestimonialId] = React.useState<string | null>(null);
  const [confirmClearAllTestimonials, setConfirmClearAllTestimonials] = React.useState(false);

  // Reviews state
  const [confirmDeleteReviewId, setConfirmDeleteReviewId] = React.useState<string | null>(null);
  const [confirmClearAllReviews, setConfirmClearAllReviews] = React.useState(false);

  // Async loading state
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [clearingAll, setClearingAll] = React.useState(false);

  // Filters & Search
  const [tabFilter, setTabFilter] = React.useState<"all" | "Pending" | "Approved" | "Rejected">("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Product Reviews counts
  const pendingReviewsCount = state.reviews.filter((r) => r.status === "Pending").length;
  const approvedReviewsCount = state.reviews.filter((r) => r.status === "Approved" || !r.status).length;
  const rejectedReviewsCount = state.reviews.filter((r) => r.status === "Rejected").length;

  // Testimonials counts
  const pendingTestimonialsCount = state.testimonials.filter((t) => t.status === "Pending").length;
  const approvedTestimonialsCount = state.testimonials.filter((t) => t.status === "Approved" || !t.status).length;
  const rejectedTestimonialsCount = state.testimonials.filter((t) => t.status === "Rejected").length;

  // Filtered Product Reviews
  const filteredReviews = state.reviews.filter((r) => {
    const effectiveStatus = r.status || "Approved";
    if (tabFilter !== "all" && effectiveStatus !== tabFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const product = state.products.find((p) => p.id === r.productId);
      const match =
        r.name?.toLowerCase().includes(q) ||
        r.comment?.toLowerCase().includes(q) ||
        r.productId?.toLowerCase().includes(q) ||
        product?.name?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Filtered Testimonials
  const filteredTestimonials = state.testimonials.filter((t) => {
    const effectiveStatus = t.status || "Approved";
    if (tabFilter !== "all" && effectiveStatus !== tabFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        t.name?.toLowerCase().includes(q) ||
        t.place?.toLowerCase().includes(q) ||
        t.crop?.toLowerCase().includes(q) ||
        t.quote?.toLowerCase().includes(q) ||
        t.productName?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Review actions
  const handleApproveReview = async (id: string, reviewerName: string) => {
    const ok = await updateReviewStatus(id, "Approved");
    if (ok) {
      toast.success(`Approved product review by ${reviewerName}. It is now live on the store!`);
    } else {
      toast.error("Failed to approve review");
    }
  };

  const handleRejectReview = async (id: string, reviewerName: string) => {
    const ok = await updateReviewStatus(id, "Rejected");
    if (ok) {
      toast.info(`Marked review by ${reviewerName} as Rejected (hidden from store)`);
    } else {
      toast.error("Failed to reject review");
    }
  };

  const handleDeleteReview = async () => {
    if (!confirmDeleteReviewId) return;
    setDeleting(true);
    const ok = await deleteReview(confirmDeleteReviewId);
    setDeleting(false);
    if (ok) {
      toast.success("Review permanently deleted from MongoDB");
      setConfirmDeleteReviewId(null);
    } else {
      toast.error("Failed to delete review");
    }
  };

  const handleClearAllReviews = async () => {
    setClearingAll(true);
    const ok = await deleteAllReviews();
    setClearingAll(false);
    if (ok) {
      toast.success("All product reviews deleted from MongoDB");
      setConfirmClearAllReviews(false);
    } else {
      toast.error("Failed to delete all reviews");
    }
  };

  // Testimonial actions
  const handleSaveTestimonial = async () => {
    if (!editingTestimonial) return;
    if (!editingTestimonial.name.trim() || !editingTestimonial.quote.trim()) {
      toast.error("Farmer name and feedback quote are required");
      return;
    }

    setSaving(true);
    const ok = await saveTestimonial(editingTestimonial, isNewTestimonial);
    setSaving(false);
    if (ok) {
      toast.success(isNewTestimonial ? "Testimonial created and stored in MongoDB" : "Testimonial updated");
      setEditingTestimonial(null);
    } else {
      toast.error("Failed to save testimonial");
    }
  };

  const handleApproveTestimonial = async (id: string, name: string) => {
    const ok = await updateTestimonialStatus(id, "Approved");
    if (ok) {
      toast.success(`Approved testimonial from ${name}. It is now live on the website!`);
    } else {
      toast.error("Failed to approve testimonial");
    }
  };

  const handleRejectTestimonial = async (id: string, name: string) => {
    const ok = await updateTestimonialStatus(id, "Rejected");
    if (ok) {
      toast.info(`Marked testimonial from ${name} as Rejected`);
    } else {
      toast.error("Failed to reject testimonial");
    }
  };

  const handleDeleteTestimonial = async () => {
    if (!confirmDeleteTestimonialId) return;
    setDeleting(true);
    const ok = await deleteTestimonial(confirmDeleteTestimonialId);
    setDeleting(false);
    if (ok) {
      toast.success("Testimonial removed from MongoDB");
      setConfirmDeleteTestimonialId(null);
    } else {
      toast.error("Failed to delete testimonial");
    }
  };

  const handleClearAllTestimonials = async () => {
    setClearingAll(true);
    const ok = await deleteAllTestimonials();
    setClearingAll(false);
    if (ok) {
      toast.success("All farmer testimonials deleted from MongoDB");
      setConfirmClearAllTestimonials(false);
    } else {
      toast.error("Failed to delete all testimonials");
    }
  };

  return (
    <AdminPage
      title="Feedback & Review Moderation"
      subtitle="Review and moderate product customer reviews and farmer stories stored in MongoDB."
      action={
        <div className="flex flex-wrap items-center gap-2">
          {activeSection === "reviews" && state.reviews.length > 0 && (
            <button
              type="button"
              onClick={() => setConfirmClearAllReviews(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2 text-xs font-bold text-destructive hover:bg-destructive/20 transition-all shadow-sm cursor-pointer"
            >
              <Trash2 className="h-4 w-4" /> Delete All Reviews
            </button>
          )}

          {activeSection === "testimonials" && (
            <>
              {state.testimonials.length > 0 && (
                <button
                  type="button"
                  onClick={() => setConfirmClearAllTestimonials(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2 text-xs font-bold text-destructive hover:bg-destructive/20 transition-all shadow-sm cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" /> Delete All Testimonials
                </button>
              )}
              <Btn
                onClick={() => {
                  setIsNewTestimonial(true);
                  setEditingTestimonial(blankTestimonial);
                }}
              >
                <span className="inline-flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Add Testimonial
                </span>
              </Btn>
            </>
          )}
        </div>
      }
    >
      {/* Top Segmented Navigation Toggle */}
      <div className="flex items-center rounded-2xl border border-border bg-muted/30 p-1.5 max-w-xl mb-6">
        <button
          type="button"
          onClick={() => {
            setActiveSection("reviews");
            setTabFilter("all");
          }}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSection === "reviews"
              ? "bg-card text-foreground shadow-sm border border-border/80"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Package className="h-4 w-4 text-primary" />
          <span>Product Reviews ({state.reviews.length})</span>
          {pendingReviewsCount > 0 && (
            <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white animate-pulse">
              {pendingReviewsCount} Pending
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveSection("testimonials");
            setTabFilter("all");
          }}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSection === "testimonials"
              ? "bg-card text-foreground shadow-sm border border-border/80"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageSquareQuote className="h-4 w-4 text-secondary" />
          <span>Farmer Stories ({state.testimonials.length})</span>
          {pendingTestimonialsCount > 0 && (
            <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white animate-pulse">
              {pendingTestimonialsCount} Pending
            </span>
          )}
        </button>
      </div>

      {/* SECTION 1: PRODUCT REVIEWS */}
      {activeSection === "reviews" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Metric Cards */}
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase">Total Product Reviews</span>
                <Package className="h-4 w-4 text-primary" />
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{state.reviews.length}</p>
            </div>

            <div
              onClick={() => setTabFilter("Pending")}
              className={`cursor-pointer rounded-2xl border p-5 shadow-xs transition-all ${
                tabFilter === "Pending"
                  ? "border-amber-500 bg-amber-500/10"
                  : "border-border bg-card hover:bg-muted/40"
              }`}
            >
              <div className="flex items-center justify-between text-amber-600">
                <span className="text-xs font-semibold uppercase">Pending Moderation</span>
                <Clock className="h-4 w-4" />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-2xl font-bold text-amber-600">{pendingReviewsCount}</p>
                {pendingReviewsCount > 0 && (
                  <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white animate-pulse">
                    Action Required
                  </span>
                )}
              </div>
            </div>

            <div
              onClick={() => setTabFilter("Approved")}
              className={`cursor-pointer rounded-2xl border p-5 shadow-xs transition-all ${
                tabFilter === "Approved"
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-border bg-card hover:bg-muted/40"
              }`}
            >
              <div className="flex items-center justify-between text-emerald-600">
                <span className="text-xs font-semibold uppercase">Approved &amp; Live</span>
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <p className="mt-2 text-2xl font-bold text-emerald-600">{approvedReviewsCount}</p>
            </div>

            <div
              onClick={() => setTabFilter("Rejected")}
              className={`cursor-pointer rounded-2xl border p-5 shadow-xs transition-all ${
                tabFilter === "Rejected"
                  ? "border-rose-500 bg-rose-500/10"
                  : "border-border bg-card hover:bg-muted/40"
              }`}
            >
              <div className="flex items-center justify-between text-rose-600">
                <span className="text-xs font-semibold uppercase">Rejected / Hidden</span>
                <XCircle className="h-4 w-4" />
              </div>
              <p className="mt-2 text-2xl font-bold text-rose-600">{rejectedReviewsCount}</p>
            </div>
          </div>

          {/* Filter Tabs and Search */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: "all", label: `All Reviews (${state.reviews.length})` },
                { id: "Pending", label: `Pending Approval (${pendingReviewsCount})` },
                { id: "Approved", label: `Approved (${approvedReviewsCount})` },
                { id: "Rejected", label: `Rejected (${rejectedReviewsCount})` },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTabFilter(t.id as typeof tabFilter)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    tabFilter === t.id
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "border border-border bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-72">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reviews by product, customer, or note…"
                className={inputCls}
              />
            </div>
          </div>

          {/* Reviews Table */}
          <TableWrap>
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className={th}>Product</th>
                <th className={th}>Farmer / Reviewer</th>
                <th className={th}>Rating</th>
                <th className={th}>Review / Field Observation</th>
                <th className={th}>Status</th>
                <th className={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-muted-foreground text-sm">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" />
                    <p className="font-semibold text-foreground">No product reviews found.</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {tabFilter === "Pending"
                        ? "Great! All submitted crop reviews have been moderated."
                        : "Reviews submitted by signed-in farmers on product detail pages will appear here."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredReviews.map((r) => {
                  const status = r.status || "Approved";
                  const product = state.products.find((p) => p.id === r.productId);
                  const reviewId = r.id;

                  return (
                    <tr key={reviewId} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className={td}>
                        <div className="flex items-center gap-3">
                          {product?.image && (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-10 w-10 rounded-xl object-cover border border-border bg-muted shrink-0"
                            />
                          )}
                          <div>
                            <p className="font-bold text-foreground line-clamp-1">{product?.name || r.productId}</p>
                            {product?.category && (
                              <p className="text-xs text-muted-foreground capitalize">{product.category}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className={`${td} font-medium text-foreground`}>
                        <div>
                          <p className="font-bold text-foreground">{r.name}</p>
                          <p className="text-[11px] text-muted-foreground">{r.date}</p>
                        </div>
                      </td>

                      <td className={td}>
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <span>{r.rating}</span>
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                        </div>
                      </td>

                      <td className={`${td} max-w-xs sm:max-w-md text-xs text-foreground/90`}>
                        <p className="line-clamp-3 italic">&ldquo;{r.comment}&rdquo;</p>
                      </td>

                      <td className={td}>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            status === "Approved"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : status === "Rejected"
                              ? "bg-rose-100 text-rose-800 border border-rose-300"
                              : "bg-amber-100 text-amber-800 border border-amber-300 animate-pulse"
                          }`}
                        >
                          {status === "Approved" ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5" /> Approved &amp; Live
                            </>
                          ) : status === "Rejected" ? (
                            <>
                              <XCircle className="h-3.5 w-3.5" /> Rejected
                            </>
                          ) : (
                            <>
                              <Clock className="h-3.5 w-3.5" /> Pending Approval
                            </>
                          )}
                        </span>
                      </td>

                      <td className={td}>
                        <div className="flex items-center gap-1.5">
                          {status !== "Approved" && (
                            <button
                              onClick={() => handleApproveReview(reviewId, r.name)}
                              className="rounded-lg border border-emerald-300 bg-emerald-50 p-2 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                              title="Approve & Publish to Product Page"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          )}
                          {status !== "Rejected" && (
                            <button
                              onClick={() => handleRejectReview(reviewId, r.name)}
                              className="rounded-lg border border-rose-300 bg-rose-50 p-2 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                              title="Reject / Hide from Store"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setConfirmDeleteReviewId(reviewId)}
                            className="rounded-lg border border-border p-2 text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                            title="Delete Review Permanently"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </TableWrap>
        </div>
      )}

      {/* SECTION 2: FARMER TESTIMONIALS */}
      {activeSection === "testimonials" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Metric Cards */}
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold uppercase">Total Farmer Stories</span>
                <MessageSquareQuote className="h-4 w-4 text-primary" />
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{state.testimonials.length}</p>
            </div>

            <div
              onClick={() => setTabFilter("Pending")}
              className={`cursor-pointer rounded-2xl border p-5 shadow-xs transition-all ${
                tabFilter === "Pending"
                  ? "border-amber-500 bg-amber-500/10"
                  : "border-border bg-card hover:bg-muted/40"
              }`}
            >
              <div className="flex items-center justify-between text-amber-600">
                <span className="text-xs font-semibold uppercase">Pending Moderation</span>
                <Clock className="h-4 w-4" />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-2xl font-bold text-amber-600">{pendingTestimonialsCount}</p>
                {pendingTestimonialsCount > 0 && (
                  <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white animate-pulse">
                    Action Required
                  </span>
                )}
              </div>
            </div>

            <div
              onClick={() => setTabFilter("Approved")}
              className={`cursor-pointer rounded-2xl border p-5 shadow-xs transition-all ${
                tabFilter === "Approved"
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-border bg-card hover:bg-muted/40"
              }`}
            >
              <div className="flex items-center justify-between text-emerald-600">
                <span className="text-xs font-semibold uppercase">Approved &amp; Live</span>
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <p className="mt-2 text-2xl font-bold text-emerald-600">{approvedTestimonialsCount}</p>
            </div>

            <div
              onClick={() => setTabFilter("Rejected")}
              className={`cursor-pointer rounded-2xl border p-5 shadow-xs transition-all ${
                tabFilter === "Rejected"
                  ? "border-rose-500 bg-rose-500/10"
                  : "border-border bg-card hover:bg-muted/40"
              }`}
            >
              <div className="flex items-center justify-between text-rose-600">
                <span className="text-xs font-semibold uppercase">Rejected / Hidden</span>
                <XCircle className="h-4 w-4" />
              </div>
              <p className="mt-2 text-2xl font-bold text-rose-600">{rejectedTestimonialsCount}</p>
            </div>
          </div>

          {/* Filter Tabs and Search */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: "all", label: `All Testimonials (${state.testimonials.length})` },
                { id: "Pending", label: `Pending Approval (${pendingTestimonialsCount})` },
                { id: "Approved", label: `Approved (${approvedTestimonialsCount})` },
                { id: "Rejected", label: `Rejected (${rejectedTestimonialsCount})` },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTabFilter(t.id as typeof tabFilter)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    tabFilter === t.id
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "border border-border bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-72">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by farmer, crop or feedback…"
                className={inputCls}
              />
            </div>
          </div>

          {/* Testimonials Table */}
          <TableWrap>
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className={th}>Farmer &amp; Product</th>
                <th className={th}>Location &amp; Crop</th>
                <th className={th}>Rating</th>
                <th className={th}>Feedback / Quote</th>
                <th className={th}>Status</th>
                <th className={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTestimonials.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-muted-foreground text-sm">
                    <MessageSquareQuote className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" />
                    <p className="font-semibold text-foreground">No testimonials match your filter.</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {tabFilter === "Pending"
                        ? "Great! All submitted testimonials have been moderated."
                        : "Click 'Add Testimonial' to publish a featured farmer story."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTestimonials.map((t) => {
                  const status = t.status || "Approved";
                  const testimonialId = t.id;

                  return (
                    <tr key={testimonialId} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className={`${td} font-bold text-foreground`}>
                        <div>
                          <span>{t.name}</span>
                          {t.productName && (
                            <p className="text-xs font-normal text-primary flex items-center gap-1 mt-0.5">
                              <Sparkles className="h-3 w-3" /> {t.productName}
                            </p>
                          )}
                          {t.date && <p className="text-[11px] text-muted-foreground">{t.date}</p>}
                        </div>
                      </td>
                      <td className={td}>
                        <div>
                          <p className="text-xs font-medium text-foreground">{t.place}</p>
                          <span className="inline-block mt-0.5 rounded-md bg-secondary/10 px-2 py-0.5 text-xs font-semibold text-secondary">
                            {t.crop}
                          </span>
                        </div>
                      </td>
                      <td className={td}>
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <span>{t.rating}</span>
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                        </div>
                      </td>
                      <td className={`${td} max-w-md text-xs text-muted-foreground line-clamp-2`}>
                        &ldquo;{t.quote}&rdquo;
                      </td>
                      <td className={td}>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            status === "Approved"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : status === "Rejected"
                              ? "bg-rose-100 text-rose-800 border border-rose-300"
                              : "bg-amber-100 text-amber-800 border border-amber-300 animate-pulse"
                          }`}
                        >
                          {status === "Approved" ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5" /> Approved
                            </>
                          ) : status === "Rejected" ? (
                            <>
                              <XCircle className="h-3.5 w-3.5" /> Rejected
                            </>
                          ) : (
                            <>
                              <Clock className="h-3.5 w-3.5" /> Pending Approval
                            </>
                          )}
                        </span>
                      </td>
                      <td className={td}>
                        <div className="flex items-center gap-1.5">
                          {status !== "Approved" && (
                            <button
                              onClick={() => handleApproveTestimonial(testimonialId, t.name)}
                              className="rounded-lg border border-emerald-300 bg-emerald-50 p-2 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                              title="Approve & Publish to Site"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          )}
                          {status !== "Rejected" && (
                            <button
                              onClick={() => handleRejectTestimonial(testimonialId, t.name)}
                              className="rounded-lg border border-rose-300 bg-rose-50 p-2 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                              title="Reject / Hide from Site"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setIsNewTestimonial(false);
                              setEditingTestimonial(t);
                            }}
                            className="rounded-lg border border-border p-2 hover:bg-muted text-foreground cursor-pointer"
                            title="Edit Feedback"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteTestimonialId(testimonialId)}
                            className="rounded-lg border border-border p-2 text-destructive hover:bg-destructive/10 cursor-pointer"
                            title="Delete Feedback"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </TableWrap>
        </div>
      )}

      {/* Add / Edit Testimonial Modal */}
      <Modal
        open={!!editingTestimonial}
        onClose={() => setEditingTestimonial(null)}
        title={isNewTestimonial ? "Add Farmer Testimonial" : "Edit Testimonial"}
      >
        {editingTestimonial && (
          <div className="space-y-4 min-w-0 w-full">
            <Field label="Farmer Name *">
              <input
                className={inputCls}
                value={editingTestimonial.name}
                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                placeholder="e.g. Suresh Patil"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
              <Field label="Village / District">
                <input
                  className={inputCls}
                  value={editingTestimonial.place}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, place: e.target.value })}
                  placeholder="Vijayapura, Karnataka"
                />
              </Field>
              <Field label="Crop Grown">
                <input
                  className={inputCls}
                  value={editingTestimonial.crop}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, crop: e.target.value })}
                  placeholder="Sugarcane / Cotton"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
              <Field label="Rating (1 to 5 Stars)">
                <select
                  className={inputCls}
                  value={editingTestimonial.rating}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: Number(e.target.value) })}
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Good</option>
                  <option value={2}>2 Stars - Average</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </Field>

              <Field label="Approval Status">
                <select
                  className={inputCls}
                  value={editingTestimonial.status || "Approved"}
                  onChange={(e) =>
                    setEditingTestimonial({
                      ...editingTestimonial,
                      status: e.target.value as "Pending" | "Approved" | "Rejected",
                    })
                  }
                >
                  <option value="Approved">Approved (Publicly Visible)</option>
                  <option value="Pending">Pending (Awaiting Moderation)</option>
                  <option value="Rejected">Rejected (Hidden)</option>
                </select>
              </Field>
            </div>

            <Field label="Related Product (Optional)">
              <select
                className={inputCls}
                value={editingTestimonial.productId || ""}
                onChange={(e) => {
                  const selProd = state.products.find((p) => p.id === e.target.value);
                  setEditingTestimonial({
                    ...editingTestimonial,
                    productId: e.target.value,
                    productName: selProd?.name || "",
                  });
                }}
              >
                <option value="">General Farm Solution / Experience</option>
                {state.products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.category})
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Farmer Feedback / Quote *">
              <textarea
                rows={4}
                className={inputCls}
                value={editingTestimonial.quote}
                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                placeholder="Describe crop yield increase, vegetative vigor, disease resistance observations..."
              />
            </Field>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <Btn variant="ghost" onClick={() => setEditingTestimonial(null)}>
                Cancel
              </Btn>
              <Btn onClick={handleSaveTestimonial} disabled={saving}>
                {saving ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                  </span>
                ) : (
                  "Save Testimonial"
                )}
              </Btn>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Single Review Modal */}
      <Modal open={!!confirmDeleteReviewId} onClose={() => setConfirmDeleteReviewId(null)} title="Delete Review?">
        <p className="text-sm text-muted-foreground">
          Are you sure you want to permanently delete this product review from MongoDB and update the product rating?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Btn variant="ghost" onClick={() => setConfirmDeleteReviewId(null)} disabled={deleting}>
            Cancel
          </Btn>
          <Btn variant="danger" onClick={handleDeleteReview} disabled={deleting}>
            {deleting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Deleting...
              </span>
            ) : (
              "Delete Review"
            )}
          </Btn>
        </div>
      </Modal>

      {/* Clear All Reviews Modal */}
      <Modal open={confirmClearAllReviews} onClose={() => setConfirmClearAllReviews(false)} title="Delete All Reviews?">
        <div className="flex items-start gap-3 text-sm text-muted-foreground">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <p>
            Are you sure you want to permanently delete all <strong>{state.reviews.length}</strong> product reviews from MongoDB? This will also reset product review metrics.
          </p>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Btn variant="ghost" onClick={() => setConfirmClearAllReviews(false)} disabled={clearingAll}>
            Cancel
          </Btn>
          <Btn variant="danger" onClick={handleClearAllReviews} disabled={clearingAll}>
            {clearingAll ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Deleting All...
              </span>
            ) : (
              "Yes, Delete All Reviews"
            )}
          </Btn>
        </div>
      </Modal>

      {/* Delete Single Testimonial Modal */}
      <Modal open={!!confirmDeleteTestimonialId} onClose={() => setConfirmDeleteTestimonialId(null)} title="Delete Testimonial?">
        <p className="text-sm text-muted-foreground">
          Are you sure you want to remove this feedback from MongoDB and the website?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Btn variant="ghost" onClick={() => setConfirmDeleteTestimonialId(null)} disabled={deleting}>
            Cancel
          </Btn>
          <Btn variant="danger" onClick={handleDeleteTestimonial} disabled={deleting}>
            {deleting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Deleting...
              </span>
            ) : (
              "Delete"
            )}
          </Btn>
        </div>
      </Modal>

      {/* Clear All Testimonials Modal */}
      <Modal open={confirmClearAllTestimonials} onClose={() => setConfirmClearAllTestimonials(false)} title="Delete All Testimonials?">
        <div className="flex items-start gap-3 text-sm text-muted-foreground">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <p>
            Are you sure you want to permanently delete all <strong>{state.testimonials.length}</strong> farmer feedbacks from MongoDB? This action cannot be undone.
          </p>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Btn variant="ghost" onClick={() => setConfirmClearAllTestimonials(false)} disabled={clearingAll}>
            Cancel
          </Btn>
          <Btn variant="danger" onClick={handleClearAllTestimonials} disabled={clearingAll}>
            {clearingAll ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Deleting All...
              </span>
            ) : (
              "Yes, Delete All Testimonials"
            )}
          </Btn>
        </div>
      </Modal>
    </AdminPage>
  );
}
