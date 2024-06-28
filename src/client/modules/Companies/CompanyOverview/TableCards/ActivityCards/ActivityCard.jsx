import React, { Fragment } from 'react'
import { Link } from 'govuk-react'
import { SPACING } from '@govuk-react/constants'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { CollectionList, SummaryTable } from '../../../../../components'
import { companies } from '../../../../../../lib/urls'
import {
  StyledLastTableCell,
  StyledTableCell,
  StyledTableRow,
} from '../components'
import Task from '../../../../../components/Task'
import { TASK_GET_COMPANY_OVERVIEW_ACTIVITY } from './state'
import { TitleRenderer } from '../../../../Events/CollectionList'
import {
  StyledBadgesWrapper,
  renderTags,
} from '../../../../../components/CollectionList/CollectionItem'
import { GREY_2 } from '../../../../../utils/colours'

const StyledSummaryTable = styled(SummaryTable)`
  margin: 0;
`

const ActivityStyledLink = styled(Link)`
  caption & {
    font-weight: 400;
    font-size: 16px;
  }
`

const Row = styled('div')`
  display: flex;
`

const LeftCol = styled('div')`
  flex: 75%;
`

const RightCol = styled('div')`
  flex: 25%;
`

const StyledWrapper = styled('div')`
  border-bottom: 1px solid ${GREY_2};
  padding-top: ${SPACING.SCALE_2};
  padding-bottom: ${SPACING.SCALE_2};
`

const basePayload = (limit, companyId) => ({
  limit,
  company: companyId,
})

const ItemTemplate = (item) => (
  <StyledWrapper data-test="activity-card-wrapper">
    <Row>
      <LeftCol>{item.date}</LeftCol>
      <RightCol>
        <StyledBadgesWrapper data-test="collection-item-tags">
          {renderTags(item.tags)}
        </StyledBadgesWrapper>
      </RightCol>
    </Row>
    <Row data-test="activity-subject">
      {TitleRenderer(item.headingText, item.headingUrl)}
    </Row>
    <Row data-test="activity-summary">{item.summary}</Row>
  </StyledWrapper>
)

const capitaliseFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1)

const ActivityCard = ({
  company,
  numberOfItems,
  feedType,
  results,
  stateId,
  additionalPayload,
  action,
}) => (
  <StyledSummaryTable
    caption={
      <Fragment key={company.id}>
        {capitaliseFirstLetter(feedType)} activity
        <ActivityStyledLink href={companies.interactions.create(company.id)}>
          Add interaction
        </ActivityStyledLink>
      </Fragment>
    }
    data-test={`${feedType}-activity-card-container`}
  >
    <StyledTableRow>
      <StyledTableCell colspan={2}>
        <Task.Status
          name={TASK_GET_COMPANY_OVERVIEW_ACTIVITY}
          id={stateId}
          progressMessage="Loading recent activities"
          startOnRender={{
            payload: {
              ...basePayload(numberOfItems, company.id),
              ...additionalPayload,
            },
            onSuccessDispatch: action,
          }}
        >
          {() =>
            results && results.length > 0 ? (
              <CollectionList
                items={results}
                collectionItemTemplate={ItemTemplate}
              />
            ) : (
              <StyledWrapper>{`There are no ${feedType} activities to show.`}</StyledWrapper>
            )
          }
        </Task.Status>
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

ActivityCard.propTypes = {
  company: PropTypes.object.isRequired,
  additionalPayload: PropTypes.object.isRequired,
  numberOfItems: PropTypes.number.isRequired,
  feedType: PropTypes.string.isRequired,
  stateId: PropTypes.string.isRequired,
  additionalPayload: PropTypes.object.isRequired,
  action: PropTypes.string.isRequired,
}

export default ActivityCard
