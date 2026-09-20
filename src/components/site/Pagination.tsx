"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
  showPageSize?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [6, 9, 12, 18, 24],
  className = "",
  showPageSize = true,
}: PaginationProps) {
  if (totalItems === 0) {
    return null;
  }

  const startItem = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate pagination items with ellipsis
  const getPages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  const pages = getPages();

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-2 border-t border-border mt-8 ${className}`}
    >
      {/* Left side: Item counters & Per-page selector */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs sm:text-sm text-muted-foreground">
        <span>
          Showing <strong className="text-foreground">{startItem}</strong>–
          <strong className="text-foreground">{endItem}</strong> of{" "}
          <strong className="text-foreground">{totalItems}</strong> products
        </span>

        {showPageSize && onPageSizeChange && (
          <div className="flex items-center gap-1.5 pl-3 border-l border-border">
            <span className="text-xs">Show:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
              }}
              className="rounded-lg border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} per page
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right side: Navigation Controls */}
      {totalPages > 1 && (
        <nav aria-label="Pagination" className="flex items-center gap-1 sm:gap-1.5">
          {/* First Page */}
          {totalPages > 4 && (
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              aria-label="First page"
              className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-all hover:bg-muted disabled:opacity-30 disabled:pointer-events-none"
              title="First Page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
          )}

          {/* Previous Page */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="inline-flex h-9 px-3 items-center justify-center gap-1 rounded-xl border border-border bg-card text-xs sm:text-sm font-semibold text-foreground transition-all hover:bg-muted disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Numbered Page Buttons */}
          <div className="flex items-center gap-1">
            {pages.map((p, idx) => {
              if (p === "...") {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-1.5 text-xs text-muted-foreground select-none"
                  >
                    …
                  </span>
                );
              }

              const pageNum = p as number;
              const isActive = pageNum === currentPage;

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex h-9 min-w-[36px] items-center justify-center rounded-xl px-2.5 text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20 scale-105"
                      : "border border-border bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Next Page */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className="inline-flex h-9 px-3 items-center justify-center gap-1 rounded-xl border border-border bg-card text-xs sm:text-sm font-semibold text-foreground transition-all hover:bg-muted disabled:opacity-30 disabled:pointer-events-none"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Last Page */}
          {totalPages > 4 && (
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              aria-label="Last page"
              className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-all hover:bg-muted disabled:opacity-30 disabled:pointer-events-none"
              title="Last Page"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          )}
        </nav>
      )}
    </div>
  );
}
