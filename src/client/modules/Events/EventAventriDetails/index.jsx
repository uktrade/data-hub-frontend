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
  SummaryTable,
} from '../../../components'
import CheckUserFeatureFlag from '../../../components/CheckUserFeatureFlags'
import { EVENT_ACTIVITY_FEATURE_FLAG } from '../../../../apps/companies/apps/activity-feed/constants'
import { GridCol, GridRow } from 'govuk-react'
import styled from 'styled-components'
import { isEmpty } from 'lodash'

const StyledSummaryTable = styled(SummaryTable)({
  marginTop: 0,
})

const EventAventriDetails = ({
  name,
  type,
  eventDate,
  location,
  fullAddress,
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

  return (
    <DefaultLayout
      heading={name}
      pageTitle="Events"
      breadcrumbs={breadcrumbs}
      useReactRouter={true}
    >
      <CheckUserFeatureFlag userFeatureFlagName={EVENT_ACTIVITY_FEATURE_FLAG}>
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
                    <GridRow data-test="eventAventriDetails">
                      <GridCol setWidth="one-quarter">
                        <LocalNav data-test="event-aventri-details-nav">
                          <LocalNavLink
                            data-test="event-aventri-details-link"
                            href={urls.events.aventri.details(aventriEventId)}
                          >
                            Details
                          </LocalNavLink>
                        </LocalNav>
                      </GridCol>
                      <GridCol setWidth="three-quarters">
                        <StyledSummaryTable>
                          <SummaryTable.Row
                            heading="Type of event"
                            children={type}
                          />
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
                        </StyledSummaryTable>
                      </GridCol>
                    </GridRow>
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
