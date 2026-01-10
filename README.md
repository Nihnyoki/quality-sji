# sandiles-profile-and-blog (quality-sji)

React + TypeScript portfolio/blog built with Vite and TanStack Router.

The homepage is a Three.js scene with floating 3D objects that open posts in a slide-in panel. Two stationary 3D navigators link to the blog index and portfolio page.

## Features

- **3D homepage**: Three.js + GLTF models, click-to-open posts, stationary nav GLBs.
- **Quality Philosophy blog**: posts live in `src/data/qualityPhilosophy.ts`.
- **Portfolio (/cv)**: QA Test Lead / Automation Architect portfolio page + downloadable CV.
- **Comments**: Google Sign-In + Firestore-backed comments in the post panel.
- **Analytics**: Google Analytics (gtag) + SPA route-change pageviews.
- **Mobile-friendly**: responsive bottom dock, panel, and 3D nav positions.

## Tech Stack

- React 19 + TypeScript
- Vite
- TanStack React Router (SPA routing)
- Tailwind CSS
- Three.js (GLTFLoader, CSS3DRenderer)
- Firebase (Auth + Firestore)
- Supabase (storage upload helper)

## Getting Started

### Install

```bash
npm install
```

Note: `postinstall` runs a build automatically.

### Development

```bash
npm run dev
```

### Production build

```bash
npm run build
```

### Preview production build locally

```bash
npm run preview
```

## Environment Variables

Copy `.env.example` to `.env` and fill in values.

### Firebase (required for comments)

The app will throw on startup if these are missing:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Firebase config is loaded in `src/services/firebaseClient.ts`.

### Supabase (optional)

Only needed if you use the upload helper in `src/services/uploadToSupabase.ts`:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Content & 3D Configuration

### Add a new blog post

Add an entry to `src/data/qualityPhilosophy.ts`.

Optional fields for 3D placement:

- `position?: [x, y, z]`
- `rotationDeg?: [pitch, yaw, roll]` (degrees)

### Static navigation GLBs

Configured in `src/components/MainContainer.tsx` under `staticGlbObjects`.

- `blogs.glb` navigates to `/quality-philosophy`
- `Sandile.glb` navigates to `/cv` and floats in on load

Mobile uses `mobilePosition` so the objects stay inside the camera view.

## Downloadable CV

The downloadable CV is served from:

- `public/doc/cv_latest.pdf`

## Google Analytics

GA is installed globally via:

- `index.html` (gtag snippet)
- `src/components/AnalyticsListener.tsx` (SPA navigation tracking)

Tracking ID: `G-TY211RGRND`.

## Deployment

### Railway

This repo includes `railway.json`.

- Build: Nixpacks
- Start command: `npm start` (serves `dist/`)

Set required env vars in Railway Variables.
