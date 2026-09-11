import { PageLayoutSettings, PaginatedPage, PaperSize } from '@/types/handwriting';

export interface PageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

export function getPageDimensions(size: PaperSize): PageDimensions {
  if (size === 'letter') {
    return {
      width: 816,
      height: 1056,
      aspectRatio: 8.5 / 11,
    };
  }
  // A4 default (approx 794 x 1123 at 96 DPI)
  return {
    width: 794,
    height: 1123,
    aspectRatio: 210 / 297,
  };
}

/**
 * Accurately measures text width using a cached canvas context
 */
let measurementCanvas: HTMLCanvasElement | null = null;
let measurementCtx: CanvasRenderingContext2D | null = null;

export function measureTextWidth(text: string, font: string): number {
  if (typeof window === 'undefined') {
    // Rough estimate for SSR
    return text.length * 9;
  }
  if (!measurementCanvas) {
    measurementCanvas = document.createElement('canvas');
    measurementCtx = measurementCanvas.getContext('2d');
  }
  if (measurementCtx) {
    measurementCtx.font = font;
    return measurementCtx.measureText(text).width;
  }
  return text.length * 9;
}

/**
 * Wraps text into lines that fit within the content width
 */
export function wrapText(
  text: string,
  maxWidth: number,
  fontSpec: string
): string[] {
  const resultLines: string[] = [];
  const rawParagraphs = text.split('\n');

  for (const paragraph of rawParagraphs) {
    if (paragraph.trim() === '') {
      resultLines.push('');
      continue;
    }

    const words = paragraph.split(' ');
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      const wordWidth = measureTextWidth(word, fontSpec);

      // Edge case: single unbroken word/URL wider than entire printable width
      if (wordWidth > maxWidth) {
        if (currentLine) {
          resultLines.push(currentLine);
          currentLine = '';
        }

        let chunk = '';
        for (const char of word) {
          if (measureTextWidth(chunk + char, fontSpec) > maxWidth && chunk.length > 0) {
            resultLines.push(chunk);
            chunk = char;
          } else {
            chunk += char;
          }
        }
        currentLine = chunk;
        continue;
      }

      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = measureTextWidth(testLine, fontSpec);

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          resultLines.push(currentLine);
        }
        currentLine = word;
      }
    }

    if (currentLine) {
      resultLines.push(currentLine);
    }
  }

  return resultLines;
}

/**
 * Divides lines of text into paginated pages based on layout and margins
 */
export function paginateText(
  text: string,
  layout: PageLayoutSettings
): PaginatedPage[] {
  const dimensions = getPageDimensions(layout.paperSize);
  const contentWidth = dimensions.width - layout.marginLeft - layout.marginRight;
  const contentHeight = dimensions.height - layout.marginTop - layout.marginBottom;

  const fontSpec = `${layout.fontSize}px ${layout.fontFamily}`;
  const wrappedLines = wrapText(text, contentWidth, fontSpec);

  const linesPerPage = Math.max(1, Math.floor(contentHeight / layout.lineHeight));

  if (wrappedLines.length === 0) {
    return [{ pageNumber: 1, lines: [''] }];
  }

  const pages: PaginatedPage[] = [];
  let currentPageLines: string[] = [];

  for (let i = 0; i < wrappedLines.length; i++) {
    currentPageLines.push(wrappedLines[i]);

    if (currentPageLines.length >= linesPerPage || i === wrappedLines.length - 1) {
      pages.push({
        pageNumber: pages.length + 1,
        lines: currentPageLines,
      });
      currentPageLines = [];
    }
  }

  return pages.length > 0 ? pages : [{ pageNumber: 1, lines: [''] }];
}
