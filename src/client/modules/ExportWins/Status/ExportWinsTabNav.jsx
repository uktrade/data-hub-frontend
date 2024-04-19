import React from 'react'
import { capitalize } from 'lodash'

import { DefaultLayout } from '../../../components'
import TabNav from '../../../components/TabNav'
import WinsRejectedList from './WinsRejectedList'
import WinsPendingList from './WinsPendingList'
import WinsWonTable from './WinsWonTable'
import urls from '../../../../lib/urls'

const TITLE = /([^\/]+$)/

const ExportWinsTabNav = ({ location }) => {
  const title = TITLE.exec(location.pathname)[0]
  return (
    <DefaultLayout
      heading="Export wins"
      pageTitle={`Export wins ${title}`}
      breadcrumbs={[
        { link: urls.dashboard.index(), text: 'Home' },
        {
          link: urls.companies.exportWins.index(),
          text: 'Export Wins',
        },
        { text: capitalize(title) },
      ]}
    >
      <TabNav
        id="exportwins-tab-nav"
        label="Export wins tab nav"
        routed={true}
        tabs={{
          [urls.companies.exportWins.rejected()]: {
            label: 'Rejected',
            content: <WinsRejectedList />,
          },
          [urls.companies.exportWins.pending()]: {
            label: 'Pending',
            content: <WinsPendingList />,
          },
          [urls.companies.exportWins.won()]: {
            label: 'Won',
            content: <WinsWonTable />,
          },
        }}
      />
    </DefaultLayout>
  )
}

export default ExportWinsTabNav
