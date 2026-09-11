# Scripta Studio ✍️

> **Realistic Digital Text-to-Handwriting Synthesizer & Multi-Page Document Generator**

[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Transform digital text into authentic, realistic handwriting on customizable ruled notebook paper, project assignment sheets, legal pads, and vintage parchment. Export effortlessly to multi-page **PDF**, Microsoft Word (**DOCX**), and high-resolution **PNG**.

---

## ✨ Features

### 🖋️ Dynamic Realism & Human Imperfection Engine
- **Angle Tilt Jitter (±0° to 3.5°)**: Adds subtle, organic rotation to words and letter clusters.
- **Baseline Drift (±0px to 4.0px)**: Simulates natural human hand drift across ruled lines.
- **Pressure Variance & Ink Flow (0% to 100%)**: Replicates variable pen pressure and ballpoint/gel pen ink deposition.
- **Fiber Ink Bleed (0% to 100%)**: Emulates capillary absorption of liquid ink into paper pulp fibers.
- **One-Click Realism Presets**: Fast switching between *Subtle*, *Rushed / Messy*, *Neat*, and *Flat / Mechanical*.

### 📄 Authentic Paper Types & Styles
- **A4 Project Paper**: Exact vector reproduction of standard academic project ruled sheets, featuring a double-border header box (Topic & Date), vertical margin rule, 31 horizontal lines (30px line spacing), **DSR** brand, and **Teacher's Sign** footer.
- **Notebook Sheet**: College-ruled notebook with classic red margin rule and punched 3-hole binder rings.
- **Lined / Ruled**: Clean, modern horizontal rulings.
- **Plain Blank**: Clean unruled sheet for sketches and freeform letters.
- **Grid / Quad**: 5mm mathematical graph paper pattern.
- **Dotted Matrix**: Bullet journal dot matrix pattern.
- **Legal Pad**: Goldenrod legal pad with double red margin and top binding tape.
- **Vintage Parchment**: Aged paper with warm texture and organic fiber grain.

### 🎨 Paper Tones & Pen Inks
- **Paper Tones**: *Crisp White*, *Warm Ivory*, *Legal Yellow*, *Vintage Parchment*, and *Dark Slate*.
- **Ink Colors**: *Royal Blue*, *Dark Navy*, *Gel Pen Black*, *Pencil Graphite*, *Crimson Red*, *Forest Green*, plus an interactive custom hex color picker.

### 🔤 Handwriting Fonts & Custom Font Profiler
- **Curated Built-in Fonts**: Includes Caveat, Shadows Into Light, Dancing Script, Indie Flower, Kalam, Patrick Hand, Reenie Beanie, and Homemade Apple.
- **Custom Font Upload**: Drag and drop any custom `.ttf`, `.otf`, or `.woff` font file.
- **Handwriting Template Sheet**: Printable alphabet matrix sheet for scanning or photographing personal handwriting.
- **Style Analysis**: Synthetic analyzer that recommends matching font models based on stroke thickness, slant, and loopiness.

### 📑 Smart Multi-Page Pagination & Preview
- **Real-Time Layout Engine**: Automatically measures canvas text metrics and paginates long essays or lecture notes across multiple pages.
- **Dual Preview Modes**:
  - **Single Page View**: Interactive zoom (40% to 150%) with smooth page navigation and back-to-top rail.
  - **Grid Overview**: Visual grid showing thumbnail previews of all generated pages simultaneously.

### 🚀 Production Export Options
- **Multi-Page PDF**: Ultra-crisp vector-aligned PDF export rendered at 300 DPI via `jsPDF`.
- **Microsoft Word (.docx)**: Supports both native styled text runs with handwriting typography or embedded full-page rendered image documents.
- **Single Page PNG**: High-resolution 2.5x retina image download.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.3 (Turbopack & App Router)](https://nextjs.org/)
- **UI & State**: [React 19](https://react.dev/), [Lucide React](https://lucide.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with native dark mode support
- **Canvas & Rendering**: HTML5 Canvas 2D Context with sub-pixel text rendering
- **Document Export**: [jsPDF](https://github.com/parallax/jsPDF), [docx](https://github.com/dolanmiu/docx), [canvas-confetti](https://github.com/catdad/canvas-confetti)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.18 or higher recommended)
- `npm`, `yarn`, `pnpm`, or `bun`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/tarun-sarojsingh/Scripta.git
   cd Scripta
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the local development server**:
   ```bash
   npm run dev
   ```

4. **Open the app**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```

---

## ☁️ Deploy to Cloudflare

Deploying Scripta to Cloudflare Pages is fast and free:

### Method 1: Cloudflare Pages (GitHub Integration - Recommended)

1. Log into your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select the `tarun-sarojsingh/Scripta` repository.
4. Set the build configuration:
   - **Framework preset**: `Next.js`
   - **Build command**: `npm run build`
   - **Output directory**: `.next`
   - **Node.js compatibility flag**: Under **Environment variables**, set `NODE_VERSION` = `20`.
5. Click **Save and Deploy**. Cloudflare will build and assign you a global `*.pages.dev` URL with automatic SSL.

### Method 2: Instant Public Tunnel (Zero Config)

To expose your locally running instance online immediately via Cloudflare's edge:

```bash
# Install cloudflared or run via npx
npx cloudflared tunnel --url http://localhost:3000
```
This generates a secure, publicly accessible `https://<random-id>.trycloudflare.com` URL instantly.

---

## 📁 Project Architecture

```
Scripta/
├── src/
│   ├── app/
│   │   ├── api/             # Document export & font synthesis endpoints
│   │   ├── globals.css      # CSS variables, typography, and paper styling
│   │   ├── layout.tsx       # Root layout with SEO and theme metadata
│   │   └── page.tsx         # Main studio application view
│   ├── components/
│   │   ├── CustomFontModal.tsx     # Custom font uploader & handwriting analyzer
│   │   ├── EditorPane.tsx          # Multi-tab text editor and controls deck
│   │   ├── ExportModal.tsx         # PDF / DOCX / PNG configuration modal
│   │   ├── FontSelector.tsx        # Visual font browser with categories
│   │   ├── Header.tsx              # Studio header, stats & quick actions
│   │   ├── PaperControls.tsx       # Paper types, tones, ink & project header
│   │   ├── PreviewCanvas.tsx       # Live single-page and grid canvas preview
│   │   ├── RealismControls.tsx     # Organic tilt, wobble & pressure sliders
│   │   └── TemplateSheetModal.tsx  # Printable handwriting alphabet sheet
│   ├── context/
│   │   └── ThemeContext.tsx        # Persistent dark/light mode provider
│   ├── lib/
│   │   ├── exportDocx.ts           # Word document generation logic
│   │   ├── exportPdf.ts            # High-resolution multi-page PDF generator
│   │   ├── fonts.ts                # Built-in handwriting font registry
│   │   ├── handwritingAnalyzer.ts  # OCR-assisted handwriting profiler
│   │   ├── pagination.ts           # Dynamic wrapping & page-split math
│   │   ├── realism.ts              # Canvas background & jitter rendering engine
│   │   └── sampleTexts.ts          # Academic, letter & study note presets
│   └── types/
│       └── handwriting.ts          # Core TypeScript definitions & interfaces
├── public/                         # Static assets and favicons
├── next.config.ts                  # Next.js configuration
├── package.json                    # Project dependencies and scripts
└── tsconfig.json                   # Strict TypeScript compiler options
```

---

## 🤝 Contributing

Contributions, feature requests, and suggestions are always welcome!
Feel free to open an issue or submit a pull request to help improve Scripta Studio.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

Developed with ❤️ by [Tarun Saroj Singh](https://github.com/tarun-sarojsingh).
