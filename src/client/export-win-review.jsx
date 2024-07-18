import './webpack-csp-nonce'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Routes, Route } from 'react-router-dom'
import Cookies from 'js-cookie'

import { createProvider } from './createProvider'
import WithoutOurSupport from './components/Resource/WithoutOurSupport'
import ExportWinReview from './components/Resource/ExportWinReview'
import Rating from './components/Resource/Rating'
import Experience from './components/Resource/Experience'
import MarketingSource from './components/Resource/MarketingSource'

import Review from './modules/ExportWins/Review'
import { patchExportWinReview } from './modules/ExportWins/tasks'

const COOKIE_CONSENT_COOKIE_NAME = 'cookie-consent'

const loadCookiePreference = () =>
  localStorage.getItem(COOKIE_CONSENT_COOKIE_NAME)

const saveCookiePreference = (payload) => {
  if (!['granted', 'denied'].includes(payload)) {
    throw Error('Payload must be "granted" or "denied"')
  }

  localStorage.setItem(COOKIE_CONSENT_COOKIE_NAME, payload)

  window.gtag('consent', 'update', {
    analytics_storage: payload,
  })

  if (payload === 'denied') {
    for (const cookieName in Cookies.get()) {
      Cookies.remove(cookieName)
    }
  }

  return payload
}

const Provider = createProvider({
  ...ExportWinReview.tasks,
  ...WithoutOurSupport.tasks,
  ...Rating.tasks,
  ...Experience.tasks,
  ...MarketingSource.tasks,
  TASK_PATCH_EXPORT_WIN_REVIEW: patchExportWinReview,
  'load cookie preference': loadCookiePreference,
  'save cookie preference': saveCookiePreference,
})

window.addEventListener('DOMContentLoaded', () => {
  createRoot(document.getElementById('react-app')).render(
    <Provider>
      <Routes>
        <Route path="/exportwins/review*" element={<Review />} />
      </Routes>
    </Provider>
  )
})
