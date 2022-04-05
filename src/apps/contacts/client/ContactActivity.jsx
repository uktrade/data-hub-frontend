import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'
import { GREY_1 } from 'govuk-colours'
import { GridRow, GridCol } from 'govuk-react'
import { typography } from '@govuk-react/lib'

import { TASK_GET_CONTACT_ACTIVITIES, ID, state2props } from './state'
import {
  CONTACTS__ACTIVITIES_LOADED,
  CONTACTS__ACTIVITIES_PAGINATION_CLICKED,
} from '../../../client/actions'
import Task from '../../../client/components/Task'
import Activity from '../../../client/components/ActivityFeed/Activity'
import {
  CollectionHeader,
  CollectionHeaderRow,
  Pagination,
} from '../../../client/components'
import { ACTIVITIES_PER_PAGE } from '../constants'

const ContactActivityList = styled('ol')`
  list-style-type: none;
  padding: 0;
  margin-top: ${SPACING.SCALE_2};

  & > li {
    margin-bottom: ${SPACING.SCALE_2};
  }
`

const StyledSpan = styled('span')`
  color: ${GREY_1};
`

const StyledSectionHeader = styled('div')`
  ${typography.font({ size: 24, weight: 'bold' })};
  margin-bottom: ${SPACING.SCALE_4};
`

const ContactActivity = ({
  contactId,
  activities,
  total,
  onPaginationClick,
  page = 1,
}) => {
  const totalPages = Math.ceil(total / ACTIVITIES_PER_PAGE)

  return (
    <GridRow>
      <GridCol setWidth="full">
        <StyledSectionHeader>Contact activity</StyledSectionHeader>

        <p>
          An activity could include a meeting, call, email, event or other
          interactions where you have been in touch with a contact or provided a
          service.
        </p>
        <Task.Status
          name={TASK_GET_CONTACT_ACTIVITIES}
          id={ID}
          progressMessage="Loading contact activities"
          startOnRender={{
            payload: { contactId, page },
            onSuccessDispatch: CONTACTS__ACTIVITIES_LOADED,
          }}
        >
          {() =>
            activities && (
              <>
                <CollectionHeader
                  totalItems={total}
                  collectionName="activity"
                  data-test="collection-header"
                />
                <CollectionHeaderRow primary={false}>
                  {total ? (
                    <StyledSpan data-test="pagination-summary">
                      Page {page} of {totalPages}
                    </StyledSpan>
                  ) : null}
                </CollectionHeaderRow>
                <ContactActivityList>
                  {activities.map((activity, index) => (
                    <li key={`activity-${index}`}>
                      <Activity activity={activity} />
                    </li>
                  ))}
                </ContactActivityList>
                <Pagination
                  totalPages={totalPages}
                  activePage={page}
                  onPageClick={onPaginationClick}
                />
              </>
            )
          }
        </Task.Status>
      </GridCol>
    </GridRow>
  )
}

export default connect(state2props, (dispatch) => ({
  onPaginationClick: (page) =>
    dispatch({ type: CONTACTS__ACTIVITIES_PAGINATION_CLICKED, page }),
}))(ContactActivity)
