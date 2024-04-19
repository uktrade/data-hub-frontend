/* eslint-disable react/no-array-index-key */
// this is because there isn't necessarily a unique id to use as the key

import React from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import { GridRow, GridCol } from 'govuk-react'
import { isEmpty } from 'lodash'
import qs from 'qs'

import { getQueryParamsFromLocation } from '../../utils/url'
import Task from '../Task'
import CollectionSort from '../CollectionList/CollectionSort'

import RoutedPagination from '../Pagination/RoutedPagination'
import CollectionHeader from '../CollectionList/CollectionHeader'
import ActivityList from '../ActivityFeed/activities/card/ActivityList'
import Activity from '../ActivityFeed/Activity'

const ActivityFeedFilteredCollectionList = ({
  itemsPerPage = 10,
  sortOptions = null,
  taskProps,
  total = 0,
  children,
  maxItemsToPaginate = 10000,
  defaultQueryParams,
  allActivityFeedEvents,
  addItemURL,
}) => {
  const totalPages = Math.ceil(
    Math.min(total, maxItemsToPaginate) / itemsPerPage
  )

  return (
    <Route>
      {({ history, location }) => {
        const qsParams = getQueryParamsFromLocation(location)
        const initialPage = parseInt(qsParams.page, 10)
        if (defaultQueryParams && isEmpty(qsParams)) {
          history.push({
            search: qs.stringify({
              ...defaultQueryParams,
            }),
          })
        }
        return (
          <GridRow data-test="activity-feed-collection-list">
            {children}
            <GridCol>
              <article>
                {
                  <CollectionHeader
                    totalItems={total}
                    collectionName="event"
                    data-test="activity-feed-collection-header"
                    addItemUrl={addItemURL}
                  />
                }
                {sortOptions && (
                  <CollectionSort
                    sortOptions={sortOptions}
                    totalPages={totalPages}
                  />
                )}
                <Task.Status {...taskProps}>
                  {() => (
                    <ActivityList>
                      {allActivityFeedEvents?.map((event, index) => {
                        return (
                          <li key={`event-${index}`}>
                            <Activity activity={event} />
                          </li>
                        )
                      })}
                    </ActivityList>
                  )}
                </Task.Status>
                <RoutedPagination initialPage={initialPage} items={total} />
              </article>
            </GridCol>
          </GridRow>
        )
      }}
    </Route>
  )
}

ActivityFeedFilteredCollectionList.propTypes = {
  taskProps: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
    progressMessage: PropTypes.string,
    renderProgress: PropTypes.func,
    startOnRender: PropTypes.shape({
      payload: PropTypes.shape({
        page: PropTypes.number,
        filters: PropTypes.object,
        search: PropTypes.string,
      }).isRequired,
      onSuccessDispatch: PropTypes.string,
    }).isRequired,
  }),
  children: PropTypes.node,
  maxItemsToPaginate: PropTypes.number,
  defaultQueryParams: PropTypes.object,
  total: PropTypes.number,
  itemsPerPage: PropTypes.number,
  sortOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  allActivityFeedEvents: PropTypes.array,
}

export default ActivityFeedFilteredCollectionList
