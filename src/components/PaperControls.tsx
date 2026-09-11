'use client';

import React from 'react';
import { PageLayoutSettings, PaperSize, PaperTexture, PaperType } from '@/types/handwriting';
import { INK_COLORS } from '@/lib/fonts';

interface PaperControlsProps {
  layout: PageLayoutSettings;
  onChangeLayout: (newLayout: Partial<PageLayoutSettings>) => void;
}

export const PaperControls: React.FC<PaperControlsProps> = ({ layout, onChangeLayout }) => {
  const paperTypes: { id: PaperType; label: string; desc: string }[] = [
    { id: 'notebook', label: 'Notebook', desc: 'Ruled with red margin & punches' },
    { id: 'project', label: 'Project Paper', desc: 'A4 ruled with Topic, Date & Sign' },
    { id: 'ruled', label: 'Lined / Ruled', desc: 'Clean horizontal lines' },
    { id: 'plain', label: 'Plain Blank', desc: 'Unruled clean sheet' },
    { id: 'grid', label: 'Grid / Quad', desc: '5mm graph pattern' },
    { id: 'dotted', label: 'Dotted', desc: 'Bullet journal matrix' },
    { id: 'legal', label: 'Legal Pad', desc: 'Yellow paper with red margin' },
    { id: 'vintage', label: 'Parchment', desc: 'Aged paper tone' },
  ];

  const handleSelectPaperType = (newType: PaperType) => {
    if (newType === 'project') {
      onChangeLayout({
        paperType: 'project',
        paperSize: 'a4',
        lineHeight: 30,
        marginTop: 97,
        marginBottom: 96,
        marginLeft: 124,
        marginRight: 56,
        fontSize: Math.min(layout.fontSize, 19),
      });
    } else if (layout.paperType === 'project') {
      // Restore standard notebook margins when switching away from project sheet
      onChangeLayout({
        paperType: newType,
        lineHeight: 34,
        marginTop: 64,
        marginBottom: 60,
        marginLeft: 74,
        marginRight: 50,
      });
    } else {
      onChangeLayout({ paperType: newType });
    }
  };

  const paperTextures: { id: PaperTexture; label: string; color: string }[] = [
    { id: 'white', label: 'White', color: '#ffffff' },
    { id: 'warm-ivory', label: 'Warm Ivory', color: '#faf7ee' },
    { id: 'legal-yellow', label: 'Legal Yellow', color: '#fef9c3' },
    { id: 'vintage-parchment', label: 'Parchment', color: '#f5eedb' },
    { id: 'dark-slate', label: 'Dark Slate', color: '#1e293b' },
  ];

  return (
    <div className="space-y-4">
      {/* Paper Style & Size Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Paper Type
          </label>
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-md">
            {(['a4', 'letter'] as PaperSize[]).map((size) => (
              <button
                key={size}
                onClick={() => onChangeLayout({ paperSize: size })}
                className={`px-2 py-0.5 text-[10px] font-semibold uppercase rounded transition ${
                  layout.paperSize === size
                    ? 'bg-white dark:bg-[#1a1b1e] text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Paper Types Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {paperTypes.map((pt) => {
            const isSelected = layout.paperType === pt.id;
            return (
              <button
                key={pt.id}
                onClick={() => handleSelectPaperType(pt.id)}
                className={`p-2.5 rounded-lg border text-left transition ${
                  isSelected
                    ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800/60 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-[#1a1b1e]'
                }`}
              >
                <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-0.5">
                  {pt.label}
                </div>
                <div className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-tight">
                  {pt.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Project Sheet Header Fields (when Project Paper is active) */}
      {layout.paperType === 'project' && (
        <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 space-y-2.5 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
              Project Sheet Header
            </span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
              Optional
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-zinc-500 dark:text-zinc-400 block mb-1">
                Topic
              </label>
              <input
                type="text"
                value={layout.projectTopic || ''}
                placeholder="Topic................"
                onChange={(e) => onChangeLayout({ projectTopic: e.target.value })}
                className="w-full text-xs px-2.5 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#1a1b1e] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus-subtle"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 dark:text-zinc-400 block mb-1">
                Date
              </label>
              <input
                type="text"
                value={layout.projectDate || ''}
                placeholder="Date............"
                onChange={(e) => onChangeLayout({ projectDate: e.target.value })}
                className="w-full text-xs px-2.5 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#1a1b1e] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus-subtle"
              />
            </div>
          </div>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
            Leave blank to keep traditional dotted fill-in lines.
          </p>
        </div>
      )}

      {/* Paper Tone / Texture */}
      <div>
        <label className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-2">
          Paper Tone
        </label>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {paperTextures.map((tex) => {
            const isSelected = layout.paperTexture === tex.id;
            return (
              <button
                key={tex.id}
                onClick={() => onChangeLayout({ paperTexture: tex.id })}
                className={`flex items-center gap-2 px-2.5 py-1 rounded-md border text-xs transition ${
                  isSelected
                    ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800/60 font-medium text-zinc-900 dark:text-zinc-100'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full border border-zinc-300 dark:border-zinc-600 shrink-0"
                  style={{ backgroundColor: tex.color }}
                />
                <span className="text-[11px] whitespace-nowrap">{tex.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ink Color Swatches */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Ink Color
          </label>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
            {INK_COLORS.find((i) => i.hex === layout.inkColor)?.name || layout.inkColor}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {INK_COLORS.map((ink) => {
            const isSelected = layout.inkColor.toLowerCase() === ink.hex.toLowerCase();
            return (
              <button
                key={ink.id}
                onClick={() => onChangeLayout({ inkColor: ink.hex })}
                className={`w-6 h-6 rounded-full transition relative flex items-center justify-center ${
                  isSelected
                    ? 'ring-2 ring-zinc-900 dark:ring-zinc-100 ring-offset-2 ring-offset-white dark:ring-offset-[#1a1b1e]'
                    : 'hover:opacity-90 opacity-80'
                }`}
                style={{ backgroundColor: ink.hex }}
                title={ink.name}
              />
            );
          })}

          {/* Custom Hex Color Picker */}
          <div className="relative flex items-center">
            <input
              type="color"
              value={layout.inkColor}
              onChange={(e) => onChangeLayout({ inkColor: e.target.value })}
              className="w-6 h-6 rounded-full cursor-pointer opacity-0 absolute inset-0 z-10"
              title="Custom Ink Color"
            />
            <div
              className="w-6 h-6 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-[11px] text-zinc-500 dark:text-zinc-400 hover:border-zinc-400 transition"
              style={{ backgroundColor: layout.inkColor }}
            >
              +
            </div>
          </div>
        </div>
      </div>

      {/* Typography & Spacing Sliders */}
      <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
        <label className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
          Scale & Spacing
        </label>

        {/* Font Size Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500 dark:text-zinc-400">Font Size</span>
            <span className="text-zinc-700 dark:text-zinc-300 font-mono text-[11px]">{layout.fontSize}px</span>
          </div>
          <input
            type="range"
            min="14"
            max="32"
            step="1"
            value={layout.fontSize}
            onChange={(e) => onChangeLayout({ fontSize: Number(e.target.value) })}
            className="w-full accent-zinc-800 dark:accent-zinc-200 bg-zinc-200 dark:bg-zinc-700 h-1 rounded-lg cursor-pointer"
          />
        </div>

        {/* Line Height / Line Spacing */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500 dark:text-zinc-400">Line Spacing</span>
            <span className="text-zinc-700 dark:text-zinc-300 font-mono text-[11px]">{layout.lineHeight}px</span>
          </div>
          <input
            type="range"
            min="24"
            max="52"
            step="1"
            value={layout.lineHeight}
            onChange={(e) => onChangeLayout({ lineHeight: Number(e.target.value) })}
            className="w-full accent-zinc-800 dark:accent-zinc-200 bg-zinc-200 dark:bg-zinc-700 h-1 rounded-lg cursor-pointer"
          />
        </div>

        {/* Margin Left / Indentation */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500 dark:text-zinc-400">Left Margin</span>
            <span className="text-zinc-700 dark:text-zinc-300 font-mono text-[11px]">{layout.marginLeft}px</span>
          </div>
          <input
            type="range"
            min="40"
            max="120"
            step="4"
            value={layout.marginLeft}
            onChange={(e) => onChangeLayout({ marginLeft: Number(e.target.value) })}
            className="w-full accent-zinc-800 dark:accent-zinc-200 bg-zinc-200 dark:bg-zinc-700 h-1 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
