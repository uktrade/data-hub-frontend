import React from 'react'
import { connect } from 'react-redux'
import { Route, useParams } from 'react-router-dom'
import { isEmpty } from 'lodash'
import qs from 'qs'

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
import { ID, state2props, TASK_GET_EVENT_AVENTRI_ATTENDED } from './state'
import { EVENTS__AVENTRI_ATTENDED_LOADED } from '../../../actions'
import Activity from '../../../components/ActivityFeed/Activity'
import ActivityList from '../../../components/ActivityFeed/activities/card/ActivityList'
import { ATTENDEES_SORT_OPTIONS } from './constants'

const EventAventriAttended = ({
  aventriAttendees,
  aventriEventData,
  defaultQueryParams = {
    page: 1,
    size: 10,
    sortby: 'first_name:asc',
  },
  payload,
  page = parseInt(page || 1, 10),
  totalAttendees,
  itemsPerPage = 10,
  maxItemsToPaginate = 10000,
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
  const totalPages = Math.ceil(
    Math.min(totalAttendees, maxItemsToPaginate) / itemsPerPage
  )

  return (
    <Route>
      {({ history, location }) => {
        const qsParams = qs.parse(location.search.slice(1))

        const page = parseInt(qsParams.page, 10)
        if (isEmpty(qsParams)) {
          history.push({
            search: qs.stringify({
              ...defaultQueryParams,
            }),
          })
        }

        return (
          <DefaultLayout
            heading={eventName}
            pageTitle="Events Attended"
            breadcrumbs={breadcrumbs}
            useReactRouter={true}
          >
            <CheckUserFeatureFlag
              userFeatureFlagName={ACTIVITY_STREAM_FEATURE_FLAG}
            >
              {(isFeatureFlagEnabled) =>
                isFeatureFlagEnabled && (
                  <Task.Status
                    name={TASK_GET_EVENT_AVENTRI_ATTENDED}
                    id={ID}
                    progressMessage="Loading Aventri attended"
                    startOnRender={{
                      payload: { aventriEventId, ...payload },
                      onSuccessDispatch: EVENTS__AVENTRI_ATTENDED_LOADED,
                    }}
                  >
                    {() => (
                      <GridRow data-test="event-aventri-attended">
                        <GridCol setWidth="one-quarter">
                          <LocalNav dataTest="event-aventri-nav">
                            <LocalNavLink
                              dataTest="event-aventri-details-link"
                              href={urls.events.aventri.details(aventriEventId)}
                            >
                              Details
                            </LocalNavLink>
                            <LocalNavLink
                              dataTest="event-aventri-attended-link"
                              href={urls.events.aventri.attended(
                                aventriEventId
                              )}
                            >
                              Attended ({totalAttendees})
                            </LocalNavLink>
                          </LocalNav>
                        </GridCol>
                        {aventriAttendees && (
                          <GridCol setWidth="three-quarters">
                            <CollectionHeader
                              totalItems={totalAttendees}
                              collectionName="attendee"
                              data-test="attendee-collection-header"
                            />
                            <CollectionSort
                              sortOptions={ATTENDEES_SORT_OPTIONS}
                              totalPages={totalPages}
                            />
                            <ActivityList>
                              {aventriAttendees?.map((attendee, index) => (
                                <li key={`aventri-attended-${index}`}>
                                  <Activity activity={attendee}></Activity>
                                </li>
                              ))}
                            </ActivityList>
                          </GridCol>
                        )}
                      </GridRow>
                    )}
                  </Task.Status>
                )
              }
            </CheckUserFeatureFlag>
            <RoutedPagination initialPage={page} items={totalAttendees} />
          </DefaultLayout>
        )
      }}
    </Route>
  )
}

export default connect(state2props)(EventAventriAttended)
