import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router'

import MainContainer from './components/MainContainer'
import QualityPhilosophy from './pages/QualityPhilosophy'
import QualityPost from './pages/QualityPost'

import SandileCV from './pages/SandileCV';
/* ---------------- Root ---------------- */

const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

/* ---------------- Routes ---------------- */

const sandileCVRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cv',
  component: SandileCV,
});
// /quality
const qualityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: MainContainer,
})

// /quality-philosophy
const qualityPhilosophyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quality-philosophy',
  component: QualityPhilosophy,
})

// /quality/:id
const qualityPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quality/$id',
  component: QualityPost,
})

/* ---------------- Tree ---------------- */

const routeTree = rootRoute.addChildren([
  qualityRoute,
  qualityPhilosophyRoute,
  qualityPostRoute,
  sandileCVRoute,
])

export const router = createRouter({
  routeTree,
})

/* ---------------- TS inference ---------------- */

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
