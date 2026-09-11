'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PageLayoutSettings, PaginatedPage, RealismSettings } from '@/types/handwriting';
import { getPageDimensions } from '@/lib/pagination';
import { renderHandwritingToCanvas, renderPaperToCanvas } from '@/lib/realism';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  Eye,
  Grid,
  ArrowUp,
} from 'lucide-react';

interface PreviewCanvasProps {
  pages: PaginatedPage[];
  layout: PageLayoutSettings;
  realism: RealismSettings;
  currentPageIndex: number;
  onPageChange: (index: number) => void;
  onExportCurrentAsImage: () => void;
}

export const PreviewCanvas: React.FC<PreviewCanvasProps> = ({
  pages,
  layout,
  realism,
  currentPageIndex,
  onPageChange,
  onExportCurrentAsImage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const [zoomLevel, setZoomLevel] = useState<number>(0.85);
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  const currentPage = pages[currentPageIndex] || pages[0] || { pageNumber: 1, lines: [] };
  const dimensions = getPageDimensions(layout.paperSize);

  // Fit to screen calculation
  const handleFitToScreen = useCallback(() => {
    if (!containerRef.current) return;
    const availableWidth = containerRef.current.clientWidth - 56;
    if (availableWidth > 0 && dimensions.width > 0) {
      const scale = Math.min(1.15, Math.max(0.4, availableWidth / dimensions.width));
      setZoomLevel(scale);
    }
  }, [dimensions.width]);

  // Initial auto-fit on mount
  useEffect(() => {
    handleFitToScreen();
  }, [handleFitToScreen]);

  // Re-render single page canvas whenever layout, realism, or page text changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Retina resolution multiplier (2x for crisp rendering)
    const dpr = 2;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw paper background (lines, texture, margins, holes)
    renderPaperToCanvas(ctx, dimensions.width, dimensions.height, layout, dpr);

    // 2. Draw realistic handwriting
    renderHandwritingToCanvas(
      ctx,
      currentPage.lines,
      currentPage.pageNumber,
      layout,
      realism,
      dpr
    );
  }, [currentPage, layout, realism, dimensions]);

  // Reset scroll to top whenever page changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      setShowScrollTop(false);
    }
  }, [currentPageIndex]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setShowScrollTop(scrollContainerRef.current.scrollTop > 100);
    }
  };

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      ref={containerRef}
      className="bg-white dark:bg-[#1a1b1e] border border-zinc-200 dark:border-zinc-800 rounded-lg flex flex-col h-full overflow-hidden shadow-xs transition-colors"
    >
      {/* Top Preview Control Bar */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-[#16171a] px-3.5 py-2 flex items-center justify-between gap-3 text-xs z-10">
        {/* Left: View Mode & Page Indicator */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-zinc-200/80 dark:bg-zinc-800 p-0.5 rounded-md">
            <button
              onClick={() => {
                setViewMode('single');
                scrollToTop();
              }}
              className={`px-2 py-0.5 rounded flex items-center gap-1 font-medium transition ${
                viewMode === 'single'
                  ? 'bg-white dark:bg-[#222328] text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
              title="Single Page View"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Page</span>
            </button>
            <button
              onClick={() => {
                setViewMode('grid');
                scrollToTop();
              }}
              className={`px-2 py-0.5 rounded flex items-center gap-1 font-medium transition ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-[#222328] text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
              title="All Pages Grid"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>

          <span className="text-zinc-500 dark:text-zinc-400 font-mono text-[11px] hidden sm:inline">
            Page {currentPageIndex + 1} of {pages.length}
          </span>
        </div>

        {/* Center: Pagination Arrows (Single Mode) */}
        {viewMode === 'single' && (
          <div className="flex items-center gap-1 bg-white dark:bg-[#222328] border border-zinc-200 dark:border-zinc-700/60 rounded-md p-0.5 shadow-xs">
            <button
              disabled={currentPageIndex <= 0}
              onClick={() => onPageChange(currentPageIndex - 1)}
              className="p-1 rounded text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700/70 disabled:opacity-30 transition"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="px-1.5 font-mono text-[11px] text-zinc-600 dark:text-zinc-400 sm:hidden">
              {currentPageIndex + 1}/{pages.length}
            </span>

            <button
              disabled={currentPageIndex >= pages.length - 1}
              onClick={() => onPageChange(currentPageIndex + 1)}
              className="p-1 rounded text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700/70 disabled:opacity-30 transition"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Right: Zoom & Image Save */}
        <div className="flex items-center gap-1.5">
          {viewMode === 'single' && (
            <div className="flex items-center gap-0.5 bg-white dark:bg-[#222328] border border-zinc-200 dark:border-zinc-700/60 p-0.5 rounded-md shadow-xs text-zinc-600 dark:text-zinc-400">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.4, z - 0.1))}
                className="p-1 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700/70 rounded transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-3 h-3" />
              </button>
              <button
                onClick={handleFitToScreen}
                className="px-1.5 py-0.5 text-[10px] font-mono hover:text-zinc-900 dark:hover:text-zinc-100 transition"
                title="Fit Page to Width"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.1))}
                className="p-1 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700/70 rounded transition"
                title="Zoom In"
              >
                <ZoomIn className="w-3 h-3" />
              </button>
            </div>
          )}

          <button
            onClick={onExportCurrentAsImage}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 transition text-xs"
            title="Download current page as PNG"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">PNG</span>
          </button>
        </div>
      </div>

      {/* Main Paper Canvas Area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 bg-zinc-100/70 dark:bg-[#121316] overflow-y-auto overflow-x-auto relative scroll-smooth focus:outline-none transition-colors"
        tabIndex={0}
      >
        {viewMode === 'single' ? (
          /* Single Page View */
          <div className="min-h-full min-w-full p-4 sm:p-7 flex flex-col items-center justify-start">
            <div
              style={{
                width: `${dimensions.width * zoomLevel}px`,
                height: `${dimensions.height * zoomLevel}px`,
              }}
              className="relative shrink-0 my-auto transition-all duration-150 ease-out"
            >
              <div
                className="paper-elevation rounded-sm overflow-hidden bg-white origin-top-left"
                style={{
                  width: `${dimensions.width}px`,
                  height: `${dimensions.height}px`,
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'top left',
                }}
              >
                <canvas
                  ref={canvasRef}
                  style={{
                    width: `${dimensions.width}px`,
                    height: `${dimensions.height}px`,
                    display: 'block',
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Grid View of All Pages */
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {pages.map((page, idx) => (
                <div
                  key={page.pageNumber}
                  onClick={() => {
                    onPageChange(idx);
                    setViewMode('single');
                    scrollToTop();
                  }}
                  className={`group cursor-pointer rounded-lg p-2 border transition ${
                    idx === currentPageIndex
                      ? 'border-zinc-900 dark:border-zinc-100 bg-white dark:bg-[#1a1b1e] shadow-xs'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white/60 dark:bg-[#1a1b1e]/50'
                  }`}
                >
                  <div className="aspect-[210/297] rounded-sm overflow-hidden paper-elevation bg-white relative">
                    <GridThumbnail
                      page={page}
                      layout={layout}
                      realism={realism}
                      dimensions={dimensions}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 transition flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 bg-zinc-900/90 text-white text-[11px] px-2.5 py-1 rounded-md font-medium transition">
                        View Page {page.pageNumber}
                      </span>
                    </div>
                  </div>
                  <div className="mt-1.5 text-center text-[11px] font-mono text-zinc-500">
                    Page {page.pageNumber}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Minimalist Floating Back-to-Top Button */}
        {showScrollTop && viewMode === 'single' && (
          <button
            onClick={scrollToTop}
            className="sticky bottom-4 ml-auto mr-4 float-right p-2 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md flex items-center gap-1.5 text-xs font-medium z-30 transition hover:opacity-90"
            title="Scroll back to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span className="text-[11px]">Top</span>
          </button>
        )}
      </div>

      {/* Page Rail (Bottom) */}
      {viewMode === 'single' && pages.length > 1 && (
        <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-[#16171a] px-4 py-1.5 flex items-center justify-center gap-1.5 overflow-x-auto z-10">
          {pages.map((p, idx) => (
            <button
              key={p.pageNumber}
              onClick={() => {
                onPageChange(idx);
                scrollToTop();
              }}
              className={`px-2.5 py-0.5 rounded text-[11px] font-mono transition ${
                idx === currentPageIndex
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
              }`}
            >
              {p.pageNumber}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const GridThumbnail: React.FC<{
  page: PaginatedPage;
  layout: PageLayoutSettings;
  realism: RealismSettings;
  dimensions: { width: number; height: number };
}> = ({ page, layout, realism, dimensions }) => {
  const thumbRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = thumbRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = 0.35;
    canvas.width = dimensions.width * scale;
    canvas.height = dimensions.height * scale;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderPaperToCanvas(ctx, dimensions.width, dimensions.height, layout, scale);
    renderHandwritingToCanvas(ctx, page.lines, page.pageNumber, layout, realism, scale);
  }, [page, layout, realism, dimensions]);

  return <canvas ref={thumbRef} className="w-full h-full object-contain" />;
};
