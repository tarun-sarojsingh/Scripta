import { Document, Packer, Paragraph, TextRun, AlignmentType, PageBreak, ImageRun } from 'docx';
import { PageLayoutSettings, PaginatedPage, RealismSettings } from '@/types/handwriting';
import { getPageDimensions } from './pagination';
import { renderHandwritingToCanvas, renderPaperToCanvas } from './realism';

export async function exportToDocx(
  pages: PaginatedPage[],
  layout: PageLayoutSettings,
  realism: RealismSettings,
  title: string = 'Handwritten_Document',
  embedAsRenderedImages: boolean = false
): Promise<void> {
  let doc: Document;

  const fontName = layout.fontFamily.replace(/['",]/g, '').split(' ')[0] || 'Caveat';
  const hexColor = layout.inkColor.replace('#', '');
  // Word font size is in half-points (1 pt = 2 half-points). 16px ~= 12pt = 24 half-points.
  const wordFontSize = Math.round(layout.fontSize * 1.5);

  if (embedAsRenderedImages) {
    // Render each page with ruled paper and handwriting as full-page image inside Word
    const dimensions = getPageDimensions(layout.paperSize);
    const canvas = document.createElement('canvas');
    canvas.width = dimensions.width * 1.5;
    canvas.height = dimensions.height * 1.5;
    const ctx = canvas.getContext('2d');

    const imageParagraphs: Paragraph[] = [];

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        renderPaperToCanvas(ctx, dimensions.width, dimensions.height, layout, 1.5);
        renderHandwritingToCanvas(ctx, page.lines, page.pageNumber, layout, realism, 1.5);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        const base64Data = dataUrl.split(',')[1];
        const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

        imageParagraphs.push(
          new Paragraph({
            children: [
              new ImageRun({
                data: binaryData,
                transformation: {
                  width: 595,
                  height: 842,
                },
              } as any),
            ],
          })
        );

        if (i < pages.length - 1) {
          imageParagraphs.push(
            new Paragraph({
              children: [new PageBreak()],
            })
          );
        }
      }
    }

    doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
              },
            },
          },
          children: imageParagraphs,
        },
      ],
    });
  } else {
    // Native formatted Word text paragraphs with handwriting font styling
    const children: Paragraph[] = [];

    pages.forEach((page, pageIdx) => {
      page.lines.forEach((line) => {
        children.push(
          new Paragraph({
            spacing: {
              line: Math.round(layout.lineHeight * 12), // 240 = single space
              before: 60,
              after: 60,
            },
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: line,
                font: fontName,
                size: wordFontSize,
                color: hexColor,
              }),
            ],
          })
        );
      });

      if (pageIdx < pages.length - 1) {
        children.push(
          new Paragraph({
            children: [new PageBreak()],
          })
        );
      }
    });

    doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440, // 1 inch
                bottom: 1440,
                left: 1440,
                right: 1440,
              },
            },
          },
          children,
        },
      ],
    });
  }

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = (title.trim() || 'Handwritten_Document').replace(/[^a-zA-Z0-9_-]/g, '_') + '.docx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
