import { BUILT_IN_FONTS } from './fonts';
import { HandwritingAnalysisResult } from '@/types/handwriting';

/**
 * Analyzes an uploaded handwriting photo on an off-screen canvas to extract
 * slant, stroke density, and cursive connectedness.
 */
export async function analyzeHandwritingImage(file: File): Promise<HandwritingAnalysisResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Could not obtain canvas context');
        }

        // Downscale for speedy pixel analysis (max 400x400)
        const scale = Math.min(1, 400 / Math.max(img.width, img.height));
        canvas.width = Math.floor(img.width * scale);
        canvas.height = Math.floor(img.height * scale);

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imgData.data;

        // 1. Grayscale & Stroke Density Analysis
        let darkPixelCount = 0;
        let totalLuminance = 0;
        const totalPixels = canvas.width * canvas.height;

        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          totalLuminance += lum;

          // Threshold for handwriting stroke ink
          if (lum < 140) {
            darkPixelCount++;
          }
        }

        const darkRatio = darkPixelCount / totalPixels;

        // Stroke Thickness Estimation
        let strokeThickness: 'fine' | 'medium' | 'bold' = 'medium';
        if (darkRatio < 0.08) strokeThickness = 'fine';
        else if (darkRatio > 0.18) strokeThickness = 'bold';

        // 2. Slant Angle Detection (Gradient / Sobel-style slant detection)
        let rightDiagonalCount = 0;
        let leftDiagonalCount = 0;
        let verticalCount = 0;

        for (let y = 1; y < canvas.height - 1; y += 2) {
          for (let x = 1; x < canvas.width - 1; x += 2) {
            const idx = (y * canvas.width + x) * 4;
            const lum = 0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2];

            if (lum < 140) {
              // Check pixel right-down (+1, +1)
              const rIdx = ((y + 1) * canvas.width + (x + 1)) * 4;
              const rLum = 0.299 * pixels[rIdx] + 0.587 * pixels[rIdx + 1] + 0.114 * pixels[rIdx + 2];
              if (rLum < 140) rightDiagonalCount++;

              // Check pixel down (0, +1)
              const vIdx = ((y + 1) * canvas.width + x) * 4;
              const vLum = 0.299 * pixels[vIdx] + 0.587 * pixels[vIdx + 1] + 0.114 * pixels[vIdx + 2];
              if (vLum < 140) verticalCount++;

              // Check pixel left-down (-1, +1)
              const lIdx = ((y + 1) * canvas.width + (x - 1)) * 4;
              const lLum = 0.299 * pixels[lIdx] + 0.587 * pixels[lIdx + 1] + 0.114 * pixels[lIdx + 2];
              if (lLum < 140) leftDiagonalCount++;
            }
          }
        }

        let slantAngle = 0;
        if (rightDiagonalCount > verticalCount * 1.1) {
          slantAngle = Math.min(22, 8 + Math.floor((rightDiagonalCount / (verticalCount + 1)) * 4));
        } else if (leftDiagonalCount > verticalCount * 1.1) {
          slantAngle = -Math.min(15, 6 + Math.floor((leftDiagonalCount / (verticalCount + 1)) * 3));
        }

        // 3. Connectedness / Loopiness (cursive vs print)
        let connectedRunTotal = 0;
        let strokeRuns = 0;

        for (let y = 10; y < canvas.height - 10; y += 8) {
          let runLength = 0;
          for (let x = 0; x < canvas.width; x++) {
            const idx = (y * canvas.width + x) * 4;
            const lum = 0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2];
            if (lum < 140) {
              runLength++;
            } else {
              if (runLength > 2) {
                connectedRunTotal += runLength;
                strokeRuns++;
              }
              runLength = 0;
            }
          }
        }

        const avgRun = strokeRuns > 0 ? connectedRunTotal / strokeRuns : 4;
        let loopiness: 'print' | 'semi-cursive' | 'cursive' = 'semi-cursive';
        if (avgRun < 5) loopiness = 'print';
        else if (avgRun > 12) loopiness = 'cursive';

        // 4. Rank Built-in Fonts by Similarity
        const scoredFonts = BUILT_IN_FONTS.map((font) => {
          let score = 70; // baseline

          // Slant match
          if (slantAngle > 8 && (font.slant === 'slight-slant' || font.slant === 'heavy-slant')) {
            score += 15;
          } else if (slantAngle <= 8 && slantAngle >= -5 && font.slant === 'straight') {
            score += 15;
          }

          // Thickness match
          if (font.thickness === strokeThickness) {
            score += 10;
          }

          // Loopiness / category match
          if (loopiness === 'cursive' && font.category === 'cursive') {
            score += 15;
          } else if (loopiness === 'print' && (font.category === 'neat' || font.category === 'playful')) {
            score += 15;
          } else if (loopiness === 'semi-cursive' && font.category === 'casual') {
            score += 15;
          }

          // Bound score between 72% and 97%
          const finalScore = Math.min(97, Math.max(72, score));

          return {
            fontId: font.id,
            fontName: font.name,
            score: finalScore,
            reason: `${font.slant === 'straight' ? 'Upright' : 'Slanted'} ${font.thickness} strokes matching sample pattern`,
          };
        });

        scoredFonts.sort((a, b) => b.score - a.score);

        const best = scoredFonts[0];
        const secondary = scoredFonts.slice(1, 4).map((f) => ({
          fontId: f.fontId,
          similarityPercent: f.score,
          reason: f.reason,
        }));

        resolve({
          slantAngle,
          strokeThickness,
          loopiness,
          recommendedFontId: best.fontId,
          similarityPercent: best.score,
          secondaryRecommendations: secondary,
          extractedSampleUrl: objectUrl,
        });
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => reject(new Error('Failed to load handwriting image'));
    img.src = objectUrl;
  });
}
