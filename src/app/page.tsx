'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { EditorPane } from '@/components/EditorPane';
import { PreviewCanvas } from '@/components/PreviewCanvas';
import { ExportModal } from '@/components/ExportModal';
import { CustomFontModal } from '@/components/CustomFontModal';
import { TemplateSheetModal } from '@/components/TemplateSheetModal';
import { BUILT_IN_FONTS, INK_COLORS } from '@/lib/fonts';
import { SAMPLE_TEXTS } from '@/lib/sampleTexts';
import { paginateText, getPageDimensions } from '@/lib/pagination';
import { renderHandwritingToCanvas, renderPaperToCanvas } from '@/lib/realism';
import {
  CustomFontProfile,
  FontOption,
  PageLayoutSettings,
  RealismSettings,
} from '@/types/handwriting';

export default function Home() {
  // 1. Core Text State
  const [text, setText] = useState<string>(SAMPLE_TEXTS[0].text);

  // 2. Fonts State (Built-in + Custom User Fonts)
  const [fonts, setFonts] = useState<FontOption[]>(BUILT_IN_FONTS);
  const [savedProfiles, setSavedProfiles] = useState<CustomFontProfile[]>([]);

  // 3. Page Layout State
  const [layout, setLayout] = useState<PageLayoutSettings>({
    paperType: 'notebook',
    paperSize: 'a4',
    paperTexture: 'warm-ivory',
    lineHeight: 34,
    fontSize: 20,
    fontId: 'caveat',
    fontFamily: "'Caveat', cursive",
    inkColor: '#1d4ed8',
    marginTop: 64,
    marginBottom: 60,
    marginLeft: 74,
    marginRight: 50,
  });

  // 4. Realism & Jitter Settings
  const [realism, setRealism] = useState<RealismSettings>({
    rotationJitter: 1.2,
    baselineWobble: 1.0,
    letterSpacingJitter: 0.4,
    wordSpacingJitter: 1.2,
    pressureVariance: 0.35,
    inkBleed: 0.2,
    showMarginLine: true,
    showBinderHoles: true,
    naturalIndent: true,
  });

  // 5. Active Page Index
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

  // 6. Modals Visibility
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isCustomFontOpen, setIsCustomFontOpen] = useState<boolean>(false);
  const [isTemplateSheetOpen, setIsTemplateSheetOpen] = useState<boolean>(false);

  // Load custom fonts from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('scripta_custom_profiles');
      if (stored) {
        const parsed: CustomFontProfile[] = JSON.parse(stored);
        setSavedProfiles(parsed);
      }
    } catch (e) {
      console.warn('Could not read saved font profiles', e);
    }
  }, []);

  // Compute multi-page pagination whenever text or layout changes
  const paginatedPages = useMemo(() => {
    return paginateText(text, layout);
  }, [text, layout]);

  // Ensure current page index stays within bounds
  useEffect(() => {
    if (currentPageIndex >= paginatedPages.length) {
      setCurrentPageIndex(Math.max(0, paginatedPages.length - 1));
    }
  }, [paginatedPages.length, currentPageIndex]);

  // Statistics calculation
  const wordCount = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }, [text]);

  const charCount = text.length;

  // Handlers
  const handleSelectSample = (sampleText: string) => {
    setText(sampleText);
    setCurrentPageIndex(0);
  };

  const handleSelectFont = (selectedFont: FontOption) => {
    setLayout((prev) => ({
      ...prev,
      fontId: selectedFont.id,
      fontFamily: selectedFont.family,
    }));
  };

  const handleSelectPresetFontById = (fontId: string) => {
    const found = fonts.find((f) => f.id === fontId);
    if (found) {
      handleSelectFont(found);
    }
  };

  const handleAddCustomFont = (newFont: FontOption, profile: CustomFontProfile) => {
    setFonts((prev) => [newFont, ...prev]);
    setLayout((prev) => ({
      ...prev,
      fontId: newFont.id,
      fontFamily: newFont.family,
    }));

    setSavedProfiles((prev) => {
      const updated = [profile, ...prev];
      try {
        localStorage.setItem('scripta_custom_profiles', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not persist custom profile', e);
      }
      return updated;
    });
  };

  const handleChangeLayout = (newLayout: Partial<PageLayoutSettings>) => {
    setLayout((prev) => ({ ...prev, ...newLayout }));
  };

  const handleChangeRealism = (newRealism: Partial<RealismSettings>) => {
    setRealism((prev) => ({ ...prev, ...newRealism }));
  };

  // Quick single-page PNG download
  const handleExportCurrentAsImage = () => {
    const dimensions = getPageDimensions(layout.paperSize);
    const canvas = document.createElement('canvas');
    const scale = 2.5;
    canvas.width = dimensions.width * scale;
    canvas.height = dimensions.height * scale;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const page = paginatedPages[currentPageIndex] || paginatedPages[0];
      renderPaperToCanvas(ctx, dimensions.width, dimensions.height, layout, scale);
      renderHandwritingToCanvas(ctx, page.lines, page.pageNumber, layout, realism, scale);

      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `Handwritten_Page_${page.pageNumber}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f9f9fb] dark:bg-[#141517] text-zinc-900 dark:text-zinc-100 selection:bg-zinc-200 dark:selection:bg-zinc-800 transition-colors">
      {/* Top Application Header */}
      <Header
        onSelectSample={handleSelectSample}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenCustomFont={() => setIsCustomFontOpen(true)}
        onOpenTemplateSheet={() => setIsTemplateSheetOpen(true)}
        wordCount={wordCount}
        charCount={charCount}
        pageCount={paginatedPages.length}
      />

      {/* Main Studio Split Workspace */}
      <main className="flex-1 p-3 sm:p-5 lg:p-6 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-4 lg:gap-5">
        {/* Left Column: Control Deck & Editor Pane */}
        <div className="w-full lg:w-[46%] xl:w-[44%] flex flex-col h-[640px] lg:h-[calc(100vh-84px)]">
          <EditorPane
            text={text}
            onChangeText={setText}
            fonts={fonts}
            layout={layout}
            realism={realism}
            onChangeLayout={handleChangeLayout}
            onChangeRealism={handleChangeRealism}
            onSelectFont={handleSelectFont}
            onOpenUploadModal={() => setIsCustomFontOpen(true)}
          />
        </div>

        {/* Right Column: Live Paginated Preview */}
        <div className="w-full lg:w-[54%] xl:w-[56%] flex flex-col h-[640px] lg:h-[calc(100vh-100px)]">
          <PreviewCanvas
            pages={paginatedPages}
            layout={layout}
            realism={realism}
            currentPageIndex={currentPageIndex}
            onPageChange={setCurrentPageIndex}
            onExportCurrentAsImage={handleExportCurrentAsImage}
          />
        </div>
      </main>

      {/* Modals */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        pages={paginatedPages}
        layout={layout}
        realism={realism}
        currentPageIndex={currentPageIndex}
      />

      <CustomFontModal
        isOpen={isCustomFontOpen}
        onClose={() => setIsCustomFontOpen(false)}
        onAddCustomFont={handleAddCustomFont}
        onSelectPresetFontById={handleSelectPresetFontById}
        onOpenTemplateSheet={() => setIsTemplateSheetOpen(true)}
        savedProfiles={savedProfiles}
      />

      <TemplateSheetModal
        isOpen={isTemplateSheetOpen}
        onClose={() => setIsTemplateSheetOpen(false)}
      />
    </div>
  );
}
