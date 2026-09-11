import { NextRequest, NextResponse } from 'next/server';
import { Document, Packer, Paragraph, TextRun, PageBreak, AlignmentType } from 'docx';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pages, fontFamily, fontSize = 20, lineHeight = 32, inkColor = '#1e3a8a', title = 'Handwritten_Document' } = body;

    const fontName = (fontFamily || 'Caveat').replace(/['",]/g, '').split(' ')[0];
    const hexColor = (inkColor || '#1e3a8a').replace('#', '');
    const wordFontSize = Math.round(fontSize * 1.5);

    const children: Paragraph[] = [];

    if (Array.isArray(pages)) {
      pages.forEach((page: { lines: string[] }, pageIdx: number) => {
        if (Array.isArray(page.lines)) {
          page.lines.forEach((line: string) => {
            children.push(
              new Paragraph({
                spacing: {
                  line: Math.round(lineHeight * 12),
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
        }

        if (pageIdx < pages.length - 1) {
          children.push(new Paragraph({ children: [new PageBreak()] }));
        }
      });
    }

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440,
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

    const buffer = await Packer.toBuffer(doc);

    const safeTitle = String(title || 'Handwritten_Document')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 80);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${safeTitle}.docx"`,
      },
    });
  } catch (error: any) {
    console.error('Docx generation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate docx' }, { status: 500 });
  }
}
