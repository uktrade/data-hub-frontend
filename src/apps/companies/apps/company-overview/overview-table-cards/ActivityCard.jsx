import React from 'react'
import { Link, Table } from 'govuk-react'
import PropTypes from 'prop-types'
import { ActivityFeedApp, SummaryTable } from '../../../../../client/components'
import urls from '../../../../../lib/urls'
import camelCase from 'camelcase'
import CompanyActivityFeed from '../../activity-feed/client/CompanyActivityFeed'
import styled from 'styled-components'

const { FILTER_ITEMS, FILTER_KEYS } = require('../../activity-feed/constants')

const StyledSummaryTable = styled(SummaryTable)`
  margin: 0;
`
const StyledTableRow = styled(Table.Row)`
  border: 0;
`
const StyledLastTableCell = styled(Table.Cell)`
  border: 0;
  padding: 0;
`
const ActivityStyledLink = styled(Link)`
  caption & {
    font-weight: 400;
    font-size: 16px;
  }
`

const ActivityCard = (props) => {
  const { company, queryString, numberOfItems, feedType } = props

  const feedTypeText = camelCase(feedType, { pascalCase: true })

  return (
    <div>
      <StyledSummaryTable
        caption={
          <>
            {feedTypeText} activity
            <ActivityStyledLink href={`${queryString}/interactions/create`}>
              Add interaction
            </ActivityStyledLink>
          </>
        }
        data-test={`${feedTypeText} activityCardContainer`}
      >
        <StyledTableRow>
          <StyledLastTableCell colspan={2}>
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
          </StyledLastTableCell>
        </StyledTableRow>
        <StyledTableRow>
          <StyledLastTableCell colSpan={2}>
            <Link
              href={`${queryString}/activity`}
              data-test={'activity-page-link'}
            >
              View all activities
            </Link>
          </StyledLastTableCell>
        </StyledTableRow>
      </StyledSummaryTable>
    </div>
  )
}

ActivityCard.propTypes = {
  company: PropTypes.object.isRequired,
}

export default ActivityCard
