import React from 'react'
import { connect } from 'react-redux'
import { Route, useParams, withRouter } from 'react-router-dom'
import { isEmpty } from 'lodash'
import qs from 'qs'
import {compose} from "redux";
import urls from '../../../../lib/urls'
import {
  CollectionSort,
  CollectionHeader,
  DefaultLayout,
  LocalNav,
  LocalNavLink,
  RoutedPagination,
} from '../../../components'
import CheckUserFeatureFlag from '../../../components/CheckUserFeatureFlags'
import { ACTIVITY_STREAM_FEATURE_FLAG } from '../../../../apps/companies/apps/activity-feed/constants'
import { GridCol, GridRow } from 'govuk-react'
import Task from '../../../components/Task'
import { ID, state2props, TASK_GET_EVENT_AVENTRI_REGISTRATION_STATUS_ATTENDEES } from './state'
import { EVENTS__AVENTRI_REGISTRATION_STATUS_LOADED } from '../../../actions'
import Activity from '../../../components/ActivityFeed/Activity'
import ActivityList from '../../../components/ActivityFeed/activities/card/ActivityList'
import { ATTENDEES_SORT_OPTIONS } from './constants'

const EventAventriRegistrationStatus = ({
  aventriEventId,
  aventriRegistrationStatuses,
  aventriEventData,
  defaultQueryParams = {
    page: 1,
    size: 10,
    sortby: 'first_name:asc',
  }},
  payload,
  page = parseInt(page || 1, 10),
  totalAttendees,
  itemsPerPage = 10,
  maxItemsToPaginate = 10000,
  ) => {

    // const eventName = aventriEventData?.object.name
    // console.log(eventName)
    // const breadcrumbs = [
    //   {
    //     link: urls.dashboard(),
    //     text: 'Home',
    //   },
    //   {
    //     link: urls.events.index(),
    //     text: 'Events',
    //   },
    //   {
    //     text: eventName,
    //   },
    // ]
    const totalPages = Math.ceil(
      Math.min(totalAttendees, maxItemsToPaginate) / itemsPerPage
    )
  return (
    <Route>
      {({ history, location }) => {
        const qsParams = qs.parse(location.search.slice(1))

        if (isEmpty(qsParams)) {
          history.push({
            search: qs.stringify({
              ...defaultQueryParams,
            }),
          })
        }

        return (
          <DefaultLayout
          // heading={eventName}
          pageTitle="Events STATUS"
          // breadcrumbs={breadcrumbs}
          useReactRouter={true}
          >
            <CheckUserFeatureFlag
              userFeatureFlagName={ACTIVITY_STREAM_FEATURE_FLAG}
            >
              {(isFeatureFlagEnabled) =>
                isFeatureFlagEnabled && (
                  <Task.Status
                    name={TASK_GET_EVENT_AVENTRI_REGISTRATION_STATUS_ATTENDEES}
                    id={ID}
                    progressMessage="Loading Aventri attendees"
                    startOnRender={{
                      payload: {
                        aventriEventId,
                        aventriRegistrationStatuses,
                        ...payload,
                      },
                      onSuccessDispatch: EVENTS__AVENTRI_REGISTRATION_STATUS_LOADED,
                    }}
                  >
                    {() => (
                      <GridRow data-test="event-aventri-registration-status">
                        Something
                      </GridRow>
                    )}
                  </Task.Status>
                )
              }
            </CheckUserFeatureFlag>
          </DefaultLayout>
        )
      }}
    </Route>
  )
}
export default connect(state2props)(EventAventriRegistrationStatus)
