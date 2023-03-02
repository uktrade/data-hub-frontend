import React from 'react'
import { Link, Table } from 'govuk-react'
import PropTypes from 'prop-types'
import { SummaryTable } from '../../../../../client/components'
// import { fetchAllActivityFeedEvents } from '../../activity-feed/controllers'
import { ActivityFeedApp } from '../../../../../client/components'
import urls from '../../../../../lib/urls'

import CompanyActivityFeed from '../../activity-feed/client/CompanyActivityFeed'
import styled from 'styled-components'

const { FILTER_ITEMS, FILTER_KEYS } = require('../../activity-feed/constants')

const StyledSummaryTable = styled(SummaryTable)`
  margin: 0;
`

const ActivityCard = (props) => {
  const { company, queryString, numberOfItems, feedType } = props

  return (
    <div>
      <StyledSummaryTable
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
            dnbHierarchyCount={0}
            apiEndpoint={urls.companies.activity.data(company.id)}
            companyIsArchived={company.archived}
            isOverview={true}
            numberOfItems={numberOfItems}
            feedType={feedType}
          />
        </Table.Cell>
        <Table.Row>
          <Table.Cell colSpan={2}>
            <Link href={`${queryString}/activity`}>View all activities</Link>
          </Table.Cell>
        </Table.Row>
      </StyledSummaryTable>
    </div>
  )
}

ActivityCard.propTypes = {
  company: PropTypes.object.isRequired,
}

export default ActivityCard
