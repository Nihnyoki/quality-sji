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

import About from './pages/About'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Contact from './pages/Contact'

import SandileCV from './pages/SandileCV';
import AnalyticsListener from './components/AnalyticsListener';
import ConsentBanner from './components/ConsentBanner';
/* ---------------- Root ---------------- */

const rootRoute = createRootRoute({
  component: () => (
    <>
      <AnalyticsListener />
      <ConsentBanner />
      <Outlet />
    </>
  ),
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

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: About,
})

const privacyPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy-policy',
  component: PrivacyPolicy,
})

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: Contact,
})

/* ---------------- Tree ---------------- */

const routeTree = rootRoute.addChildren([
  qualityRoute,
  qualityPhilosophyRoute,
  qualityPostRoute,
  sandileCVRoute,
  aboutRoute,
  privacyPolicyRoute,
  contactRoute,
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
