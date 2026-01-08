import React from 'react'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'

import { TelemetryProvider } from './lib/TelemetryContext'
import { router } from './router'

import './index.css'
import 'leaflet/dist/leaflet.css'

// sanity check for prop-types resolution
import * as PropTypes from 'prop-types'
console.log(PropTypes.string) // should NOT be undefined

const rootElement = document.getElementById('root')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)

  root.render(
    <StrictMode>
      <TelemetryProvider>
        <RouterProvider router={router} />
      </TelemetryProvider>
    </StrictMode>,
  )
}
