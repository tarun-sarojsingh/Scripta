import { PageLayoutSettings, RealismSettings } from '@/types/handwriting';
import { getPageDimensions } from './pagination';

/**
 * Deterministic pseudo-random number generator (Mulberry32)
 */
export function seededRandom(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Hash a string to a stable integer seed
 */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash) + 1;
}

export interface CharacterJitter {
  char: string;
  rotateDeg: number;
  offsetY: number;
  opacity: number;
  scale: number;
}

export interface WordJitter {
  word: string;
  rotateDeg: number;
  offsetY: number;
  opacity: number;
  letterJitters: CharacterJitter[];
}

/**
 * Generates natural jitter properties for a line of text
 */
export function generateLineJitter(
  line: string,
  lineIndex: number,
  pageNumber: number,
  settings: RealismSettings
): WordJitter[] {
  const seed = hashString(`${pageNumber}_${lineIndex}_${line}`);
  const rng = seededRandom(seed);

  const words = line.split(' ');
  return words.map((word, wordIdx) => {
    // Word-level jitter
    const wordRotate = (rng() - 0.5) * 2 * settings.rotationJitter * 0.4;
    const wordOffsetY = (rng() - 0.5) * 2 * settings.baselineWobble * 0.5;
    const wordOpacity = 1 - rng() * settings.pressureVariance * 0.15;

    // Character-level jitter
    const letterJitters: CharacterJitter[] = word.split('').map((char) => {
      const charRng = rng();
      const rotateDeg = (charRng - 0.5) * 2 * settings.rotationJitter;
      const offsetY = (rng() - 0.5) * 2 * settings.baselineWobble;
      const opacity = 1 - rng() * settings.pressureVariance * 0.18;
      const scale = 0.98 + rng() * 0.04;

      return {
        char,
        rotateDeg,
        offsetY,
        opacity: Math.max(0.75, Math.min(1, opacity)),
        scale,
      };
    });

    return {
      word,
      rotateDeg: wordRotate,
      offsetY: wordOffsetY,
      opacity: Math.max(0.8, Math.min(1, wordOpacity)),
      letterJitters,
    };
  });
}

/**
 * Draws realistic paper background, notebook rulings, margin lines, and binder holes onto an HTML5 Canvas
 */
export function renderPaperToCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  layout: PageLayoutSettings,
  scale: number = 1
): void {
  ctx.save();
  ctx.scale(scale, scale);

  // 1. Paper Base Fill
  let bgColor = '#ffffff';
  if (layout.paperTexture === 'warm-ivory') bgColor = '#faf7ee';
  else if (layout.paperTexture === 'legal-yellow') bgColor = '#fef9c3';
  else if (layout.paperTexture === 'vintage-parchment') bgColor = '#f5eedb';
  else if (layout.paperTexture === 'dark-slate') bgColor = '#1e293b';

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Subtle paper grain / fiber noise effect
  if (layout.paperTexture === 'vintage-parchment' || layout.paperTexture === 'warm-ivory') {
    ctx.fillStyle = 'rgba(180, 150, 100, 0.03)';
    for (let i = 0; i < 600; i += 2) {
      const rx = (Math.sin(i * 99) * 0.5 + 0.5) * width;
      const ry = (Math.cos(i * 33) * 0.5 + 0.5) * height;
      ctx.fillRect(rx, ry, 2, 1);
    }
  }

  // 2. Paper Patterns: Ruled Lines / Margin / Grid / Dotted
  const isDark = layout.paperTexture === 'dark-slate';
  const lineStroke = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(59, 130, 246, 0.22)';
  const gridStroke = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(96, 165, 250, 0.16)';
  const marginStroke = isDark ? 'rgba(239, 68, 68, 0.35)' : 'rgba(239, 68, 68, 0.4)';

  if (layout.paperType === 'ruled' || layout.paperType === 'notebook' || layout.paperType === 'legal') {
    ctx.strokeStyle = lineStroke;
    ctx.lineWidth = 1;

    let y = layout.marginTop;
    while (y < height - layout.marginBottom) {
      ctx.beginPath();
      ctx.moveTo(layout.paperType === 'notebook' ? layout.marginLeft - 20 : 20, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();
      y += layout.lineHeight;
    }
  } else if (layout.paperType === 'grid') {
    const gridSize = 24; // 5mm equivalent
    ctx.strokeStyle = gridStroke;
    ctx.lineWidth = 0.8;

    // Vertical grid
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    // Horizontal grid
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  } else if (layout.paperType === 'dotted') {
    const dotSpacing = 24;
    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(100, 116, 139, 0.3)';
    for (let x = dotSpacing; x < width; x += dotSpacing) {
      for (let y = dotSpacing; y < height; y += dotSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (layout.paperType === 'project') {
    // Exact vector reproduction of Docs/A4_Project_Ruled_Paper.pdf
    const scaleX = width / 595.2756;
    const scaleY = height / 841.8898;

    const strokeColor = isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(24, 24, 27, 0.78)';
    const textColor = isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(24, 24, 27, 0.85)';

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = Math.max(1, 1 * scaleX);

    // 1. Double Header Box
    // Outer rect: x=40, y=771.8898 (from bottom), w=515.2756, h=35 in PDF
    const outerX = 40 * scaleX;
    const outerY = (841.8898 - 771.8898 - 35) * scaleY;
    const outerW = 515.2756 * scaleX;
    const outerH = 35 * scaleY;
    ctx.strokeRect(outerX, outerY, outerW, outerH);

    // Inner rect: 2pt inset on all sides
    const innerX = 42 * scaleX;
    const innerY = (841.8898 - 773.8898 - 31) * scaleY;
    const innerW = 511.2756 * scaleX;
    const innerH = 31 * scaleY;
    ctx.strokeRect(innerX, innerY, innerW, innerH);

    // 2. Header Text (Topic & Date)
    ctx.fillStyle = textColor;
    const headerFontSize = Math.round(11 * scaleY);
    ctx.font = `${headerFontSize}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
    ctx.textBaseline = 'alphabetic';

    const headerTextY = (841.8898 - 783.8898) * scaleY;
    const topicText = layout.projectTopic?.trim()
      ? `Topic: ${layout.projectTopic.trim()}`
      : 'Topic......................................................................................';
    const dateText = layout.projectDate?.trim()
      ? `Date: ${layout.projectDate.trim()}`
      : 'Date............................................';

    ctx.fillText(topicText, 50 * scaleX, headerTextY);
    ctx.fillText(dateText, 360 * scaleX, headerTextY);

    // 3. Vertical Left Margin Line
    const marginX = 85 * scaleX;
    const marginStartY = (841.8898 - 771.8898) * scaleY;
    const marginEndY = (841.8898 - 40) * scaleY;

    ctx.beginPath();
    ctx.moveTo(marginX, marginStartY);
    ctx.lineTo(marginX, marginEndY);
    ctx.stroke();

    // 4. Horizontal Ruled Lines (31 lines from 746.8898 down to 71.88976 spaced by 22.5 pt)
    const lineStartX = 40 * scaleX;
    const lineEndX = (40 + 515.2756) * scaleX;

    for (let i = 0; i <= 30; i++) {
      const lineY = (95 + i * 22.5) * scaleY;
      ctx.beginPath();
      ctx.moveTo(lineStartX, lineY);
      ctx.lineTo(lineEndX, lineY);
      ctx.stroke();
    }

    // 5. Footer Elements
    const footerY = (841.8898 - 35) * scaleY;
    ctx.font = `bold italic ${Math.round(11 * scaleY)}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
    ctx.fillText('DSR', 40 * scaleX, footerY);

    ctx.font = `${Math.round(10 * scaleY)}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
    ctx.fillText("Teacher's Sign....................................", 388.8156 * scaleX, footerY);
  }

  // 3. Margin Lines for Notebook & Legal Pad
  if (layout.paperType === 'notebook' || layout.paperType === 'legal') {
    ctx.strokeStyle = marginStroke;
    ctx.lineWidth = 1.5;

    const marginX = layout.marginLeft;
    ctx.beginPath();
    ctx.moveTo(marginX, 0);
    ctx.lineTo(marginX, height);
    ctx.stroke();

    if (layout.paperType === 'legal') {
      // Double red margin rule on legal pads
      ctx.beginPath();
      ctx.moveTo(marginX + 4, 0);
      ctx.lineTo(marginX + 4, height);
      ctx.stroke();

      // Top binding tape for legal pad
      ctx.fillStyle = '#b45309';
      ctx.fillRect(0, 0, width, 22);
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, width, 22);
    }
  }

  // 4. Punched 3-Hole Binder Effect for Notebook
  if (layout.paperType === 'notebook') {
    const holeRadius = 9;
    const holeX = Math.max(16, layout.marginLeft / 2.5);
    const holesY = [height * 0.15, height * 0.5, height * 0.85];

    for (const holeY of holesY) {
      ctx.fillStyle = isDark ? '#0f172a' : '#e2e8f0';
      ctx.beginPath();
      ctx.arc(holeX, holeY, holeRadius, 0, Math.PI * 2);
      ctx.fill();

      // Inner shadow
      ctx.strokeStyle = 'rgba(0,0,0,0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  ctx.restore();
}

/**
 * Draws realistic handwritten text onto canvas with character/word jitter, baseline wobble, and ink bleed
 */
export function renderHandwritingToCanvas(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  pageNumber: number,
  layout: PageLayoutSettings,
  realism: RealismSettings,
  scale: number = 1
): void {
  ctx.save();
  ctx.scale(scale, scale);

  ctx.font = `${layout.fontSize}px ${layout.fontFamily}`;
  ctx.fillStyle = layout.inkColor;
  // Position first line comfortably on the ruled line without clipping ascenders
  let currentY = layout.marginTop + (
    (layout.paperType === 'ruled' || layout.paperType === 'notebook' || layout.paperType === 'legal' || layout.paperType === 'project')
      ? layout.lineHeight - 4
      : layout.fontSize * 1.1
  );

  lines.forEach((line, lineIndex) => {
    if (line.trim().length === 0) {
      currentY += layout.lineHeight;
      return;
    }

    const wordJitters = generateLineJitter(line, lineIndex, pageNumber, realism);
    let currentX = layout.marginLeft;

    wordJitters.forEach((wordJitter) => {
      ctx.save();

      // Apply word-level jitter
      ctx.translate(currentX, currentY + wordJitter.offsetY);
      ctx.rotate((wordJitter.rotateDeg * Math.PI) / 180);
      ctx.globalAlpha = wordJitter.opacity;

      let letterX = 0;
      wordJitter.letterJitters.forEach((charJitter) => {
        ctx.save();
        ctx.translate(letterX, charJitter.offsetY);
        ctx.rotate((charJitter.rotateDeg * Math.PI) / 180);
        ctx.scale(charJitter.scale, charJitter.scale);
        ctx.globalAlpha = charJitter.opacity;

        // Subtle ink bleed shadow simulation
        if (realism.inkBleed > 0.1) {
          ctx.shadowColor = layout.inkColor;
          ctx.shadowBlur = realism.inkBleed * 1.5;
        }

        ctx.fillText(charJitter.char, 0, 0);
        ctx.restore();

        const charWidth = ctx.measureText(charJitter.char).width;
        letterX += charWidth + (realism.letterSpacingJitter ? (Math.random() - 0.5) * realism.letterSpacingJitter : 0);
      });

      ctx.restore();

      const wordWidth = letterX;
      const spaceWidth = ctx.measureText(' ').width + (realism.wordSpacingJitter ? (Math.random() - 0.5) * realism.wordSpacingJitter : 0);
      currentX += wordWidth + spaceWidth;
    });

    currentY += layout.lineHeight;
  });

  ctx.restore();
}
