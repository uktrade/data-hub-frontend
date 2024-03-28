/* eslint-disable prettier/prettier */
import React from 'react'
import ReactDOM from 'react-dom'
import { Route, Routes } from 'react-router-dom'

import DataHubProvider from './provider'
import WithoutOurSupport from './components/Resource/WithoutOurSupport'
import ExportWinReview from './components/Resource/ExportWinReview'
import Rating from './components/Resource/Rating'
import Experience from './components/Resource/Experience'
import MarketingSource from './components/Resource/MarketingSource'

import Review from './modules/ExportWins/Review'
import ThankYou from './modules/ExportWins/Review/ThankYou'
import { patchExportWinReview } from './modules/ExportWins/tasks'

window.addEventListener('DOMContentLoaded', () =>
  ReactDOM.render(
    <DataHubProvider
      tasks={{
        ...ExportWinReview.tasks,
        ...WithoutOurSupport.tasks,
        ...Rating.tasks,
        ...Experience.tasks,
        ...MarketingSource.tasks,
        TASK_PATCH_EXPORT_WIN_REVIEW: patchExportWinReview,
      }}
    >
      <Routes>
        <Route path="/exportwins/review/:token" element={<Review />} />
        <Route path="/exportwins/review-win/thankyou" element={<ThankYou />} />
      </Routes>
    </DataHubProvider>,
    document.getElementById('react-app')
  )
)
