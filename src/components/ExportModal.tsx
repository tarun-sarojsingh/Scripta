'use client';

import React, { useState } from 'react';
import { PageLayoutSettings, PaginatedPage, RealismSettings } from '@/types/handwriting';
import { exportToPdf, PdfExportProgress } from '@/lib/exportPdf';
import { exportToDocx } from '@/lib/exportDocx';
import { getPageDimensions } from '@/lib/pagination';
import { renderHandwritingToCanvas, renderPaperToCanvas } from '@/lib/realism';
import confetti from 'canvas-confetti';
import { X, FileText, Download, Loader2, Image as ImageIcon } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  pages: PaginatedPage[];
  layout: PageLayoutSettings;
  realism: RealismSettings;
  currentPageIndex: number;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  pages,
  layout,
  realism,
  currentPageIndex,
}) => {
  const [format, setFormat] = useState<'pdf' | 'docx' | 'png'>('pdf');
  const [docTitle, setDocTitle] = useState('Handwritten_Notes');
  const [exportScope, setExportScope] = useState<'all' | 'current'>('all');
  const [docxMode, setDocxMode] = useState<'native' | 'image'>('native');
  const [isExporting, setIsExporting] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');

  if (!isOpen) return null;

  const targetPages = exportScope === 'current' ? [pages[currentPageIndex] || pages[0]] : pages;

  const handleStartExport = async () => {
    setIsExporting(true);
    setProgressMsg('Preparing document...');

    try {
      if (format === 'pdf') {
        await exportToPdf(targetPages, layout, realism, docTitle, (p: PdfExportProgress) => {
          setProgressMsg(p.status);
        });
      } else if (format === 'docx') {
        setProgressMsg('Generating Word document...');
        await exportToDocx(targetPages, layout, realism, docTitle, docxMode === 'image');
      } else if (format === 'png') {
        setProgressMsg('Rendering image...');
        const dimensions = getPageDimensions(layout.paperSize);
        const canvas = document.createElement('canvas');
        const scale = 2.5;
        canvas.width = dimensions.width * scale;
        canvas.height = dimensions.height * scale;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          const p = targetPages[0] || pages[0];
          renderPaperToCanvas(ctx, dimensions.width, dimensions.height, layout, scale);
          renderHandwritingToCanvas(ctx, p.lines, p.pageNumber, layout, realism, scale);

          const url = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = url;
          a.download = `${docTitle}_Page_${p.pageNumber}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      }

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 500);
    } catch (err: any) {
      console.error(err);
      alert('Export failed: ' + (err.message || 'Unknown error'));
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-[#1a1b1e] border border-zinc-200 dark:border-zinc-800 rounded-lg w-full max-w-md overflow-hidden shadow-lg transition-colors">
        {/* Modal Header */}
        <div className="border-b border-zinc-200 dark:border-zinc-800 px-5 py-3.5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Export Document</h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Choose export format and settings</p>
          </div>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Document Title */}
          <div className="space-y-1">
            <label className="text-zinc-700 dark:text-zinc-300 font-medium text-[11px]">Filename</label>
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder="Handwritten_Document"
              className="w-full px-3 py-1.5 rounded-md bg-zinc-50 dark:bg-[#141517] border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 font-mono text-xs"
            />
          </div>

          {/* Format Selection Cards */}
          <div className="space-y-1.5">
            <label className="text-zinc-700 dark:text-zinc-300 font-medium text-[11px]">Format</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`p-2.5 rounded-lg border text-center transition flex flex-col items-center gap-1 ${
                  format === 'pdf'
                    ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800/60 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1a1b1e] text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
                }`}
              >
                <FileText className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">PDF</span>
                <span className="text-[10px] text-zinc-400">Multi-page print</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('docx')}
                className={`p-2.5 rounded-lg border text-center transition flex flex-col items-center gap-1 ${
                  format === 'docx'
                    ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800/60 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1a1b1e] text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
                }`}
              >
                <FileText className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">Word</span>
                <span className="text-[10px] text-zinc-400">.docx file</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('png')}
                className={`p-2.5 rounded-lg border text-center transition flex flex-col items-center gap-1 ${
                  format === 'png'
                    ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800/60 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1a1b1e] text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">PNG</span>
                <span className="text-[10px] text-zinc-400">High-res image</span>
              </button>
            </div>
          </div>

          {/* Docx Extra Options */}
          {format === 'docx' && (
            <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-[#141517] border border-zinc-200 dark:border-zinc-800 space-y-1.5">
              <span className="text-zinc-600 dark:text-zinc-400 text-[11px] font-medium block">Mode</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDocxMode('native')}
                  className={`p-1.5 rounded-md border text-left transition ${
                    docxMode === 'native'
                      ? 'border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-800 font-medium text-zinc-900 dark:text-zinc-100'
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-500'
                  }`}
                >
                  <div className="text-xs">Native Text</div>
                  <div className="text-[10px] text-zinc-400">Styled font runs</div>
                </button>
                <button
                  type="button"
                  onClick={() => setDocxMode('image')}
                  className={`p-1.5 rounded-md border text-left transition ${
                    docxMode === 'image'
                      ? 'border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-800 font-medium text-zinc-900 dark:text-zinc-100'
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-500'
                  }`}
                >
                  <div className="text-xs">Ruled Paper Visual</div>
                  <div className="text-[10px] text-zinc-400">Embedded pages</div>
                </button>
              </div>
            </div>
          )}

          {/* Page Scope Selection */}
          <div className="space-y-1.5">
            <label className="text-zinc-700 dark:text-zinc-300 font-medium text-[11px]">Pages</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setExportScope('all')}
                className={`p-2 rounded-lg border text-center transition ${
                  exportScope === 'all'
                    ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800/60 font-medium text-zinc-900 dark:text-zinc-100'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <div>All Pages</div>
                <div className="text-[10px] text-zinc-400">{pages.length} total</div>
              </button>

              <button
                type="button"
                onClick={() => setExportScope('current')}
                className={`p-2 rounded-lg border text-center transition ${
                  exportScope === 'current'
                    ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800/60 font-medium text-zinc-900 dark:text-zinc-100'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <div>Current Page Only</div>
                <div className="text-[10px] text-zinc-400">Page {currentPageIndex + 1}</div>
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          {isExporting && (
            <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center gap-2 text-zinc-700 dark:text-zinc-300 text-xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>{progressMsg}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 px-5 py-3 bg-zinc-50/50 dark:bg-[#16171a] flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="px-3 py-1.5 rounded-md text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 text-xs font-medium transition"
          >
            Cancel
          </button>

          <button
            onClick={handleStartExport}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-xs font-medium transition disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download {format.toUpperCase()}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
