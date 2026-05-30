# 🖤 Lola's Birthday Website

**Chaotic Cyber-Punk × Billie Eilish Era Transitions × 3D Polaroid Wish Wall**

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Setup

### 1. Set the passcode
Edit `.env.local` and change `VITE_PASSCODE`:
```
VITE_PASSCODE=LOLA2026
```

### 2. Set up Supabase (for live wish wall)
1. Create a free project at [supabase.com](https://supabase.com)
2. Run `supabase-schema.sql` in the SQL editor
3. Enable **Realtime** for the `wishes` table in the Supabase dashboard
4. Add your credentials to `.env.local`:
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> Without Supabase credentials, the site still works with demo wishes and local submissions.

### 3. Add audio (optional)
Drop `ambient-loop.mp3` into `public/audio/`. Without it, a synthesized ambient drone plays.

---

## Architecture

```
src/
├── App.jsx                    ← Root: preloader → flash warning → scroll → login → wish wall
├── hooks/
│   ├── useScrollEra.js        ← GSAP ScrollTrigger: current era + scroll progress
│   └── useWishes.js           ← Supabase realtime subscription
├── lib/
│   └── supabase.js            ← DB client
└── components/
    ├── Preloader/             ← Cassette tape loading bar
    ├── ScrollJourney/         ← 700vh pinned 6-era scroll container
    ├── ThreeCanvas/           ← Shared R3F scene (all 6 era meshes)
    ├── Login/                 ← Concert ticket stub gate
    ├── WishForm/              ← 280-char guestbook form
    ├── WishWall/              ← 3D Polaroid canvas + physics
    └── AudioToggle/           ← Cassette player + Web Audio API
```

## Scroll Eras

| # | Colour | Billie Reference | 3D Asset |
|---|--------|-----------------|----------|
| 1 | Neon Green `#00FF41` | WWAFAWDWG | Glowing chain toruses |
| 2 | Ocean Blue `#1A3A6B` | Happier Than Ever | Vinyl disc + liquid spheres |
| 3 | Obsidian `#0A0A0A` | Hit Me Hard & Soft | Spiked icosahedron + barbed wire |
| 4 | Stark White `#F5F5F5` | Minimalist/Angelic | Torn paper planes + plaster sphere |
| 5 | Crimson `#C0152A` | Blush | Exploding particle scatter |
| 6 | Royal Purple `#4B0082` | Twilight Finale | Emissive torus portal ring |

## Accessibility

- All animations wrapped in `prefers-reduced-motion`
- Epilepsy/flash warning banner (dismissible, with disable toggle)
- Era 4 flash-bang hard cut is toggleable
- Mobile: 3D canvas hidden, CSS-only parallax fallback

---

*Built with love for Lola. Keep it chaotic. Keep it loud. 🖤*
