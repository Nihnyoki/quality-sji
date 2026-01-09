# Copilot Instructions for quality-sji

## Project Overview
**quality-sji** (axsem) is a React+TypeScript portfolio/blogging application built with Vite, featuring portfolio showcase with 3D models, video content, quality philosophy blog posts, and CV. Uses Supabase for data persistence.

## Architecture

### Core Stack
- **Frontend**: React 19 + TypeScript, Vite for bundling
- **Routing**: TanStack React Router v1 (file-based routing in [src/router.tsx](src/router.tsx#L1))
- **Styling**: Tailwind CSS v4 with custom animations (slide-up) defined in [tailwind.config.js](tailwind.config.js)
- **Backend Services**: Supabase (PostgREST API), Express (optional), MongoDB/Mongoose
- **3D Graphics**: Three.js with CSS3DRenderer for interactive 3D scenes, GLTFLoader for `.glb` models
- **Animations**: Framer Motion for component animations with reduced-motion support
- **UI Components**: Radix UI primitives, shadcn-ui patterns

### Key Routes
Routes defined in [src/router.tsx](src/router.tsx):
- `/` → MainContainer (portfolio home with 3D scenes)
- `/quality/$id` → QualityPost (individual blog post)
- `/quality-philosophy` → QualityPhilosophy (philosophy overview)
- `/cv` → SandileCV (curriculum vitae)

### Data Flow
Three post types with similar interfaces in [src/data/](src/data/):
- **qualityPhilosophy.ts**: BlogPost[] (title, content: string[], authorImage, published date)
- **videoPosts.ts**: VideoPost[] (video content)
- **projectPosts.ts**: ProjectPost[] (portfolio projects with images)

Posts flow from data files → MainContainer/page components → SlideInPanel (overlay) via panelOpen state. No global state manager (React context available via TelemetryContext).

### Supabase Integration
- Client initialized in [src/services/supabaseClient.ts](src/services/supabaseClient.ts) using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` env vars
- Upload utility in [src/services/uploadToSupabase.ts](src/services/uploadToSupabase.ts)
- Image URL helper in [src/lib/utils.ts](src/lib/utils.ts#L7)

## Developer Workflows

### Setup & Development
```bash
npm install          # Installs deps + auto-builds (postinstall hook)
npm run dev          # Start Vite dev server (HMR enabled)
npm run build        # Production build to /dist
npm run lint         # ESLint check (includes unused-vars patterns)
npm start            # Serve dist via Node (used in deployment)
```

### Build & Deployment
- **Vite config** ([vite.config.js](vite.config.js)): React plugin, Tailwind CSS plugin, path alias `@` → `./src`, asset optimization
- **PostInstall**: Auto-runs `npm run build` on install (Heroku/deployment pattern)
- **Port**: `start` script uses `$PORT` env var (default Heroku port behavior)
- **Public assets** in [/public/](public/) (images, audio, docs) are included in builds

### Testing & Debugging
- React DevTools available: `npm run react-devtools`
- Router DevTools available (TanStack React Router DevTools in devDeps)
- Vite preview mode: `npm run preview`

## Project-Specific Conventions

### Component Patterns
- **Functional components with hooks**: React 19 features preferred
- **Animations**: Use Framer Motion's `useAnimationControls()` + `useReducedMotion()` for accessibility
- **3D Scenes**: Lazy-load Three.js in `useEffect` with cleanup (see MainContainer.tsx pattern at line 45+)
- **Panel Pattern**: SlideInPanel is overlay container for viewing post details; state managed via `panelOpen` + `panelContent`

### Type Definitions
- Interfaces co-located with data files (e.g., `ProjectPost` in [projectPosts.ts](src/data/projectPosts.ts#L1))
- Global types in [src/global.d.ts](src/global.d.ts) for ambient declarations
- CSS module types handled implicitly (no CSS modules, all Tailwind)

### CSS & Styling
- **Tailwind only**: No CSS-in-JS, no Styled Components
- **Custom fonts**: Poppins, Lobster, Pacifico, Merriweather (extended theme in tailwind.config.js)
- **Utility classes**: Use `cn()` helper ([src/lib/utils.ts](src/lib/utils.ts#L1)) for conditional class merging with clsx/tailwind-merge

### Environment Variables
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous public key
- Prefix `VITE_` required for client-side access in Vite

## Critical Integration Points

### Component Composition
- **MainContainer.tsx** (612+ lines): Central hub; loads all post types, manages 3D scenes, handles panel state transitions
- **SlideInPanel.tsx**: Modal/drawer overlay; receives `panelContent` prop
- **PostContent.tsx**: Renders individual post details (polymorphic for different post types)
- **TypingText.tsx**: Animated typing effect component

### External Dependencies to Know
- **@tanstack/react-router**: Latest v1 features; use `createRoute()` + `createRouter()`
- **three.js + CSS3DRenderer**: Custom loader pattern; avoid global THREE on window
- **framer-motion**: Controlled animations with `useAnimationControls()` preferred over variants alone
- **@supabase/supabase-js**: v2.89+ API; use async/await pattern
- **shadcn-ui**: Pre-built accessible components; installed but patterns shown in Radix UI imports

### Asset Pipeline
- GLB models loaded from `/public/images/*.glb` (Vite config includes glb in assetsInclude)
- Images lazy-loaded via dynamic imports in 3D scene setup
- Audio files in `/public/audio/` (feedback.aiff)
- SVGs/PNGs referenced directly in JSX (no require() needed with Vite)

## Common Tasks

### Adding a New Post Type
1. Create interface in `src/data/{newType}.ts` (match BlogPost/VideoPost/ProjectPost structure)
2. Add union to `PanelContent` type in MainContainer.tsx
3. Import and push to post arrays
4. Update `PostContent.tsx` to handle new type in render logic

### Modifying Styles
- Extend theme in [tailwind.config.js](tailwind.config.js) (fonts, keyframes, animations)
- Use `@apply` in CSS for complex utilities (if needed; prefer Tailwind classes)
- Check custom animations (e.g., `animate-slide-up`)

### 3D Model Updates
- Replace `.glb` files in `/public/images/`
- Models auto-load in MainContainer via GLTFLoader
- Ensure model names match loader paths

## Notes
- No package-lock.json strategy specified; npm workspaces not in use
- MongoDB/Mongoose in deps but not actively used (removed in migrations?)
- Express + Swagger setup present but primary app is React frontend
- PWA plugin available but not explicitly configured (vite-plugin-pwa in devDeps)
