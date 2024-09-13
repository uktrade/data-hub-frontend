import './webpack-csp-nonce.js'
import React from 'react'
import { createRoot } from 'react-dom/client'

import * as Sentry from '@sentry/browser'
import * as ReactSentry from '@sentry/react'

import { App } from './DataHub/App.jsx'

function parseProps(domNode) {
  return 'props' in domNode.dataset ? JSON.parse(domNode.dataset.props) : {}
}

const appWrapper = document.getElementById('react-app')
const globalProps = parseProps(appWrapper)

if (globalProps.sentryDsn) {
  Sentry.init({
    dsn: globalProps.sentryDsn,
    environment: globalProps.sentryEnvironment,
  })
  ReactSentry.init({
    dsn: globalProps.sentryDsn,
    environment: globalProps.sentryEnvironment,
    autoSessionTracking: false,
    integrations: [
      Sentry.browserTracingIntegration({
        tracingOrigins: [
          'www.datahub.uktrade.io',
          'www.datahub.dev.uktrade.io',
          'www.datahub.staging.uktrade.io',
          'www.datahub.uat.uktrade.io',
          '*',
        ],
      }),
    ],
    tracesSampleRate: 0.01,
  })
}

window.__root__ ??= createRoot(appWrapper)
window.__root__.render(<App />)
