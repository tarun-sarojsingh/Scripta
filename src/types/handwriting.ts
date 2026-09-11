export type PaperType = 
  | 'plain' 
  | 'ruled' 
  | 'notebook' 
  | 'grid' 
  | 'dotted' 
  | 'legal' 
  | 'vintage' 
  | 'slate'
  | 'project';

export type PaperSize = 'a4' | 'letter';

export type PaperTexture = 
  | 'white' 
  | 'warm-ivory' 
  | 'legal-yellow' 
  | 'vintage-parchment' 
  | 'dark-slate';

export type FontCategory = 'all' | 'casual' | 'cursive' | 'neat' | 'vintage' | 'playful' | 'custom';

export interface FontOption {
  id: string;
  name: string;
  family: string;
  category: 'casual' | 'cursive' | 'neat' | 'vintage' | 'playful' | 'custom';
  description: string;
  isCustom?: boolean;
  slant?: 'straight' | 'slight-slant' | 'heavy-slant';
  thickness?: 'fine' | 'medium' | 'bold';
  previewText?: string;
  fontUrl?: string;
}

export interface InkColorOption {
  id: string;
  name: string;
  hex: string;
  secondaryHex?: string; // For realistic pen gradient / shine
  category: 'blue' | 'black' | 'red' | 'pencil' | 'green' | 'custom';
}

export interface RealismSettings {
  rotationJitter: number; // 0 to 4 degrees
  baselineWobble: number; // 0 to 5 px
  letterSpacingJitter: number; // 0 to 2 px
  wordSpacingJitter: number; // 0 to 4 px
  inkBleed: number; // 0 to 1 (subtle blur)
  pressureVariance: number; // 0 to 1 (opacity variance)
  showMarginLine: boolean;
  showBinderHoles: boolean;
  naturalIndent: boolean;
}

export interface PageLayoutSettings {
  paperType: PaperType;
  paperSize: PaperSize;
  paperTexture: PaperTexture;
  lineHeight: number; // 24 to 56 px
  fontSize: number; // 14 to 32 px
  fontId: string;
  fontFamily: string;
  inkColor: string;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  projectTopic?: string;
  projectDate?: string;
}

export interface CustomFontProfile {
  id: string;
  name: string;
  fontFamily: string;
  fontUrl?: string;
  source: 'upload' | 'synthesized' | 'matched';
  dateAdded: string;
  similarityScore?: number;
  matchedPresetId?: string;
}

export interface HandwritingAnalysisResult {
  slantAngle: number; // -15 to +25 degrees
  strokeThickness: 'fine' | 'medium' | 'bold';
  loopiness: 'print' | 'semi-cursive' | 'cursive';
  recommendedFontId: string;
  similarityPercent: number;
  secondaryRecommendations: Array<{
    fontId: string;
    similarityPercent: number;
    reason: string;
  }>;
  extractedSampleUrl?: string;
}

export interface PaginatedPage {
  pageNumber: number;
  lines: string[];
}

export interface ExportConfig {
  format: 'pdf' | 'docx' | 'png';
  title: string;
  allPages: boolean;
  currentPageOnly: boolean;
  includeBackground: boolean;
  qualityDpi: 150 | 300;
}
