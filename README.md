# BloxEmpire - Next.js

A modern gambling site interface built with **Next.js**, **TypeScript**, and **Tailwind CSS**.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Static Export** - Pre-rendered for Netlify deployment

## Features

- **Roulette Game**: Auto-spinning horizontal reel with 15s rounds and 10s breaks
- **Chat Sidebar**: Real-time chat interface
- **Responsive Design**: Dark theme with gold accents
- **No Docker Required**: Static export ready for Netlify

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
```

Creates static export in `/out` directory

### Deploy to Netlify

1. Push to GitHub
2. Connect repository to Netlify
3. Build settings are auto-detected from `netlify.toml`
4. Deploy!

Or use Netlify CLI:

```bash
npm install -g netlify-cli
netlify deploy --prod
```

## Project Structure

```
bloxempire-nextjs/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/
│   ├── Header.tsx       # Navigation
│   ├── Sidebar.tsx      # Chat sidebar
│   └── Roulette.tsx     # Roulette game
├── next.config.ts       # Next.js config (static export)
├── tailwind.config.ts   # Tailwind config
└── netlify.toml         # Netlify deployment config
```

## Deployment

This project uses Next.js static export (`output: 'export'`) which means:

- ✅ No server required
- ✅ Deploy to Netlify, Vercel, GitHub Pages, etc.
- ✅ No Docker containers needed
- ✅ Fast CDN delivery

## Color Palette

- **Background**: `#101014` (empire-bg)
- **Background Light**: `#1a1a1f` (empire-bg-light)
- **Background Lighter**: `#25252a` (empire-bg-lighter)
- **Gold**: `#e9b10b` (empire-gold)
- **Gold Dark**: `#c39714` (empire-gold-dark)

## License

Educational project for demonstration purposes.
