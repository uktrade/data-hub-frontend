import React from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
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
import { GridCol, GridRow } from 'govuk-react'
import Task from '../../../components/Task'
import {
  ID,
  state2props,
  TASK_GET_EVENT_AVENTRI_REGISTRATION_STATUS_ATTENDEES,
} from './state'
import { EVENTS__AVENTRI_REGISTRATION_STATUS_ATTENDEES_LOADED } from '../../../actions'
import Activity from '../../../components/ActivityFeed/Activity'
import ActivityList from '../../../components/ActivityFeed/activities/card/ActivityList'
import AventriEventSyncWarning from '../../../components/ActivityFeed/activities/AventriEventSyncWarning'

import { ATTENDEES_SORT_OPTIONS } from './constants'

const activityListSize = 20

const EventAventriRegistrationStatus = ({
  name,
  aventriEventId,
  aventriAttendees,
  registrationStatus,
  registrationStatusCounts,
  defaultQueryParams = {
    page: 1,
    size: activityListSize,
    sortby: 'first_name:asc',
  },
  payload,
  page = parseInt(page || 1, activityListSize),
  totalAttendees,
  itemsPerPage = activityListSize,
  maxItemsToPaginate = 10000,
}) => {
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
            heading={name}
            pageTitle="Events"
            breadcrumbs={breadcrumbs}
            useReactRouter={true}
          >
            <Task.Status
              name={TASK_GET_EVENT_AVENTRI_REGISTRATION_STATUS_ATTENDEES}
              id={ID}
              progressMessage="Loading Aventri attendees"
              startOnRender={{
                payload: {
                  aventriEventId,
                  registrationStatus,
                  ...payload,
                },
                onSuccessDispatch:
                  EVENTS__AVENTRI_REGISTRATION_STATUS_ATTENDEES_LOADED,
              }}
            >
              {() => (
                <>
                  <AventriEventSyncWarning aventriEventId={aventriEventId} />
                  <GridRow data-test="event-aventri-attended">
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
                    {aventriAttendees && (
                      <GridCol setWidth="three-quarters">
                        <CollectionSort
                          sortOptions={ATTENDEES_SORT_OPTIONS}
                          totalPages={totalPages}
                          shouldPluralize={false}
                        />
                        <CollectionHeader
                          totalItems={totalAttendees}
                          collectionName={registrationStatus}
                          data-test="attendee-collection-header"
                          shouldPluralize={false}
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
                </>
              )}
            </Task.Status>
            <RoutedPagination
              initialPage={page}
              items={totalAttendees}
              pageSize={itemsPerPage}
            />
          </DefaultLayout>
        )
      }}
    </Route>
  )
}
export default connect(state2props)(EventAventriRegistrationStatus)
