import React from 'react'
import { Routes, Route } from 'react-router-dom'

import { createProvider } from '../createProvider'
import WithoutOurSupport from '../components/Resource/WithoutOurSupport'
import ExportWinReview from '../components/Resource/ExportWinReview'
import Rating from '../components/Resource/Rating'
import Experience from '../components/Resource/Experience'
import MarketingSource from '../components/Resource/MarketingSource'

import { Review } from '../modules/ExportWins/Review'
import {
  patchExportWinReview,
  loadCookiePreference,
  saveCookiePreference,
} from '../modules/ExportWins/Review/CookiePage/tasks'

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

export const App = () => (
  <Provider>
    <Routes>
      <Route path="/exportwins/review/*" element={<Review />} />
    </Routes>
  </Provider>
)
