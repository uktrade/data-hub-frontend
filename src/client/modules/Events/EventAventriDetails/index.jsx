import React from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import { GridCol, GridRow } from 'govuk-react'
import styled from 'styled-components'
import { isEmpty } from 'lodash'

import urls from '../../../../lib/urls'
import { TASK_GET_EVENT_AVENTRI_DETAILS, ID, state2props } from './state'
import { EVENTS__AVENTRI_DETAILS_LOADED } from '../../../actions'
import Task from '../../../components/Task'
import {
  DefaultLayout,
  LocalNav,
  LocalNavLink,
  NewWindowLink,
  SummaryTable,
} from '../../../components'
import AventriEventSyncWarning from '../../../components/ActivityFeed/activities/AventriEventSyncWarning'

const StyledSummaryTable = styled(SummaryTable)({
  marginTop: 0,
})

const EventAventriDetails = ({
  name,
  eventDate,
  location,
  fullAddress,
  registrationStatusCounts,
}) => {
  const { aventriEventId } = useParams()
  const breadcrumbs = [
    {
      link: urls.dashboard.index(),
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
      heading={name}
      pageTitle="Events"
      breadcrumbs={breadcrumbs}
      useReactRouter={true}
    >
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
          const aventriEventLink = `https://eu-admin.eventscloud.com/loggedin/eVent/index.php?eventid=${aventriEventId}`

          return (
            name && (
              <>
                <AventriEventSyncWarning aventriEventId={aventriEventId} />
                <GridRow data-test="eventAventriDetails">
                  <GridCol setWidth="one-quarter">
                    <LocalNav dataTest="event-aventri-nav">
                      <LocalNavLink
                        dataTest="event-aventri-details-link"
                        href={urls.events.aventri.details(aventriEventId)}
                      >
                        Details
                      </LocalNavLink>
                      {registrationStatusCounts?.map((status, index) => (
                        <LocalNavLink
                          key={`reg-status-${index}`}
                          dataTest={`event-aventri-status-link-${status.urlSlug}`}
                          href={urls.events.aventri.registrationStatus(
                            aventriEventId,
                            status.urlSlug
                          )}
                        >
                          {status.status} ({status.count})
                        </LocalNavLink>
                      ))}
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
                        children={isEmpty(location) ? 'Not set' : location}
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
    </DefaultLayout>
  )
}

export default connect(state2props)(EventAventriDetails)
