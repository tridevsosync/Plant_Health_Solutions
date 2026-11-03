"use client";

import * as React from "react";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";
import { useApp } from "@/lib/store";

export function HomePopup() {
  const { state } = useApp();
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  const settings = state.settings;
  const showPopup = settings.showHomePopup !== false;
  const image = settings.homePopupImage;
  const title = settings.homePopupTitle;
  const subtitle = settings.homePopupSubtitle;
  const link = settings.homePopupLink;
  const buttonText = settings.homePopupButtonText || "Explore Now";

  React.useEffect(() => {
    setMounted(true);

    // Listen for manual preview trigger from admin
    const handleForceOpen = () => setIsOpen(true);
    window.addEventListener("open-home-popup", handleForceOpen);

    // Check if enabled and has content
    if (!showPopup || (!image && !title)) {
      return () => window.removeEventListener("open-home-popup", handleForceOpen);
    }

    // Check if dismissed in this browsing session
    try {
      const dismissed = sessionStorage.getItem("phs_home_popup_dismissed");
      if (!dismissed) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 600);
        return () => {
          clearTimeout(timer);
          window.removeEventListener("open-home-popup", handleForceOpen);
        };
      }
    } catch {
      // Fallback if sessionStorage is not accessible
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 600);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("open-home-popup", handleForceOpen);
      };
    }

    return () => window.removeEventListener("open-home-popup", handleForceOpen);
  }, [showPopup, image, title]);

  const handleClose = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem("phs_home_popup_dismissed", "true");
    } catch {
      // ignore storage error
    }
  };

  // Close on Escape key
  React.useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || "Announcement Pop-up"}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in duration-300"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-lg md:max-w-xl overflow-hidden rounded-3xl border border-white/20 bg-card text-card-foreground shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cross Button in Corner */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close pop-up"
          className="absolute top-3 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/65 text-white hover:bg-black/90 backdrop-blur-md shadow-lg border border-white/30 transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <X className="h-5 w-5 stroke-[2.5]" />
        </button>

        {/* Pop-up Image */}
        {image && (
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-muted">
            {link ? (
              <Link
                href={link}
                onClick={handleClose}
                className="group block h-full w-full"
              >
                <img
                  src={image}
                  alt={title || "Featured Offer"}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
            ) : (
              <img
                src={image}
                alt={title || "Featured Offer"}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        )}

        {/* Pop-up Content (Shown if title, subtitle or link are configured) */}
        {(title || subtitle || (link && !image)) && (
          <div className="p-5 sm:p-6">
            {title && (
              <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {subtitle}
              </p>
            )}

            {link && (
              <div className="mt-5 flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-full px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dismiss
                </button>
                <Link
                  href={link}
                  onClick={handleClose}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-md hover:bg-secondary transition-all active:scale-95"
                >
                  {buttonText}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
