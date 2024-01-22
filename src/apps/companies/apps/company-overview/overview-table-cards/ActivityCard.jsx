import React, { Fragment } from 'react'
import { Link } from 'govuk-react'
import PropTypes from 'prop-types'
import camelCase from 'camelcase'
import styled from 'styled-components'

import { ActivityFeedApp, SummaryTable } from '../../../../../client/components'
import { companies } from '../../../../../lib/urls'
import CompanyActivityFeed from '../../activity-feed/client/CompanyActivityFeed'
import {
  StyledLastTableCell,
  StyledTableCell,
  StyledTableRow,
} from './components'
import { FILTER_KEYS } from '../../activity-feed/constants'

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
    <StyledSummaryTable
      caption={
        <Fragment key={company.id}>
          {feedTypeText} activity
          <ActivityStyledLink href={companies.interactions.create(company.id)}>
            Add interaction
          </ActivityStyledLink>
        </Fragment>
      }
      data-test={`${feedTypeText} activityCardContainer`}
    >
      <StyledTableRow>
        <StyledTableCell colspan={2}>
          <ActivityFeedApp
            actions={!company.archived && CompanyActivityFeed.actions}
            isGlobalUltimate={company.isGlobalUltimate}
            dnbHierarchyCount={0}
            apiEndpoint={companies.activity.data(company.id)}
            companyIsArchived={company.archived}
            isOverview={true}
            numberOfItems={numberOfItems}
            feedType={feedType}
            activityType={[FILTER_KEYS.dataHubActivity]}
          />
        </StyledTableCell>
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
  )
}

ActivityCard.propTypes = {
  company: PropTypes.object.isRequired,
}

export default ActivityCard
