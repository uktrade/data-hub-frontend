import React from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import { SPACING } from '@govuk-react/constants'
import styled from 'styled-components'

import urls from '../../../../lib/urls'
import { DefaultLayout, LocalNav, LocalNavLink } from '../../../components'
import CheckUserFeatureFlag from '../../../components/CheckUserFeatureFlags'
import { EVENT_ACTIVITY_FEATURE_FLAG } from '../../../../apps/companies/apps/activity-feed/constants'
import { GridCol, GridRow } from 'govuk-react'
import Task from '../../../components/Task'
import { ID, state2props, TASK_GET_EVENT_AVENTRI_ATTENDEES } from './state'
import { EVENTS__AVENTRI_ATTENDEES_LOADED } from '../../../actions'
import Activity from '../../../components/ActivityFeed/Activity'

const AttendeesList = styled('ol')`
  list-style-type: none;
  margin-top: ${SPACING.SCALE_2};

  & > li {
    margin-bottom: ${SPACING.SCALE_2};
  }
`

const EventAventriAttendees = ({ aventriAttendees, aventriEventData }) => {
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
                payload: aventriEventId,
                onSuccessDispatch: EVENTS__AVENTRI_ATTENDEES_LOADED,
              }}
            >
              {() => (
                <GridRow data-test="event-aventri-attendee">
                  <GridCol setWidth="one-quarter">
                    <LocalNav data-test="event-aventri-nav">
                      <LocalNavLink
                        data-test="event-aventri-attendees-link"
                        href={urls.events.aventriAttendees.index(
                          aventriEventId
                        )}
                      >
                        Attendees
                      </LocalNavLink>
                    </LocalNav>
                  </GridCol>
                  <GridCol setWidth="three-quarters">
                    <AttendeesList>
                      {aventriAttendees?.map((attendee, index) => (
                        <li key={`aventri-attendee-${index}`}>
                          <Activity activity={attendee}></Activity>
                        </li>
                      ))}
                    </AttendeesList>
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
