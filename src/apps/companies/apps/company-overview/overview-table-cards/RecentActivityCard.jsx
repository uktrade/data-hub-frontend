import React from 'react'
import { Link, Table } from 'govuk-react'
import PropTypes from 'prop-types'
import { SummaryTable } from '../../../../../client/components'
// import { fetchAllActivityFeedEvents } from '../../activity-feed/controllers'
import { ActivityFeedApp } from '../../../../../client/components'
import urls from '../../../../../lib/urls'

import CompanyActivityFeed from '../../activity-feed/client/CompanyActivityFeed'

const { FILTER_ITEMS, FILTER_KEYS } = require('../../activity-feed/constants')

const BusinessDetailsCard = (props) => {
  const { company, queryString } = props

  return (
    <>
      <SummaryTable
        caption={
          <>
            Recent activities
            <Link href={`${queryString}/interactions/create`}>
              Add interaction
            </Link>
          </>
        }
        data-test="recentInteractionsContainer"
      >
        <Table.Cell colspan={2}>
          <ActivityFeedApp
            actions={!company.archived && CompanyActivityFeed.actions}
            activityTypeFilter={FILTER_KEYS.dataHubActivity}
            activityTypeFilters={FILTER_ITEMS}
            isGlobalUltimate={company.is_global_ultimate}
            dnbHierarchyCount={3}
            // dnbHierarchyCount={dnbHierarchyCount}
            apiEndpoint={urls.companies.activity.data(company.id)}
            companyIsArchived={company.archived}
          />
        </Table.Cell>
        <Table.Row>
          <Table.Cell colSpan={2}>
            <Link href={`${queryString}/activity`}>View all activities</Link>
          </Table.Cell>
        </Table.Row>
      </SummaryTable>
    </>
  )
}

BusinessDetailsCard.propTypes = {
  company: PropTypes.object.isRequired,
}

export default BusinessDetailsCard
