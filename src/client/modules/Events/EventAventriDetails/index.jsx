import React from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import urls from '../../../../lib/urls'
import { TASK_GET_EVENT_AVENTRI_DETAILS, ID, state2props } from './state'
import { EVENTS__AVENTRI_DETAILS_LOADED } from '../../../actions'
import Task from '../../../components/Task'
import {
  DefaultLayout,
  LocalNav,
  LocalNavLink,
  NewWindowLink,
  StatusMessage,
  SummaryTable,
} from '../../../components'
import CheckUserFeatureFlag from '../../../components/CheckUserFeatureFlags'
import { ACTIVITY_STREAM_FEATURE_FLAG } from '../../../../apps/companies/apps/activity-feed/constants'
import { GridCol, GridRow } from 'govuk-react'
import styled from 'styled-components'
import { isEmpty } from 'lodash'

const StyledStatusMessage = styled(StatusMessage)`
  div.statusHeader {
    font-size: x-large;
  }
  div.statusContent {
    font-size: medium;
  }
  div.statusLink {
    font-size: 80%;
  }
`

const StyledSummaryTable = styled(SummaryTable)({
  marginTop: 0,
})

const EventAventriDetails = ({
  name,
  eventDate,
  location,
  fullAddress,
  registrationStatuses
}) => {
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

  const aventriEventLink =
    'https://eu-admin.eventscloud.com/loggedin/eVent/index.php?eventid=' +
    aventriEventId

  return (
    <DefaultLayout
      heading={name}
      pageTitle="Events"
      breadcrumbs={breadcrumbs}
      useReactRouter={true}
    >
      <CheckUserFeatureFlag userFeatureFlagName={ACTIVITY_STREAM_FEATURE_FLAG}>
        {(isFeatureFlagEnabled) =>
          isFeatureFlagEnabled && (
            <Task.Status
              name={TASK_GET_EVENT_AVENTRI_DETAILS}
              id={ID}
              progressMessage="loading event aventri details"
              startOnRender={{
                payload: aventriEventId,
                onSuccessDispatch: EVENTS__AVENTRI_DETAILS_LOADED,
              }}
            >
              {() => {
                return (
                  name && (
                    <>
                      <StyledStatusMessage>
                        <div class="statusHeader">
                          {' '}
                          This event has been automatically synced from Aventri.
                        </div>

                        <div class="statusContent">
                          Event details, registrants and attendees can only be
                          edited in Aventri. Changes can take up to 24 hours to
                          sync.
                        </div>

                        <div class="statusLink">
                          <NewWindowLink href={aventriEventLink}>
                            View in Aventri
                          </NewWindowLink>
                        </div>
                      </StyledStatusMessage>
                      <GridRow data-test="eventAventriDetails">
                        <GridCol setWidth="one-quarter">
                          <LocalNav dataTest="event-aventri-nav">
                            <LocalNavLink
                              dataTest="event-aventri-details-link"
                              href={urls.events.aventri.details(aventriEventId)}
                            >
                              Details
                            </LocalNavLink>
                            {registrationStatuses?.map((status, index) => (
                              <LocalNavLink
                                key={`reg-status-${index}`}
                                dataTest="event-aventri-status-link"
                                href={urls.events.aventri.registrationStatus(
                                  aventriEventId,
                                  status.urlSlug
                                )}
                              >
                                {status.status} ({status.count})
                              </LocalNavLink>
                              ))}
                            {/* {attended.status && (
                              <LocalNavLink
                                dataTest="event-aventri-attended-link"
                                href={urls.events.aventri.attended(
                                  aventriEventId
                                )}
                              >
                                Attended ({attended.total})
                              </LocalNavLink>
                            )} */}
                          </LocalNav>
                        </GridCol>
                        <GridCol setWidth="three-quarters">
                          <StyledSummaryTable>
                            <SummaryTable.Row
                              heading="Event date"
                              children={eventDate}
                            />
                            <SummaryTable.Row
                              heading="Event location type"
                              children={
                                isEmpty(location) ? 'Not set' : location
                              }
                            />
                            <SummaryTable.Row
                              heading="Address"
                              children={
                                isEmpty(fullAddress) ? 'Not set' : fullAddress
                              }
                            />
                            <SummaryTable.Row
                              heading="Aventri reference number"
                              children={
                                <>
                                  <span>
                                    {aventriEventId}&nbsp;
                                    <NewWindowLink href={aventriEventLink}>
                                      View in Aventri
                                    </NewWindowLink>
                                  </span>
                                </>
                              }
                            />
                          </StyledSummaryTable>
                        </GridCol>
                      </GridRow>
                    </>
                  )
                )
              }}
            </Task.Status>
          )
        }
      </CheckUserFeatureFlag>
    </DefaultLayout>
  )
}

export default connect(state2props)(EventAventriDetails)
