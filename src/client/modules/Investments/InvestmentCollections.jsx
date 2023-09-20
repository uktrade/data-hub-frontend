import React from 'react'

import { DefaultLayout } from '../../components'
import TabNav from '../../components/TabNav'
import urls from '../../../lib/urls'
import ProjectsCollection from '../../../apps/investments/client/projects/ProjectsCollection'
import LargeCapitalProfileCollection from '../../../apps/investments/client/profiles/LargeCapitalProfileCollection'
import UnfilteredLargeCapitalOpportunityCollection from '../../../apps/investments/client/opportunities/List/UnfilteredLargeCapitalOpportunityCollection'

const PATH = /([^\/]+$)/

const pathToPageTitleMap = {
  projects: 'Projects',
  profiles: 'Profiles',
  opportunities: 'UK opportunities',
}

const InvestmentCollections = ({ ...props }) => {
  const path = PATH.exec(location.pathname)[0]
  const pageTitle = pathToPageTitleMap[path]
  return (
    <DefaultLayout
      heading={pageTitle}
      pageTitle={`${pageTitle} - Investments`}
      breadcrumbs={[
        { link: urls.dashboard.index(), text: 'Home' },
        {
          link: urls.investments.index(),
          text: 'Investments',
        },
        { text: pageTitle },
      ]}
    >
      <TabNav
        id="investment-tab-nav"
        label="Investment tab nav"
        routed={true}
        tabs={{
          [urls.investments.projects.index()]: {
            label: 'Projects',
            content: <ProjectsCollection {...props} />,
          },
          [urls.investments.profiles.index()]: {
            label: 'Investor profiles',
            content: <LargeCapitalProfileCollection {...props} />,
          },
          [urls.investments.opportunities.index()]: {
            label: 'UK opportunities',
            content: <UnfilteredLargeCapitalOpportunityCollection {...props} />,
          },
        }}
      />
    </DefaultLayout>
  )
}

export default InvestmentCollections
