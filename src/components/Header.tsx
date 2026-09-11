'use client';

import React, { useState } from 'react';
import { Feather, Download, FileText, Upload, Printer, Sun, Moon, ChevronDown } from 'lucide-react';
import { SAMPLE_TEXTS } from '@/lib/sampleTexts';
import { useTheme } from '@/context/ThemeContext';

interface HeaderProps {
  onSelectSample: (text: string) => void;
  onOpenExport: () => void;
  onOpenCustomFont: () => void;
  onOpenTemplateSheet: () => void;
  wordCount: number;
  charCount: number;
  pageCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectSample,
  onOpenExport,
  onOpenCustomFont,
  onOpenTemplateSheet,
  wordCount,
  charCount,
  pageCount,
}) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1a1b1e] sticky top-0 z-40 px-4 lg:px-7 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center">
              <Feather className="w-3.5 h-3.5" strokeWidth={2} />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
                Scripta
              </span>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-normal">
                / Studio
              </span>
            </div>
          </div>

          {/* Quiet Document Stats */}
          <div className="hidden md:flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
            <span>{wordCount.toLocaleString()} words</span>
            <span>·</span>
            <span>{charCount.toLocaleString()} characters</span>
            <span>·</span>
            <span className="text-zinc-700 dark:text-zinc-300 font-medium">
              {pageCount} {pageCount === 1 ? 'page' : 'pages'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Template Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsTemplateMenuOpen(!isTemplateMenuOpen)}
              onBlur={() => setTimeout(() => setIsTemplateMenuOpen(false), 200)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition"
              title="Load writing sample templates"
            >
              <FileText className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span className="hidden sm:inline">Templates</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {isTemplateMenuOpen && (
              <div className="absolute right-0 mt-1 w-60 rounded-lg bg-white dark:bg-[#1c1d21] border border-zinc-200 dark:border-zinc-800 shadow-md py-1 z-50 animate-in fade-in">
                <div className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-3 py-1">
                  Preset Writing Samples
                </div>
                {SAMPLE_TEXTS.map((sample) => (
                  <button
                    key={sample.id}
                    onMouseDown={() => onSelectSample(sample.text)}
                    className="w-full text-left px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 text-xs text-zinc-700 dark:text-zinc-300 flex flex-col transition"
                  >
                    <span className="font-medium">{sample.title}</span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500">{sample.category}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Printable Alphabet Grid */}
          <button
            onClick={onOpenTemplateSheet}
            aria-label="View printable handwriting alphabet sheet"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition"
            title="View printable handwriting alphabet sheet"
          >
            <Printer className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span className="hidden md:inline">Alphabet Sheet</span>
          </button>

          {/* Upload Handwriting */}
          <button
            onClick={onOpenCustomFont}
            aria-label="Upload handwriting sample photo or custom font"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition"
            title="Upload handwriting photo or custom font file"
          >
            <Upload className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span className="hidden sm:inline">Upload Style</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
            className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition"
            title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="w-3.5 h-3.5" strokeWidth={1.75} />
            ) : (
              <Moon className="w-3.5 h-3.5" strokeWidth={1.75} />
            )}
          </button>

          {/* Export CTA Button */}
          <button
            onClick={onOpenExport}
            aria-label="Export handwritten document"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-xs font-medium transition"
          >
            <Download className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
