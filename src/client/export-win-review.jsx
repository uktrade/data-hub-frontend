import './webpack-csp-nonce'
import React from 'react'
import ReactDOM from 'react-dom'

import { createProvider } from './createProvider'
import WithoutOurSupport from './components/Resource/WithoutOurSupport'
import ExportWinReview from './components/Resource/ExportWinReview'
import Rating from './components/Resource/Rating'
import Experience from './components/Resource/Experience'
import MarketingSource from './components/Resource/MarketingSource'

import Review from './modules/ExportWins/Review'
import { patchExportWinReview } from './modules/ExportWins/tasks'

const Provider = createProvider({
  ...ExportWinReview.tasks,
  ...WithoutOurSupport.tasks,
  ...Rating.tasks,
  ...Experience.tasks,
  ...MarketingSource.tasks,
  TASK_PATCH_EXPORT_WIN_REVIEW: patchExportWinReview,
})

window.addEventListener('DOMContentLoaded', () =>
  ReactDOM.render(
    <Provider>
      <Review />
    </Provider>,
    document.getElementById('react-app')
  )
)
