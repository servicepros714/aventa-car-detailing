import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import App from './App.jsx'

export { ROUTES, pageMeta, headTags } from './lib/seo.js'
export { SITE_URL } from './lib/siteConfig.js'

// Build-time only: renders a route to HTML for scripts/prerender.js.
export function render(url) {
  return renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </React.StrictMode>
  )
}
