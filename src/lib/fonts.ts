import { FontOption, InkColorOption } from '@/types/handwriting';

export const BUILT_IN_FONTS: FontOption[] = [
  {
    id: 'caveat',
    name: 'Caveat',
    family: "'Caveat', cursive",
    category: 'casual',
    description: 'Natural modern handwriting, fluid with slight upward angle.',
    slant: 'slight-slant',
    thickness: 'medium',
    previewText: 'The quick brown fox jumps over the lazy dog',
  },
  {
    id: 'kalam',
    name: 'Kalam',
    family: "'Kalam', cursive",
    category: 'neat',
    description: 'Realistic ballpoint pen schoolbook style, organic and legible.',
    slant: 'straight',
    thickness: 'medium',
    previewText: 'Assignments, journal entries and clear study notes.',
  },
  {
    id: 'homemade-apple',
    name: 'Homemade Apple',
    family: "'Homemade Apple', cursive",
    category: 'cursive',
    description: 'Authentic flowing cursive script with gentle historical warmth.',
    slant: 'slight-slant',
    thickness: 'fine',
    previewText: 'Dearest friend, wishing you peaceful days ahead.',
  },
  {
    id: 'shadows-into-light',
    name: 'Shadows Into Light',
    family: "'Shadows Into Light', cursive",
    category: 'neat',
    description: 'Neat, round, clean print lettering with subtle flair.',
    slant: 'straight',
    thickness: 'fine',
    previewText: 'Clean and tidy notes, easy to read for everyone.',
  },
  {
    id: 'patrick-hand',
    name: 'Patrick Hand',
    family: "'Patrick Hand', cursive",
    category: 'casual',
    description: 'Friendly everyday print, rounded strokes like a felt-tip pen.',
    slant: 'straight',
    thickness: 'medium',
    previewText: 'A friendly note left on the kitchen countertop.',
  },
  {
    id: 'indie-flower',
    name: 'Indie Flower',
    family: "'Indie Flower', cursive",
    category: 'playful',
    description: 'Bubbling, carefree handwriting with open loops and cheerful bounce.',
    slant: 'straight',
    thickness: 'medium',
    previewText: 'Sunny days, coffee cups and daydream adventures.',
  },
  {
    id: 'dancing-script',
    name: 'Dancing Script',
    family: "'Dancing Script', cursive",
    category: 'cursive',
    description: 'Bouncy, rhythmic cursive where letters change size dynamically.',
    slant: 'slight-slant',
    thickness: 'medium',
    previewText: 'With warmest regards and heartfelt congratulations.',
  },
  {
    id: 'reenie-beanie',
    name: 'Reenie Beanie',
    family: "'Reenie Beanie', cursive",
    category: 'casual',
    description: 'Fast, loose scribbled reminder note written with a fine marker.',
    slant: 'straight',
    thickness: 'fine',
    previewText: 'Remember: pick up milk & bread before 5 PM!',
  },
  {
    id: 'satisfy',
    name: 'Satisfy',
    family: "'Satisfy', cursive",
    category: 'cursive',
    description: 'Graceful calligraphy with rich fountain-pen swells.',
    slant: 'slight-slant',
    thickness: 'bold',
    previewText: 'Exquisite poetry penned under warm amber candlelight.',
  },
  {
    id: 'covered-by-your-grace',
    name: 'Covered By Your Grace',
    family: "'Covered By Your Grace', cursive",
    category: 'casual',
    description: 'Authentic rushed lecture notes, real-life classroom aesthetic.',
    slant: 'slight-slant',
    thickness: 'fine',
    previewText: 'Chapter 4: Thermodynamic cycles & entropy change.',
  },
  {
    id: 'marck-script',
    name: 'Marck Script',
    family: "'Marck Script', cursive",
    category: 'cursive',
    description: 'Formal, refined European cursive letter writing style.',
    slant: 'heavy-slant',
    thickness: 'fine',
    previewText: 'Yours faithfully, in recognition of outstanding service.',
  },
  {
    id: 'cedarville-cursive',
    name: 'Cedarville Cursive',
    family: "'Cedarville Cursive', cursive",
    category: 'vintage',
    description: 'Nostalgic vintage cursive resembling a handwritten heirloom.',
    slant: 'slight-slant',
    thickness: 'fine',
    previewText: 'Memories whispered through the corridors of time.',
  },
];

export const INK_COLORS: InkColorOption[] = [
  {
    id: 'royal-blue',
    name: 'Royal Fountain Blue',
    hex: '#1d4ed8',
    secondaryHex: '#1e3a8a',
    category: 'blue',
  },
  {
    id: 'gel-black',
    name: 'Gel Pen Black',
    hex: '#18181b',
    secondaryHex: '#09090b',
    category: 'black',
  },
  {
    id: 'ballpoint-blue',
    name: 'Ballpoint Pen Blue',
    hex: '#2563eb',
    secondaryHex: '#1d4ed8',
    category: 'blue',
  },
  {
    id: 'pencil-graphite',
    name: 'Pencil Graphite',
    hex: '#4b5563',
    secondaryHex: '#374151',
    category: 'pencil',
  },
  {
    id: 'teacher-red',
    name: 'Teacher Grading Red',
    hex: '#dc2626',
    secondaryHex: '#b91c1c',
    category: 'red',
  },
  {
    id: 'emerald-green',
    name: 'Emerald Green Ink',
    hex: '#047857',
    secondaryHex: '#065f46',
    category: 'green',
  },
  {
    id: 'vintage-sepia',
    name: 'Vintage Sepia',
    hex: '#78350f',
    secondaryHex: '#451a03',
    category: 'custom',
  },
];

export async function loadCustomFontFromFile(file: File): Promise<{ fontId: string; fontFamily: string; fontUrl: string }> {
  const fontName = 'Custom_' + file.name.replace(/[^a-zA-Z0-9]/g, '_') + '_' + Date.now();
  const fontDataUrl = URL.createObjectURL(file);
  const fontFace = new FontFace(fontName, `url(${fontDataUrl})`);

  await fontFace.load();
  document.fonts.add(fontFace);

  return {
    fontId: fontName,
    fontFamily: `'${fontName}', cursive, sans-serif`,
    fontUrl: fontDataUrl,
  };
}
