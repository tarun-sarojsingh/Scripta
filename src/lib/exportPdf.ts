import { jsPDF } from 'jspdf';
import { PageLayoutSettings, PaginatedPage, RealismSettings } from '@/types/handwriting';
import { getPageDimensions } from './pagination';
import { renderHandwritingToCanvas, renderPaperToCanvas } from './realism';

export interface PdfExportProgress {
  currentPage: number;
  totalPages: number;
  status: string;
}

export async function exportToPdf(
  pages: PaginatedPage[],
  layout: PageLayoutSettings,
  realism: RealismSettings,
  title: string = 'Handwritten_Document',
  onProgress?: (progress: PdfExportProgress) => void
): Promise<void> {
  const dimensions = getPageDimensions(layout.paperSize);
  const isLetter = layout.paperSize === 'letter';

  // 2x scale for crisp 200-300 DPI export
  const exportScale = 2;
  const canvasWidth = dimensions.width * exportScale;
  const canvasHeight = dimensions.height * exportScale;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: isLetter ? 'letter' : 'a4',
  });

  const pdfWidthMm = isLetter ? 215.9 : 210;
  const pdfHeightMm = isLetter ? 279.4 : 297;

  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = canvasWidth;
  offscreenCanvas.height = canvasHeight;
  const ctx = offscreenCanvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    if (onProgress) {
      onProgress({
        currentPage: i + 1,
        totalPages: pages.length,
        status: `Rendering page ${i + 1} of ${pages.length}...`,
      });
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 1. Draw Paper background (lines, texture, margins)
    renderPaperToCanvas(ctx, dimensions.width, dimensions.height, layout, exportScale);

    // 2. Draw Realistic Handwriting with jitter and wobble
    renderHandwritingToCanvas(ctx, page.lines, page.pageNumber, layout, realism, exportScale);

    // 3. Add to PDF
    const pageImgData = offscreenCanvas.toDataURL('image/jpeg', 0.95);

    if (i > 0) {
      pdf.addPage(isLetter ? 'letter' : 'a4', 'portrait');
    }

    pdf.addImage(pageImgData, 'JPEG', 0, 0, pdfWidthMm, pdfHeightMm);

    // Yield thread momentarily to keep UI responsive
    await new Promise((resolve) => setTimeout(resolve, 30));
  }

  if (onProgress) {
    onProgress({
      currentPage: pages.length,
      totalPages: pages.length,
      status: 'Saving PDF file...',
    });
  }

  const safeFileName = (title.trim() || 'Handwritten_Document').replace(/[^a-zA-Z0-9_-]/g, '_') + '.pdf';
  pdf.save(safeFileName);
}
