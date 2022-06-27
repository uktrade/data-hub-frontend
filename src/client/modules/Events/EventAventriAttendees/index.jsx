import React from 'react'
import { useParams } from 'react-router-dom'

import urls from '../../../../lib/urls'
import { DefaultLayout, LocalNav, LocalNavLink } from '../../../components'
import CheckUserFeatureFlag from '../../../components/CheckUserFeatureFlags'
import { EVENT_ACTIVITY_FEATURE_FLAG } from '../../../../apps/companies/apps/activity-feed/constants'
import { GridCol, GridRow } from 'govuk-react'

const EventAventriAttendees = ({ name }) => {
  const { aventriEventId } = useParams()
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
      text: name,
    },
  ]

  return (
    <DefaultLayout
      heading="Events"
      pageTitle="Events Attendees"
      breadcrumbs={breadcrumbs}
      useReactRouter={true}
    >
      <CheckUserFeatureFlag userFeatureFlagName={EVENT_ACTIVITY_FEATURE_FLAG}>
        {(isFeatureFlagEnabled) =>
          isFeatureFlagEnabled && (
            <GridRow data-test="eventAventriDetails">
              <GridCol setWidth="one-quarter">
                <LocalNav data-test="event-aventri-details-nav">
                  <LocalNavLink
                    data-test="event-aventri-details-link"
                    href={urls.events.aventri.details(aventriEventId)}
                  >
                    Attendees
                  </LocalNavLink>
                </LocalNav>
              </GridCol>
              <GridCol setWidth="three-quarters">
                <h1>Attendees go here!</h1>
              </GridCol>
            </GridRow>
          )
        }
      </CheckUserFeatureFlag>
    </DefaultLayout>
  )
}

// export default connect(state2props)(EventAventriDetails)
export default EventAventriAttendees
