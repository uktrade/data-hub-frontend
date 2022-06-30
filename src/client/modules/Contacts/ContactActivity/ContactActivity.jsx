import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'
import { GridRow, GridCol } from 'govuk-react'
import { typography } from '@govuk-react/lib'

import { TASK_GET_CONTACT_ACTIVITIES, ID, state2props } from './state'
import { CONTACTS__ACTIVITIES_LOADED } from '../../../actions'
import Task from '../../../components/Task'
import Activity from '../../../components/ActivityFeed/Activity'
import {
  CollectionHeader,
  CollectionSort,
  RoutedPagination,
} from '../../../components'
import { ACTIVITIES_PER_PAGE } from '../../../../apps/contacts/constants'
import {
  CONTACT_ACTIVITY_FEATURE_FLAG,
  CONTACT_ACTIVITY_SORT_SELECT_OPTIONS,
} from '../../../../apps/companies/apps/activity-feed/constants'
import CheckUserFeatureFlag from '../../../components/CheckUserFeatureFlags'
import ActivityList from '../../../components/ActivityFeed/activities/card/ActivityList'

const StyledSectionHeader = styled('div')`
  ${typography.font({ size: 24, weight: 'bold' })};
  margin-bottom: ${SPACING.SCALE_4};
`

const ContactActivity = ({
  contactId,
  activities,
  total,
  page = 1,
  selectedSortBy,
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
            payload: { contactId, page, selectedSortBy },
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
                <CollectionSort
                  sortOptions={CONTACT_ACTIVITY_SORT_SELECT_OPTIONS}
                  totalPages={totalPages}
                />
                <CheckUserFeatureFlag
                  userFeatureFlagName={CONTACT_ACTIVITY_FEATURE_FLAG}
                >
                  {(isContactActivitiesFeatureOn) => (
                    <ActivityList>
                      {activities.map((activity, index) => (
                        <li key={`activity-${index}`}>
                          <Activity
                            activity={activity}
                            isContactActivitiesFeatureOn={
                              isContactActivitiesFeatureOn
                            }
                          />
                        </li>
                      ))}
                    </ActivityList>
                  )}
                </CheckUserFeatureFlag>
                <RoutedPagination initialPage={page} items={total} />
              </>
            )
          }
        </Task.Status>
      </GridCol>
    </GridRow>
  )
}

export default connect(state2props)(ContactActivity)
