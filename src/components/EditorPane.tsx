'use client';

import React, { useState } from 'react';
import { FontOption, PageLayoutSettings, RealismSettings } from '@/types/handwriting';
import { FontSelector } from './FontSelector';
import { PaperControls } from './PaperControls';
import { RealismControls } from './RealismControls';
import { Edit3, Type, Palette, Sliders, Trash2, Upload, FileText } from 'lucide-react';
import { SAMPLE_TEXTS } from '@/lib/sampleTexts';

interface EditorPaneProps {
  text: string;
  onChangeText: (newText: string) => void;
  fonts: FontOption[];
  layout: PageLayoutSettings;
  realism: RealismSettings;
  onChangeLayout: (newLayout: Partial<PageLayoutSettings>) => void;
  onChangeRealism: (newRealism: Partial<RealismSettings>) => void;
  onSelectFont: (font: FontOption) => void;
  onOpenUploadModal: () => void;
}

type TabType = 'text' | 'fonts' | 'paper' | 'realism';

export const EditorPane: React.FC<EditorPaneProps> = ({
  text,
  onChangeText,
  fonts,
  layout,
  realism,
  onChangeLayout,
  onChangeRealism,
  onSelectFont,
  onOpenUploadModal,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('text');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onChangeText(content);
      }
    };
    reader.readAsText(file);
  };

  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'text', label: 'Text', icon: Edit3 },
    { id: 'fonts', label: 'Font Style', icon: Type },
    { id: 'paper', label: 'Paper & Ink', icon: Palette },
    { id: 'realism', label: 'Realism', icon: Sliders },
  ];

  return (
    <div className="bg-white dark:bg-[#1a1b1e] border border-zinc-200 dark:border-zinc-800 rounded-lg flex flex-col h-full overflow-hidden shadow-xs transition-colors">
      {/* Segmented Tab Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#16171a] p-1.5 flex gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition ${
                isActive
                  ? 'bg-white dark:bg-[#222328] text-zinc-900 dark:text-zinc-100 shadow-xs border border-zinc-200/80 dark:border-zinc-700/60'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Body */}
      <div className="p-4 sm:p-5 overflow-y-auto flex-1">
        {activeTab === 'text' && (
          <div className="flex flex-col h-full space-y-3">
            {/* Quick Sample Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium whitespace-nowrap mr-1">
                Samples:
              </span>
              {SAMPLE_TEXTS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => onChangeText(sample.text)}
                  className="px-2 py-0.5 rounded text-[11px] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 bg-zinc-100 dark:bg-zinc-800/70 hover:bg-zinc-200/80 dark:hover:bg-zinc-700/70 border border-zinc-200/60 dark:border-zinc-700/50 transition whitespace-nowrap"
                >
                  {sample.category}
                </button>
              ))}
            </div>

            {/* Clean Textarea */}
            <div className="relative flex-1 min-h-[320px] flex flex-col">
              <textarea
                value={text}
                onChange={(e) => onChangeText(e.target.value)}
                placeholder="Type or paste your text here to transform it into realistic handwriting..."
                className="w-full flex-1 p-3.5 rounded-lg bg-zinc-50/50 dark:bg-[#141517] border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 resize-none font-sans leading-relaxed transition"
              />

              {/* Minimal Bottom Toolbar */}
              <div className="flex items-center justify-between pt-2.5 text-xs text-zinc-400 dark:text-zinc-500">
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200/80 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-300 text-xs cursor-pointer transition">
                    <Upload className="w-3 h-3" />
                    <span>Upload .txt</span>
                    <input
                      type="file"
                      accept=".txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {text.length > 0 && (
                    <button
                      onClick={() => onChangeText('')}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                      title="Clear text"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>

                <div className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
                  {text.length.toLocaleString()} chars
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fonts' && (
          <FontSelector
            fonts={fonts}
            selectedFontId={layout.fontId}
            onSelectFont={onSelectFont}
            onOpenUploadModal={onOpenUploadModal}
          />
        )}

        {activeTab === 'paper' && (
          <PaperControls layout={layout} onChangeLayout={onChangeLayout} />
        )}

        {activeTab === 'realism' && (
          <RealismControls realism={realism} onChangeRealism={onChangeRealism} />
        )}
      </div>
    </div>
  );
};
