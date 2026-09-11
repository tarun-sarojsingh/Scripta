import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata: Metadata = {
  title: 'Scripta — Realistic Text-to-Handwriting Studio',
  description:
    'Transform digital text into authentic, realistic handwriting on customizable ruled or plain notebook paper. Export to multi-page PDF, Word (.docx), and high-resolution PNG.',
  keywords: [
    'text to handwriting',
    'handwriting generator',
    'realistic handwriting converter',
    'ruled notebook paper',
    'handwritten assignment generator',
    'handwriting pdf export',
  ],
  authors: [{ name: 'Scripta Studio' }],
  metadataBase: new URL('https://scripta.app'),
  openGraph: {
    title: 'Scripta — Text-to-Handwriting Studio',
    description: 'Transform digital text into realistic, authentic handwriting on customizable ruled notebook paper.',
    url: 'https://scripta.app',
    siteName: 'Scripta',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scripta — Realistic Text-to-Handwriting Studio',
    description: 'Transform digital text into authentic, realistic handwriting on customizable ruled notebook paper.',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f9f9fb' },
    { media: '(prefers-color-scheme: dark)', color: '#141517' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('scripta_theme');
                  var isDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches) || (saved === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
