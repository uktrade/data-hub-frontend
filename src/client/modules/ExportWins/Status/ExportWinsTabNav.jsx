import React from 'react'
import { useLocation } from 'react-router-dom'
import { capitalize } from 'lodash'
import { Link } from 'govuk-react'

import { DefaultLayout } from '../../../components'
import TabNav from '../../../components/TabNav'
import WinsRejectedList from './WinsRejectedList'
import WinsPendingList from './WinsPendingList'
import WinsConfirmedList from './WinsConfirmedList'
import urls from '../../../../lib/urls'
import { HISTORIC_WINS_ALERT_MESSAGE } from './constants'

const LAST_WORD = /([^\/]+)$/

export const HistoricWinsAlertBanner = (
  <>
    {[HISTORIC_WINS_ALERT_MESSAGE.ELEMENT].concat(' ')}
    {[
      <Link
        href={HISTORIC_WINS_ALERT_MESSAGE.URI_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Find out more about historic wins moved to Data Hub"
      >
        {HISTORIC_WINS_ALERT_MESSAGE.URI_ELEMENT}
      </Link>,
    ].concat('.')}
  </>
)

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
          text: 'Export Wins',
        },
        { text: capitalize(title) },
      ]}
      flashMessages={[[HistoricWinsAlertBanner]]}
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
