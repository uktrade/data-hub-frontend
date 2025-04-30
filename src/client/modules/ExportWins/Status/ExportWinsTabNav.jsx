import React from 'react'
import { useLocation } from 'react-router-dom'
import { capitalize } from 'lodash'

import { DefaultLayout } from '../../../components'
import TabNav from '../../../components/TabNav'
import WinsRejectedList from './WinsRejectedList'
import WinsPendingList from './WinsPendingList'
import WinsConfirmedList from './WinsConfirmedList'
import urls from '../../../../lib/urls'

const LAST_WORD = /([^\/]+)$/

const ExportWinsTabNav = () => {
  const location = useLocation()
  const match = LAST_WORD.exec(location.pathname)
  const title = match?.[1] ?? ''

  return (
    <DefaultLayout
      heading="Export wins"
      pageTitle={`Export wins ${title}`}
      breadcrumbs={[
        { link: urls.dashboard.index(), text: 'Home' },
        {
          link: urls.companies.exportWins.index(),
          text: 'Export wins',
        },
        { text: capitalize(title) },
      ]}
    >
      <TabNav
        id="exportwins-tab-nav"
        label="Export wins tab nav"
        routed={true}
        tabs={{
          [urls.companies.exportWins.pending()]: {
            label: 'Pending',
            content: <WinsPendingList />,
          },
          [urls.companies.exportWins.confirmed()]: {
            label: 'Confirmed',
            content: <WinsConfirmedList />,
          },
          [urls.companies.exportWins.rejected()]: {
            label: 'Rejected',
            content: <WinsRejectedList />,
          },
        }}
      />
    </DefaultLayout>
  )
}

export default ExportWinsTabNav
