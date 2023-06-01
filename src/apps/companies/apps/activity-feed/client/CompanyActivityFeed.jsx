import React from 'react'
import PropTypes from 'prop-types'

import {
  ActivityFeedApp,
  ActivityFeedAction,
} from '../../../../../client/components'
import urls from '../../../../../lib/urls'
import { CompanyResource } from '../../../../../client/components/Resource'
import CompanyLayout from '../../../../../client/components/Layout/CompanyLayout'

const CompanyActivityFeed = ({
  companyId,
  activityTypeFilter,
  isGlobalUltimate,
  dnbHierarchyCount,
  apiEndpoint,
  dnbRelatedCompaniesCount,
  localNavItems,
  flashMessages,
}) => {
  const actions = (
    <>
      <ActivityFeedAction
        text="Refer this company"
        link={urls.companies.referrals.send(companyId)}
      />
      <ActivityFeedAction
        text="Add interaction"
        link={urls.companies.interactions.create(companyId)}
      />
    </>
  )

  return (
    <CompanyResource id={companyId}>
      {(company) => (
        <CompanyLayout
          company={company}
          breadcrumbs={[
            { link: urls.dashboard(), text: 'Home' },
            {
              link: urls.companies.index(),
              text: 'Companies',
            },
            { link: urls.companies.detail(company.id), text: company.name },
            { text: 'Activity Feed' },
          ]}
          dnbRelatedCompaniesCount={dnbRelatedCompaniesCount}
          localNavItems={localNavItems}
          flashMessages={flashMessages}
        >
          <ActivityFeedApp
            actions={!company.archived && actions}
            activityTypeFilter={activityTypeFilter}
            isGlobalUltimate={isGlobalUltimate}
            dnbHierarchyCount={dnbHierarchyCount}
            apiEndpoint={apiEndpoint}
            companyIsArchived={company.archived}
          />
        </CompanyLayout>
      )}
    </CompanyResource>
  )
}

CompanyActivityFeed.propTypes = {
  companyId: PropTypes.string,
  actions: PropTypes.node,
  activityTypeFilter: [PropTypes.string],
  apiEndpoint: PropTypes.string.isRequired,
  dnbHierarchyCount: PropTypes.number,
}

CompanyActivityFeed.defaultProps = {
  companyId: null,
  activityTypeFilter: [],
  actions: null,
  dnbHierarchyCount: null,
}

export default CompanyActivityFeed
