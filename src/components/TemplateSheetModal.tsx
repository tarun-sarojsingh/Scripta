'use client';

import React from 'react';
import { X, Printer } from 'lucide-react';

interface TemplateSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TemplateSheetModal: React.FC<TemplateSheetModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const alphabetUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const alphabetLower = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const numbers = '0123456789'.split('');
  const punctuation = ['.', ',', '!', '?', "'", '"', '-', ':', ';', '(', ')', '/', '$', '&'];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-[#1a1b1e] border border-zinc-200 dark:border-zinc-800 rounded-lg w-full max-w-2xl overflow-hidden shadow-lg flex flex-col max-h-[90vh] transition-colors">
        {/* Header */}
        <div className="border-b border-zinc-200 dark:border-zinc-800 px-5 py-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Handwriting Alphabet Grid</h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Print this sheet, write characters in the boxes with a dark pen, and scan/photograph it
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-xs font-medium transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Sheet Viewport */}
        <div className="p-6 overflow-y-auto bg-zinc-100/70 dark:bg-[#121316] flex-1">
          <div className="bg-white text-zinc-900 p-8 rounded shadow-xs max-w-xl mx-auto print:p-0 print:shadow-none print:max-w-none print:m-0 font-sans">
            {/* Sheet Title */}
            <div className="border-b border-zinc-300 pb-3 mb-5 flex items-center justify-between">
              <div>
                <h1 className="text-base font-semibold text-zinc-900">
                  Scripta Handwriting Sample Template
                </h1>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Write each letter clearly inside its box using a dark gel or ballpoint pen.
                </p>
              </div>
              <div className="text-right text-[10px] text-zinc-400 font-mono">
                A4 / Letter
              </div>
            </div>

            {/* Uppercase */}
            <div className="mb-5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                Uppercase (A - Z)
              </div>
              <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5">
                {alphabetUpper.map((char) => (
                  <div
                    key={char}
                    className="aspect-square border border-zinc-300 rounded relative flex flex-col justify-between p-1 bg-zinc-50/40"
                  >
                    <span className="text-[9px] font-medium text-zinc-400">{char}</span>
                    <div className="absolute inset-x-1 bottom-2.5 border-b border-dashed border-zinc-300 pointer-events-none" />
                  </div>
                ))}
              </div>
            </div>

            {/* Lowercase */}
            <div className="mb-5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                Lowercase (a - z)
              </div>
              <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5">
                {alphabetLower.map((char) => (
                  <div
                    key={char}
                    className="aspect-square border border-zinc-300 rounded relative flex flex-col justify-between p-1 bg-zinc-50/40"
                  >
                    <span className="text-[9px] font-medium text-zinc-400">{char}</span>
                    <div className="absolute inset-x-1 bottom-2.5 border-b border-dashed border-zinc-300 pointer-events-none" />
                  </div>
                ))}
              </div>
            </div>

            {/* Numbers & Punctuation */}
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                Numbers & Punctuation
              </div>
              <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5">
                {[...numbers, ...punctuation].map((char, idx) => (
                  <div
                    key={idx}
                    className="aspect-square border border-zinc-300 rounded relative flex flex-col justify-between p-1 bg-zinc-50/40"
                  >
                    <span className="text-[9px] font-medium text-zinc-400">{char}</span>
                    <div className="absolute inset-x-1 bottom-2.5 border-b border-dashed border-zinc-300 pointer-events-none" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-2 border-t border-zinc-200 text-[9px] text-zinc-400 flex justify-between">
              <span>Keep paper flat and in good lighting when scanning.</span>
              <span>Scripta Studio</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
