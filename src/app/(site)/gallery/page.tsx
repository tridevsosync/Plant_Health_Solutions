"use client";

import * as React from "react";
import {
  Image as ImageIcon,
  Video,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Sparkles,
  Calendar,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { galleryItems as seedGallery, type GalleryItem } from "@/lib/data";
import { getVideoInfo } from "@/lib/videoUtils";
import { cn } from "@/lib/utils";

export default function GalleryPage() {
  const { state } = useApp();
  const [selectedType, setSelectedType] = React.useState<"all" | "photo" | "video">("all");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Modal / Lightbox state
  const [activeItemIndex, setActiveItemIndex] = React.useState<number | null>(null);

  const rawList = state.gallery && state.gallery.length > 0 ? state.gallery : seedGallery;
  const galleryList = rawList.filter(
    (item) => (item.status || "Active").toLowerCase() === "active"
  );

  // Extract unique categories
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    galleryList.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ["All", ...Array.from(set)];
  }, [galleryList]);

  // Filtered items
  const filteredList = React.useMemo(() => {
    return galleryList.filter((item) => {
      const matchesType = selectedType === "all" || item.type === selectedType;
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesType && matchesCategory && matchesSearch;
    });
  }, [galleryList, selectedType, selectedCategory, searchQuery]);

  const activeItem: GalleryItem | null =
    activeItemIndex !== null && filteredList[activeItemIndex]
      ? filteredList[activeItemIndex]
      : null;

  const handleNext = React.useCallback(() => {
    if (activeItemIndex === null) return;
    setActiveItemIndex((prev) => (prev !== null && prev < filteredList.length - 1 ? prev + 1 : 0));
  }, [activeItemIndex, filteredList.length]);

  const handlePrev = React.useCallback(() => {
    if (activeItemIndex === null) return;
    setActiveItemIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredList.length - 1));
  }, [activeItemIndex, filteredList.length]);

  // Keyboard controls for modal navigation
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (activeItemIndex === null) return;
      if (e.key === "Escape") setActiveItemIndex(null);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeItemIndex, handleNext, handlePrev]);

  return (
    <div className="min-h-screen bg-[#fbf8f1] pb-24 text-[#1a3820]">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-[#18361e] py-14 sm:py-16 text-[#f4efe4]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#a8d672_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-[#a8d672] backdrop-blur-xs border border-white/10 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Visual Showcase</span>
          </div>

          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
            Photo &amp; Video <span className="text-[#a8d672]">Gallery</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-[#d1dbcd] leading-relaxed">
            Explore our cutting-edge manufacturing facility in Vijayapura, biological research labs, field trials, and farmer success stories across India.
          </p>

          {/* Quick Metrics */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold text-[#f4efe4]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#a8d672]" />
              <span>Verified Field Trials</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#a8d672]" />
              <span>Certified Bio-Production Unit</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#a8d672]" />
              <span>Real Farmer Results</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        {/* Filter and Search Container */}
        <div className="rounded-3xl border border-[#e4dbca] bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Type Tabs: All / Photos / Videos */}
            <div className="flex rounded-2xl bg-[#f4efe4] p-1.5 border border-[#e4dbca] self-start sm:self-auto">
              <button
                onClick={() => {
                  setSelectedType("all");
                  setActiveItemIndex(null);
                }}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all",
                  selectedType === "all"
                    ? "bg-[#18361e] text-white shadow-sm"
                    : "text-[#5c6b59] hover:text-[#18361e]"
                )}
              >
                <Layers className="h-4 w-4" />
                <span>All Media</span>
                <span className="ml-1 rounded-full bg-black/10 px-2 py-0.5 text-[10px]">
                  {galleryList.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setSelectedType("photo");
                  setActiveItemIndex(null);
                }}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all",
                  selectedType === "photo"
                    ? "bg-[#18361e] text-white shadow-sm"
                    : "text-[#5c6b59] hover:text-[#18361e]"
                )}
              >
                <ImageIcon className="h-4 w-4" />
                <span>Photos</span>
                <span className="ml-1 rounded-full bg-black/10 px-2 py-0.5 text-[10px]">
                  {galleryList.filter((i) => i.type === "photo").length}
                </span>
              </button>

              <button
                onClick={() => {
                  setSelectedType("video");
                  setActiveItemIndex(null);
                }}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all",
                  selectedType === "video"
                    ? "bg-[#18361e] text-white shadow-sm"
                    : "text-[#5c6b59] hover:text-[#18361e]"
                )}
              >
                <Video className="h-4 w-4" />
                <span>Videos</span>
                <span className="ml-1 rounded-full bg-black/10 px-2 py-0.5 text-[10px]">
                  {galleryList.filter((i) => i.type === "video").length}
                </span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a8b77]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gallery by keyword..."
                className="w-full rounded-2xl border border-[#e4dbca] bg-[#fbf8f1] py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#1a3820] placeholder:text-[#7a8b77] outline-none focus:border-[#4e8837] focus:ring-2 focus:ring-[#4e8837]/20"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-4 border-t border-[#f0eade]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7a8b77] mr-1">
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setActiveItemIndex(null);
                }}
                className={cn(
                  "rounded-full px-3.5 py-1 text-xs font-semibold transition-all border",
                  selectedCategory === cat
                    ? "bg-[#4e8837] text-white border-[#4e8837] shadow-xs"
                    : "bg-white text-[#5c6b59] border-[#e4dbca] hover:border-[#4e8837] hover:text-[#18361e]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="mt-10">
          {filteredList.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#dcd4c0] bg-white p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f4efe4] text-[#5c6b59]">
                <Filter className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-[#1a3820]">No media matches your filter</h3>
              <p className="mt-1 text-xs sm:text-sm text-[#5c6b59]">
                Try adjusting your search query or selecting a different media category.
              </p>
              <button
                onClick={() => {
                  setSelectedType("all");
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#4e8837] px-4 py-2 text-xs font-bold text-white hover:bg-[#3f702c] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredList.map((item, idx) => {
                const isVideo = item.type === "video";
                const displayThumb =
                  item.thumbnailUrl ||
                  item.mediaUrl ||
                  (item.videoLink ? getVideoInfo(item.videoLink).thumbnailUrl : "");

                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveItemIndex(idx)}
                    className="group relative flex flex-col overflow-hidden rounded-3xl border border-[#e4dbca] bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                  >
                    {/* Thumbnail Image / Media Container */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#18361e]/5">
                      {displayThumb ? (
                        <img
                          src={displayThumb}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#18361e]/10 text-[#5c6b59]">
                          {isVideo ? <Video className="h-10 w-10" /> : <ImageIcon className="h-10 w-10" />}
                        </div>
                      )}

                      {/* Badge Top Left */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="rounded-full bg-white/90 backdrop-blur-xs px-2.5 py-0.5 text-[11px] font-bold text-[#1a3820] shadow-2xs border border-black/5">
                          {item.category || "General"}
                        </span>
                      </div>

                      {/* Video Play Overlay */}
                      {isVideo && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#4e8837] text-white shadow-xl transition-transform duration-300 group-hover:scale-110">
                            <Play className="h-6 w-6 fill-white ml-0.5" />
                          </div>
                        </div>
                      )}

                      {/* Type Pill Top Right */}
                      <div className="absolute top-3 right-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-xs shadow-2xs",
                            isVideo
                              ? "bg-amber-600/90 text-white"
                              : "bg-[#18361e]/85 text-[#f4efe4]"
                          )}
                        >
                          {isVideo ? <Video className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                          <span>{isVideo ? "Video" : "Photo"}</span>
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-display text-base sm:text-lg font-bold text-[#1a3820] transition-colors group-hover:text-[#4e8837] line-clamp-2">
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="mt-2 text-xs sm:text-sm text-[#5c6b59] line-clamp-2 leading-relaxed flex-1">
                          {item.description}
                        </p>
                      )}

                      <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#f0eade] text-xs font-medium text-[#7a8b77]">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {item.date || "Recent"}
                        </span>
                        <span className="font-bold text-[#4e8837] group-hover:underline inline-flex items-center gap-1">
                          {isVideo ? "Watch Video →" : "View Photo →"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Lightbox / Video Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setActiveItemIndex(null)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#18361e] border border-white/15 text-[#f4efe4] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5 bg-black/20">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <span className="rounded-full bg-[#4e8837] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shrink-0">
                  {activeItem.type === "video" ? "Video" : "Photo"}
                </span>
                <span className="text-xs text-[#a8d672] font-semibold truncate">
                  {activeItem.category || "General"}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Previous / Next buttons */}
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                  aria-label="Previous item"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                  aria-label="Next item"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                {/* Close button */}
                <button
                  type="button"
                  onClick={() => setActiveItemIndex(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30 transition-colors ml-1"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Media Player / Image Viewer */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
              {activeItem.type === "video" ? (
                (() => {
                  const targetVideo = activeItem.videoLink || activeItem.mediaUrl || "";
                  const info = getVideoInfo(targetVideo);

                  if (info.type === "youtube" || info.type === "vimeo") {
                    return (
                      <iframe
                        src={info.embedUrl}
                        title={activeItem.title}
                        className="h-full w-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    );
                  }

                  return (
                    <video
                      src={info.embedUrl}
                      controls
                      autoPlay
                      className="h-full w-full object-contain"
                    />
                  );
                })()
              ) : (
                <img
                  src={activeItem.mediaUrl || activeItem.thumbnailUrl}
                  alt={activeItem.title}
                  className="h-full w-full object-contain"
                />
              )}
            </div>

            {/* Modal Info Footer */}
            <div className="p-5 sm:p-6 bg-[#18361e] border-t border-white/10">
              <h2 className="font-display text-lg sm:text-xl font-bold text-white">
                {activeItem.title}
              </h2>
              {activeItem.description && (
                <p className="mt-2 text-xs sm:text-sm text-[#d1dbcd] leading-relaxed">
                  {activeItem.description}
                </p>
              )}
              <div className="mt-3 flex items-center justify-between text-xs text-[#a8d672]/80">
                <span>{activeItem.date ? `Published: ${activeItem.date}` : ""}</span>
                <span>
                  {activeItemIndex !== null ? `${activeItemIndex + 1} of ${filteredList.length}` : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
