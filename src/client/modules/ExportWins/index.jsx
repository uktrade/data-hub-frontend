import React from 'react'
import { capitalize } from 'lodash'

import { DefaultLayout } from '../../components'
import TabNav from '../../components/TabNav'
import Unconfirmed from './Unconfirmed'
import Confirmed from './Confirmed'
import urls from '../../../lib/urls'

const TITLE = /([^\/]+$)/

const ExportWins = ({ location }) => {
  const title = TITLE.exec(location.pathname)[0]
  return (
    <DefaultLayout
      heading="Export wins"
      pageTitle={`Export wins ${title}`}
      breadcrumbs={[
        { link: urls.dashboard.index(), text: 'Home' },
        { text: capitalize(title) },
      ]}
    >
      <TabNav
        id="exportwins-tab-nav"
        label="Export wins tab nav"
        routed={true}
        tabs={{
          [urls.companies.exportWins.unconfirmed()]: {
            label: 'Unconfirmed',
            content: <Unconfirmed />,
          },
          [urls.companies.exportWins.confirmed()]: {
            label: 'Confirmed',
            content: <Confirmed />,
          },
        }}
      />
    </DefaultLayout>
  )
}

export default ExportWins
