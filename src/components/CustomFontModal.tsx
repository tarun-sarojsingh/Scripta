'use client';

import React, { useState } from 'react';
import { CustomFontProfile, FontOption, HandwritingAnalysisResult } from '@/types/handwriting';
import { analyzeHandwritingImage } from '@/lib/handwritingAnalyzer';
import { loadCustomFontFromFile } from '@/lib/fonts';
import {
  X,
  Upload,
  Camera,
  Check,
  Loader2,
  Download,
  Printer,
} from 'lucide-react';

interface CustomFontModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomFont: (font: FontOption, profile: CustomFontProfile) => void;
  onSelectPresetFontById: (fontId: string) => void;
  onOpenTemplateSheet: () => void;
  savedProfiles: CustomFontProfile[];
}

type ModalTab = 'photo-match' | 'font-file' | 'path-b-pipeline';

export const CustomFontModal: React.FC<CustomFontModalProps> = ({
  isOpen,
  onClose,
  onAddCustomFont,
  onSelectPresetFontById,
  onOpenTemplateSheet,
  savedProfiles,
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('photo-match');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<HandwritingAnalysisResult | null>(null);

  const [customFontName, setCustomFontName] = useState('My Handwriting');
  const [fontFileLoading, setFontFileLoading] = useState(false);

  const [synthesisLoading, setSynthesisLoading] = useState(false);
  const [synthesisSuccess, setSynthesisSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeHandwritingImage(file);
      setAnalysisResult(result);
    } catch (err: any) {
      alert('Could not analyze handwriting image: ' + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFontFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFontFileLoading(true);
    try {
      const loaded = await loadCustomFontFromFile(file);

      const newFont: FontOption = {
        id: loaded.fontId,
        name: customFontName.trim() || file.name.replace(/\.[^/.]+$/, ''),
        family: loaded.fontFamily,
        category: 'custom',
        description: 'Uploaded custom handwriting font file',
        isCustom: true,
        previewText: 'Custom handwriting sample text',
        fontUrl: loaded.fontUrl,
      };

      const profile: CustomFontProfile = {
        id: loaded.fontId,
        name: newFont.name,
        fontFamily: loaded.fontFamily,
        fontUrl: loaded.fontUrl,
        source: 'upload',
        dateAdded: new Date().toLocaleDateString(),
      };

      onAddCustomFont(newFont, profile);
      onClose();
    } catch (err: any) {
      alert('Failed to load font file: ' + err.message);
    } finally {
      setFontFileLoading(false);
    }
  };

  const handleSynthesizeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSynthesisLoading(true);
    setSynthesisSuccess(false);

    try {
      const formData = new FormData();
      formData.append('template', file);
      formData.append('fontName', customFontName);
      formData.append('provider', 'auto');

      const res = await fetch('/api/font/synthesize', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Pipeline request failed');

      setSynthesisSuccess(true);

      const customFont: FontOption = {
        id: data.fontId,
        name: data.fontName,
        family: data.fontFamily,
        category: 'custom',
        description: 'Synthesized custom handwriting profile',
        isCustom: true,
        previewText: 'Generated handwriting font profile',
      };

      const profile: CustomFontProfile = {
        id: data.fontId,
        name: data.fontName,
        fontFamily: data.fontFamily,
        source: 'synthesized',
        dateAdded: new Date().toLocaleDateString(),
      };

      onAddCustomFont(customFont, profile);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      alert('Font synthesis error: ' + err.message);
    } finally {
      setSynthesisLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-[#1a1b1e] border border-zinc-200 dark:border-zinc-800 rounded-lg w-full max-w-lg overflow-hidden shadow-lg flex flex-col max-h-[90vh] transition-colors">
        {/* Header */}
        <div className="border-b border-zinc-200 dark:border-zinc-800 px-5 py-3.5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Custom Handwriting</h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Match your handwriting from a photo or upload a custom font file
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#16171a] p-1 gap-1 text-xs font-medium">
          <button
            onClick={() => setActiveTab('photo-match')}
            className={`flex-1 py-1.5 px-2 rounded-md flex items-center justify-center gap-1.5 transition ${
              activeTab === 'photo-match'
                ? 'bg-white dark:bg-[#222328] text-zinc-900 dark:text-zinc-100 shadow-xs border border-zinc-200/80 dark:border-zinc-700/60'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Photo Matcher</span>
          </button>

          <button
            onClick={() => setActiveTab('font-file')}
            className={`flex-1 py-1.5 px-2 rounded-md flex items-center justify-center gap-1.5 transition ${
              activeTab === 'font-file'
                ? 'bg-white dark:bg-[#222328] text-zinc-900 dark:text-zinc-100 shadow-xs border border-zinc-200/80 dark:border-zinc-700/60'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Font File (.ttf)</span>
          </button>

          <button
            onClick={() => setActiveTab('path-b-pipeline')}
            className={`flex-1 py-1.5 px-2 rounded-md flex items-center justify-center gap-1.5 transition ${
              activeTab === 'path-b-pipeline'
                ? 'bg-white dark:bg-[#222328] text-zinc-900 dark:text-zinc-100 shadow-xs border border-zinc-200/80 dark:border-zinc-700/60'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Template Grid</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
          {/* TAB 1: Photo Matcher */}
          {activeTab === 'photo-match' && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-normal">
                Upload a photo or scan of your handwriting. Our visual stroke analyzer measures slant angle, line weight, and cursive loopiness to find your closest matching handwriting style.
              </p>

              {/* Upload Drop Zone */}
              <label className="border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-zinc-50/50 dark:bg-zinc-800/20 transition">
                <div className="w-10 h-10 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center mb-2">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="font-medium text-zinc-800 dark:text-zinc-200 text-xs">
                  {analyzing ? 'Analyzing strokes...' : 'Upload Handwriting Photo or Scan'}
                </span>
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">JPG or PNG up to 10MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={analyzing}
                  className="hidden"
                />
              </label>

              {analyzing && (
                <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center gap-2.5 text-zinc-600 dark:text-zinc-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Measuring slant angle, stroke weight, and loopiness...</span>
                </div>
              )}

              {/* Results */}
              {analysisResult && (
                <div className="space-y-3 p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Matching Style Found
                    </span>
                    <span className="font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      {analysisResult.similarityPercent}% Match
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                    <div className="p-2 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                      <div className="text-zinc-400">Slant</div>
                      <div className="font-medium text-zinc-700 dark:text-zinc-300">
                        {analysisResult.slantAngle > 0 ? `+${analysisResult.slantAngle}°` : `${analysisResult.slantAngle}°`}
                      </div>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                      <div className="text-zinc-400">Stroke Weight</div>
                      <div className="font-medium text-zinc-700 dark:text-zinc-300 capitalize">
                        {analysisResult.strokeThickness}
                      </div>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                      <div className="text-zinc-400">Loopiness</div>
                      <div className="font-medium text-zinc-700 dark:text-zinc-300 capitalize">
                        {analysisResult.loopiness}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onSelectPresetFontById(analysisResult.recommendedFontId);
                      onClose();
                    }}
                    className="w-full py-2 rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-medium text-xs transition"
                  >
                    Apply Matched Font
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Upload Font File */}
          {activeTab === 'font-file' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-zinc-700 dark:text-zinc-300 font-medium text-[11px]">Profile Name</label>
                <input
                  type="text"
                  value={customFontName}
                  onChange={(e) => setCustomFontName(e.target.value)}
                  placeholder="e.g. My Personal Script"
                  className="w-full px-3 py-1.5 rounded-md bg-zinc-50 dark:bg-[#141517] border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:border-zinc-400"
                />
              </div>

              <label className="border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-zinc-50/50 dark:bg-zinc-800/20 transition">
                <div className="w-10 h-10 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center mb-2">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="font-medium text-zinc-800 dark:text-zinc-200 text-xs">
                  {fontFileLoading ? 'Registering Font...' : 'Select .ttf, .otf, or .woff Font'}
                </span>
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                  Load your custom font directly into the browser
                </span>
                <input
                  type="file"
                  accept=".ttf,.otf,.woff,.woff2"
                  onChange={handleFontFileUpload}
                  disabled={fontFileLoading}
                  className="hidden"
                />
              </label>

              {/* Saved Profiles */}
              {savedProfiles.length > 0 && (
                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-2">
                    Saved Custom Fonts ({savedProfiles.length})
                  </span>
                  <div className="space-y-1.5">
                    {savedProfiles.map((prof) => (
                      <div
                        key={prof.id}
                        className="p-2 rounded-md bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium text-zinc-900 dark:text-zinc-100 text-xs">{prof.name}</div>
                          <div className="text-[10px] text-zinc-400">Added {prof.dateAdded}</div>
                        </div>
                        <button
                          onClick={() => {
                            onSelectPresetFontById(prof.id);
                            onClose();
                          }}
                          className="px-2 py-0.5 rounded text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                        >
                          Select
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Path B Printable Template & Pipeline */}
          {activeTab === 'path-b-pipeline' && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-normal">
                Download the alphabet grid sheet, write each character clearly with a dark pen, and scan/photograph it to generate a custom handwriting font.
              </p>

              {/* Sheet Trigger */}
              <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium text-zinc-900 dark:text-zinc-100 text-xs">Printable Alphabet Template</div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Standard A4 / Letter letter-box grid</div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenTemplateSheet();
                  }}
                  className="px-3 py-1.5 rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-xs font-medium transition"
                >
                  View Sheet
                </button>
              </div>

              {/* Upload Completed Template Scan */}
              <label className="border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-zinc-50/50 dark:bg-zinc-800/20 transition">
                <div className="w-10 h-10 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center mb-2">
                  {synthesisLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                </div>
                <span className="font-medium text-zinc-800 dark:text-zinc-200 text-xs">
                  {synthesisLoading ? 'Processing Handwriting Template...' : 'Upload Completed Template Scan'}
                </span>
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                  Sends scan to Path B font extraction pipeline
                </span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleSynthesizeUpload}
                  disabled={synthesisLoading}
                  className="hidden"
                />
              </label>

              {synthesisSuccess && (
                <div className="p-2.5 rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Custom font generated and loaded successfully!</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Privacy Note Footer */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 px-5 py-2.5 bg-zinc-50/60 dark:bg-[#16171a] text-[10px] text-zinc-500 dark:text-zinc-400">
          🔒 Privacy: Your handwriting photos are analyzed locally in your browser and are never stored or used for model training.
        </div>
      </div>
    </div>
  );
};
