"use client";

import * as React from "react";
import { Phone, MessageCircle, X, ChevronUp, ChevronDown } from "lucide-react";
import { useApp } from "@/lib/store";

export function FloatingCornerButtons() {
  const { state } = useApp();
  const s = state.settings;
  const [collapsed, setCollapsed] = React.useState(false);

  // Master switch
  if (s.showFloatingActions === false) {
    return null;
  }

  // 1. Call details
  const callEnabled = s.floatingCallEnabled !== false;
  const rawPhone = s.floatingCallNumber || s.phone || "+91 91759 55009";
  const cleanPhone = rawPhone.replace(/[^\d+]/g, "") || "+919175955009";
  const callLabel = s.floatingCallLabel || `Call: ${rawPhone}`;

  // 2. WhatsApp details
  const waEnabled = s.floatingWhatsappEnabled !== false;
  const rawWa = s.floatingWhatsappNumber || s.whatsapp || s.phone || "919175955009";
  const cleanWa = rawWa.replace(/[^0-9]/g, "") || "919175955009";
  const waMsg =
    s.floatingWhatsappMessage ||
    "Hello Plant Health Solutions, I would like to inquire about your products and crop solutions.";
  const waUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(waMsg)}`;
  const waLabel = s.floatingWhatsappLabel || "Chat on WhatsApp";

  // 3. Instagram details
  const instaEnabled =
    s.floatingInstagramEnabled !== false &&
    Boolean(s.floatingInstagramUrl || s.instagram);
  const instaUrl = s.floatingInstagramUrl || s.instagram || "https://instagram.com";
  const instaLabel = s.floatingInstagramLabel || "Follow on Instagram";

  // 4. YouTube details
  const ytEnabled =
    s.floatingYoutubeEnabled !== false &&
    Boolean(s.floatingYoutubeUrl || s.youtube);
  const ytUrl = s.floatingYoutubeUrl || s.youtube || "https://youtube.com";
  const ytLabel = s.floatingYoutubeLabel || "Watch on YouTube";

  // Count active buttons
  const activeCount =
    (callEnabled ? 1 : 0) +
    (waEnabled ? 1 : 0) +
    (instaEnabled ? 1 : 0) +
    (ytEnabled ? 1 : 0);

  if (activeCount === 0) {
    return null;
  }

  const isCenter = s.floatingPosition === "right-center";

  return (
    <aside
      aria-label="Quick Contact & Social Channels"
      className={`fixed z-50 flex flex-col items-end gap-2.5 sm:gap-3 transition-all duration-300 ${
        isCenter
          ? "top-1/2 -translate-y-1/2 right-3 sm:right-5"
          : "bottom-5 right-3.5 sm:bottom-6 sm:right-6"
      }`}
    >
      {/* Action Buttons Stack (Visible when not collapsed) */}
      {!collapsed && (
        <div className="flex flex-col items-end gap-2.5 sm:gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
          {/* 1. YouTube Button */}
          {ytEnabled && (
            <a
              href={ytUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={ytLabel}
              className="group relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#FF0000] text-white shadow-md shadow-[#FF0000]/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-[#FF0000]/50 active:scale-95 focus:outline-hidden focus:ring-4 focus:ring-[#FF0000]/40"
            >
              {/* Tooltip on hover */}
              <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-xl bg-gray-900/95 px-3 py-1.5 text-xs font-semibold text-white shadow-xl backdrop-blur-xs transition-all duration-200 group-hover:block sm:text-sm">
                {ytLabel}
                <span className="absolute top-1/2 -right-1 h-2 w-2 -translate-y-1/2 rotate-45 bg-gray-900/95" />
              </span>

              {/* YouTube SVG Icon */}
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6 fill-white"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          )}

          {/* 2. Instagram Button */}
          {instaEnabled && (
            <a
              href={instaUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={instaLabel}
              className="group relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-md shadow-[#dc2743]/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-[#dc2743]/50 active:scale-95 focus:outline-hidden focus:ring-4 focus:ring-[#dc2743]/40"
            >
              {/* Tooltip on hover */}
              <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-xl bg-gray-900/95 px-3 py-1.5 text-xs font-semibold text-white shadow-xl backdrop-blur-xs transition-all duration-200 group-hover:block sm:text-sm">
                {instaLabel}
                <span className="absolute top-1/2 -right-1 h-2 w-2 -translate-y-1/2 rotate-45 bg-gray-900/95" />
              </span>

              {/* Instagram SVG Icon */}
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6 fill-white"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          )}

          {/* 3. Call Helpline Button */}
          {callEnabled && (
            <a
              href={`tel:${cleanPhone}`}
              aria-label={callLabel}
              className="group relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#0284c7] text-white shadow-md shadow-[#0284c7]/30 transition-all duration-300 hover:scale-110 hover:bg-[#0369a1] hover:shadow-xl hover:shadow-[#0284c7]/50 active:scale-95 focus:outline-hidden focus:ring-4 focus:ring-[#0284c7]/40"
            >
              {/* Tooltip on hover */}
              <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-xl bg-gray-900/95 px-3 py-1.5 text-xs font-semibold text-white shadow-xl backdrop-blur-xs transition-all duration-200 group-hover:block sm:text-sm">
                {callLabel}
                <span className="absolute top-1/2 -right-1 h-2 w-2 -translate-y-1/2 rotate-45 bg-gray-900/95" />
              </span>

              {/* Phone Icon */}
              <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-white stroke-[2.2]" />
            </a>
          )}

          {/* 4. WhatsApp Chat Button */}
          {waEnabled && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={waLabel}
              className="group relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/35 transition-all duration-300 hover:scale-110 hover:bg-[#20ba56] hover:shadow-xl hover:shadow-[#25D366]/50 active:scale-95 focus:outline-hidden focus:ring-4 focus:ring-[#25D366]/40"
            >
              {/* Pulsing ring animation */}
              <span className="absolute -inset-1 -z-10 animate-ping rounded-full bg-[#25D366]/30 opacity-75 duration-1000" />

              {/* Tooltip on hover */}
              <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-xl bg-[#18361e] px-3 py-1.5 text-xs font-semibold text-white shadow-xl transition-all duration-200 group-hover:block sm:text-sm">
                {waLabel}
                <span className="absolute top-1/2 -right-1 h-2 w-2 -translate-y-1/2 rotate-45 bg-[#18361e]" />
              </span>

              {/* WhatsApp SVG Icon */}
              <svg
                className="h-6 w-6 sm:h-7 sm:w-7 fill-white drop-shadow-xs"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          )}
        </div>
      )}

      {/* Collapse / Expand Toggle Button */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Show quick contact buttons" : "Hide quick contact buttons"}
        className="group relative flex h-9 w-9 items-center justify-center rounded-full bg-[#1b3d24] text-white/90 shadow-md border border-white/20 transition-all duration-200 hover:bg-[#122a19] hover:text-white hover:scale-105 active:scale-95"
      >
        {collapsed ? (
          <MessageCircle className="h-4 w-4 text-[#a8d672]" />
        ) : (
          <X className="h-4 w-4" />
        )}
        <span className="pointer-events-none absolute right-full mr-2 hidden whitespace-nowrap rounded-lg bg-gray-900/90 px-2 py-1 text-[11px] font-medium text-white shadow-md group-hover:block">
          {collapsed ? "Connect with Us" : "Minimize"}
        </span>
      </button>
    </aside>
  );
}
