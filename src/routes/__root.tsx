import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import React from 'react'
import AdsInjector from '../components/AdsInjector'

export const Route = createRootRoute({  
  component: () => (
    <>
      <nav className="flex">
        <Link to="/" className="[&.active]" />
      </nav>
      <hr />
      {typeof window !== 'undefined' && window.location.pathname !== '/' ? <AdsInjector /> : null}
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})