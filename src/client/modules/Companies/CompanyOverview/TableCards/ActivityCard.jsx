import React from 'react'
import { Link } from 'govuk-react'
import PropTypes from 'prop-types'
import camelCase from 'camelcase'
import styled from 'styled-components'

import {
  ActivityFeedApp,
  ActivityFeedAction,
  SummaryTable,
} from '../../../../components'
import { companies } from '../../../../../lib/urls'
import {
  StyledLastTableCell,
  StyledTableCell,
  StyledTableRow,
} from './components'
import { FILTER_KEYS } from '../../../../../apps/companies/apps/activity-feed/constants'

const StyledSummaryTable = styled(SummaryTable)`
  margin: 0;
`

const ActivityStyledLink = styled(Link)`
  caption & {
    font-weight: 400;
    font-size: 16px;
  }
`

const activityActions = (companyId) => (
  <>
    <ActivityFeedAction
      text="Refer this company"
      link={companies.referrals.send(companyId)}
    />
    <ActivityFeedAction
      text="Add interaction"
      link={companies.interactions.create(companyId)}
    />
  </>
)

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
          <StyledTableCell colspan={2}>
            <ActivityFeedApp
              actions={!company.archived && activityActions(company.id)}
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
    </div>
  )
}

ActivityCard.propTypes = {
  company: PropTypes.object.isRequired,
}

export default ActivityCard
