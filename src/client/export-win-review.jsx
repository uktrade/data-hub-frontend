/* eslint-disable prettier/prettier */
import React from 'react'
import ReactDOM from 'react-dom'
import { Route, Switch } from 'react-router-dom/cjs/react-router-dom'

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
      <Switch>
        <Route exact={true} path="/exportwins/review/:token">
          {({match}) =>
            <Review token={match.params.token}/>
          }
        </Route>
        <Route exact={true} path="/exportwins/review-win/thankyou" component={ThankYou}/>
      </Switch>
    </DataHubProvider>,
    document.getElementById('react-app'),
  )
)
