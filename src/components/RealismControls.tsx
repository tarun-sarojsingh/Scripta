'use client';

import React from 'react';
import { RealismSettings } from '@/types/handwriting';
import { Check, Square } from 'lucide-react';

interface RealismControlsProps {
  realism: RealismSettings;
  onChangeRealism: (newRealism: Partial<RealismSettings>) => void;
}

export const RealismControls: React.FC<RealismControlsProps> = ({ realism, onChangeRealism }) => {
  const applyPreset = (preset: 'subtle' | 'messy' | 'neat' | 'none') => {
    switch (preset) {
      case 'subtle':
        onChangeRealism({
          rotationJitter: 1.2,
          baselineWobble: 1.0,
          pressureVariance: 0.4,
          inkBleed: 0.2,
          letterSpacingJitter: 0.5,
          wordSpacingJitter: 1.5,
        });
        break;
      case 'messy':
        onChangeRealism({
          rotationJitter: 2.8,
          baselineWobble: 2.5,
          pressureVariance: 0.7,
          inkBleed: 0.4,
          letterSpacingJitter: 1.2,
          wordSpacingJitter: 3.0,
        });
        break;
      case 'neat':
        onChangeRealism({
          rotationJitter: 0.4,
          baselineWobble: 0.3,
          pressureVariance: 0.2,
          inkBleed: 0.1,
          letterSpacingJitter: 0.2,
          wordSpacingJitter: 0.5,
        });
        break;
      case 'none':
        onChangeRealism({
          rotationJitter: 0,
          baselineWobble: 0,
          pressureVariance: 0,
          inkBleed: 0,
          letterSpacingJitter: 0,
          wordSpacingJitter: 0,
        });
        break;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Presets */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          Imperfection & Jitter
        </label>

        {/* Quiet Preset Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => applyPreset('subtle')}
            className="px-2 py-0.5 rounded text-[10px] font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200/80 dark:hover:bg-zinc-700 transition"
          >
            Subtle
          </button>
          <button
            onClick={() => applyPreset('messy')}
            className="px-2 py-0.5 rounded text-[10px] font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200/80 dark:hover:bg-zinc-700 transition"
          >
            Rushed
          </button>
          <button
            onClick={() => applyPreset('neat')}
            className="px-2 py-0.5 rounded text-[10px] font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200/80 dark:hover:bg-zinc-700 transition"
          >
            Neat
          </button>
          <button
            onClick={() => applyPreset('none')}
            className="px-2 py-0.5 rounded text-[10px] font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            Flat
          </button>
        </div>
      </div>

      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
        Adds organic human variation to angle tilt, baseline alignment, and pen pressure flow.
      </p>

      {/* Sliders Container */}
      <div className="space-y-3 p-3.5 rounded-lg bg-zinc-50/60 dark:bg-[#141517] border border-zinc-200 dark:border-zinc-800">
        {/* Rotation Jitter */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-600 dark:text-zinc-400">Angle Tilt Jitter</span>
            <span className="text-zinc-700 dark:text-zinc-300 font-mono text-[11px]">
              ±{realism.rotationJitter.toFixed(1)}°
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="3.5"
            step="0.1"
            value={realism.rotationJitter}
            onChange={(e) => onChangeRealism({ rotationJitter: parseFloat(e.target.value) })}
            className="w-full accent-zinc-800 dark:accent-zinc-200 bg-zinc-200 dark:bg-zinc-700 h-1 rounded-lg cursor-pointer"
          />
        </div>

        {/* Baseline Wobble */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-600 dark:text-zinc-400">Baseline Drift</span>
            <span className="text-zinc-700 dark:text-zinc-300 font-mono text-[11px]">
              ±{realism.baselineWobble.toFixed(1)}px
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="4.0"
            step="0.1"
            value={realism.baselineWobble}
            onChange={(e) => onChangeRealism({ baselineWobble: parseFloat(e.target.value) })}
            className="w-full accent-zinc-800 dark:accent-zinc-200 bg-zinc-200 dark:bg-zinc-700 h-1 rounded-lg cursor-pointer"
          />
        </div>

        {/* Pressure Variance */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-600 dark:text-zinc-400">Pressure / Ink Flow</span>
            <span className="text-zinc-700 dark:text-zinc-300 font-mono text-[11px]">
              {Math.round(realism.pressureVariance * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1.0"
            step="0.05"
            value={realism.pressureVariance}
            onChange={(e) => onChangeRealism({ pressureVariance: parseFloat(e.target.value) })}
            className="w-full accent-zinc-800 dark:accent-zinc-200 bg-zinc-200 dark:bg-zinc-700 h-1 rounded-lg cursor-pointer"
          />
        </div>

        {/* Ink Bleed */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-600 dark:text-zinc-400">Fiber Bleed</span>
            <span className="text-zinc-700 dark:text-zinc-300 font-mono text-[11px]">
              {Math.round(realism.inkBleed * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1.0"
            step="0.05"
            value={realism.inkBleed}
            onChange={(e) => onChangeRealism({ inkBleed: parseFloat(e.target.value) })}
            className="w-full accent-zinc-800 dark:accent-zinc-200 bg-zinc-200 dark:bg-zinc-700 h-1 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onChangeRealism({ showMarginLine: !realism.showMarginLine })}
          className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs transition ${
            realism.showMarginLine
              ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 font-medium'
              : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700'
          }`}
        >
          <div className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center ${
            realism.showMarginLine
              ? 'bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100 text-white dark:text-zinc-900'
              : 'border-zinc-400 dark:border-zinc-600'
          }`}>
            {realism.showMarginLine && <Check className="w-2.5 h-2.5 stroke-[3]" />}
          </div>
          <span>Red Margin</span>
        </button>

        <button
          onClick={() => onChangeRealism({ showBinderHoles: !realism.showBinderHoles })}
          className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs transition ${
            realism.showBinderHoles
              ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 font-medium'
              : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700'
          }`}
        >
          <div className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center ${
            realism.showBinderHoles
              ? 'bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100 text-white dark:text-zinc-900'
              : 'border-zinc-400 dark:border-zinc-600'
          }`}>
            {realism.showBinderHoles && <Check className="w-2.5 h-2.5 stroke-[3]" />}
          </div>
          <span>Binder Holes</span>
        </button>
      </div>
    </div>
  );
};
