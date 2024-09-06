import React from 'react'

import { DefaultLayout } from '../../components'
import TabNav from '../../components/TabNav'
import urls from '../../../lib/urls'
import EYBLeadsCollection from './EYBLeads/EYBLeadsCollection'
import ProjectsCollection from './Projects/ProjectsCollection'
import ProfilesCollection from './Profiles/ProfilesCollection'
import OpportunitiesCollection from './Opportunities/CollectionList/OpportunitiesCollection'

const PATH = /([^\/]+$)/

const pathToPageTitleMap = {
  projects: 'Projects',
  eybLeads: 'EYB Leads',
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
          [urls.investments.eybLeads.index()]: {
            label: 'EYBLeads',
            content: <EYBLeadsCollection {...props} />,
          },
          [urls.investments.profiles.index()]: {
            label: 'Investor profiles',
            content: <ProfilesCollection {...props} />,
          },
          [urls.investments.opportunities.index()]: {
            label: 'UK opportunities',
            content: <OpportunitiesCollection {...props} />,
          },
        }}
      />
    </DefaultLayout>
  )
}

export default InvestmentCollections
