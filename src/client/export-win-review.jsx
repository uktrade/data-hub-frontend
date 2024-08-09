import './webpack-csp-nonce'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Routes, Route } from 'react-router-dom'

import { createProvider } from './createProvider'
import WithoutOurSupport from './components/Resource/WithoutOurSupport'
import ExportWinReview from './components/Resource/ExportWinReview'
import Rating from './components/Resource/Rating'
import Experience from './components/Resource/Experience'
import MarketingSource from './components/Resource/MarketingSource'

import Review from './modules/ExportWins/Review'
import { patchExportWinReview } from './modules/ExportWins/tasks'
import {
  loadCookiePreference,
  saveCookiePreference,
} from './modules/ExportWins/Review/CookiePage/tasks'

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
