import React from 'react'
import { Link } from 'govuk-react'
import PropTypes from 'prop-types'
import camelCase from 'camelcase'
import styled from 'styled-components'

import { ActivityFeedApp, SummaryTable } from '../../../../../client/components'
import { companies } from '../../../../../lib/urls'
import CompanyActivityFeed from '../../activity-feed/client/CompanyActivityFeed'
import { StyledLastTableCell, StyledTableRow } from './components'

const StyledSummaryTable = styled(SummaryTable)`
  margin: 0;
`

const ActivityStyledLink = styled(Link)`
  caption & {
    font-weight: 400;
    font-size: 16px;
  }
`

const ActivityCard = (props) => {
  const { company, numberOfItems, feedType } = props

  const feedTypeText = camelCase(feedType, { pascalCase: true })

  return (
    <div>
      <StyledSummaryTable
        caption={
          <>
            {feedTypeText} activity
            <ActivityStyledLink
              href={companies.interactions.create(company.id)}
            >
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
              isGlobalUltimate={company.isGlobalUltimate}
              dnbHierarchyCount={0}
              apiEndpoint={companies.activity.data(company.id)}
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
              href={companies.activity.index(company.id)}
              data-test="activity-page-link"
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
