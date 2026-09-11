'use client';

import React, { useState } from 'react';
import { FontCategory, FontOption } from '@/types/handwriting';
import { Check, Plus } from 'lucide-react';

interface FontSelectorProps {
  fonts: FontOption[];
  selectedFontId: string;
  onSelectFont: (font: FontOption) => void;
  onOpenUploadModal: () => void;
}

export const FontSelector: React.FC<FontSelectorProps> = ({
  fonts,
  selectedFontId,
  onSelectFont,
  onOpenUploadModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<FontCategory>('all');

  const categories: { id: FontCategory; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'casual', label: 'Casual' },
    { id: 'cursive', label: 'Cursive' },
    { id: 'neat', label: 'Neat' },
    { id: 'vintage', label: 'Vintage' },
    { id: 'playful', label: 'Playful' },
    { id: 'custom', label: 'Custom' },
  ];

  const filteredFonts = fonts.filter((f) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'custom') return f.isCustom;
    return f.category === activeCategory;
  });

  return (
    <div className="space-y-4">
      {/* Category Filter Chips */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition ${
                isActive
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Font Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
        {/* Upload Custom Font Trigger Card */}
        <button
          onClick={onOpenUploadModal}
          className="p-3 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 bg-zinc-50/50 dark:bg-zinc-800/30 text-left flex items-center gap-3 transition"
        >
          <div className="w-8 h-8 rounded-md bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 flex items-center justify-center shrink-0">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              Upload Handwriting
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              Upload sample photo or .ttf font
            </p>
          </div>
        </button>

        {filteredFonts.map((font) => {
          const isSelected = font.id === selectedFontId;
          return (
            <div
              key={font.id}
              onClick={() => onSelectFont(font)}
              className={`p-3 rounded-lg cursor-pointer transition text-left flex flex-col justify-between min-h-[92px] border ${
                isSelected
                  ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50/80 dark:bg-zinc-800/60 shadow-xs'
                  : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-[#1a1b1e]'
              }`}
            >
              {/* Header: Name & Selection */}
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    {font.name}
                  </span>
                  {font.isCustom && (
                    <span className="text-[9px] uppercase px-1 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium">
                      Custom
                    </span>
                  )}
                </div>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                )}
              </div>

              {/* Sample Handwriting Preview */}
              <div
                className="text-base text-zinc-800 dark:text-zinc-200 line-clamp-1 py-1"
                style={{ fontFamily: font.family }}
              >
                {font.previewText || 'The quick brown fox jumps over the lazy dog'}
              </div>

              {/* Subtitle / Attributes */}
              <div className="text-[10px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                <span className="capitalize">{font.category}</span>
                <span>·</span>
                <span className="capitalize">{font.slant || 'Natural'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
