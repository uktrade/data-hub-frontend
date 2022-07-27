import React from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import urls from '../../../../lib/urls'
import {
  CollectionSort,
  CollectionHeader,
  DefaultLayout,
  LocalNav,
  LocalNavLink,
} from '../../../components'
import CheckUserFeatureFlag from '../../../components/CheckUserFeatureFlags'
import { EVENT_ACTIVITY_FEATURE_FLAG } from '../../../../apps/companies/apps/activity-feed/constants'
import { GridCol, GridRow } from 'govuk-react'
import Task from '../../../components/Task'
import { ID, state2props, TASK_GET_EVENT_AVENTRI_ATTENDEES } from './state'
import { EVENTS__AVENTRI_ATTENDEES_LOADED } from '../../../actions'
import Activity from '../../../components/ActivityFeed/Activity'
import ActivityList from '../../../components/ActivityFeed/activities/card/ActivityList'

const EventAventriAttendees = ({
  aventriAttendees,
  aventriEventData,
  selectedSortBy,
  totalAttendees,
}) => {
  const { aventriEventId } = useParams()
  const eventName = aventriEventData?.object.name
  const breadcrumbs = [
    {
      link: urls.dashboard(),
      text: 'Home',
    },
    {
      link: urls.events.index(),
      text: 'Events',
    },
    {
      text: eventName,
    },
  ]

  return (
    <DefaultLayout
      heading={eventName}
      pageTitle="Events Attendees"
      breadcrumbs={breadcrumbs}
      useReactRouter={true}
    >
      <CheckUserFeatureFlag userFeatureFlagName={EVENT_ACTIVITY_FEATURE_FLAG}>
        {(isFeatureFlagEnabled) =>
          isFeatureFlagEnabled && (
            <Task.Status
              name={TASK_GET_EVENT_AVENTRI_ATTENDEES}
              id={ID}
              progressMessage="Loading Aventri attendees"
              startOnRender={{
                payload: { aventriEventId, selectedSortBy },
                onSuccessDispatch: EVENTS__AVENTRI_ATTENDEES_LOADED,
              }}
            >
              {() => (
                <GridRow data-test="event-aventri-attendee">
                  <GridCol setWidth="one-quarter">
                    <LocalNav dataTest="event-aventri-nav">
                      <LocalNavLink
                        dataTest="event-aventri-details-link"
                        href={urls.events.aventri.details(aventriEventId)}
                      >
                        Details
                      </LocalNavLink>
                      <LocalNavLink
                        dataTest="event-aventri-attendees-link"
                        href={urls.events.aventri.attendees(aventriEventId)}
                      >
                        Attendees
                      </LocalNavLink>
                    </LocalNav>
                  </GridCol>
                  <GridCol setWidth="three-quarters">
                    <CollectionHeader
                      totalItems={totalAttendees}
                      collectionName="attendee"
                      data-test="attendee-collection-header"
                    />
                    <CollectionSort
                      sortOptions={[
                        {
                          name: 'First name: A-Z',
                          value: 'first_name:asc',
                        },
                        {
                          name: 'First name: Z-A',
                          value: 'first_name:desc',
                        },
                      ]}
                    />
                    <ActivityList>
                      {aventriAttendees?.map((attendee, index) => (
                        <li key={`aventri-attendee-${index}`}>
                          <Activity activity={attendee}></Activity>
                        </li>
                      ))}
                    </ActivityList>
                  </GridCol>
                </GridRow>
              )}
            </Task.Status>
          )
        }
      </CheckUserFeatureFlag>
    </DefaultLayout>
  )
}

export default connect(state2props)(EventAventriAttendees)
