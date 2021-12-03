/* eslint-disable react/no-array-index-key */
// this is because there isn't necessarily a unique id to use as the key

import React from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import { GridRow, GridCol } from 'govuk-react'
import { isEmpty } from 'lodash'
import qs from 'qs'

import Task from '../Task'

import {
  CollectionSort,
  CollectionItem,
  RoutedDownloadDataHeader,
  FilteredCollectionHeader,
} from '../../components'

import RoutedPagination from '../../components/Pagination/RoutedPagination'

const FilteredCollectionList = ({
  results = [],
  summary = null,
  itemsPerPage = 10,
  sortOptions = null,
  taskProps,
  count = 0,
  isComplete,
  children,
  collectionName,
  maxItemsToPaginate = 10000,
  maxItemsToDownload,
  selectedFilters,
  baseDownloadLink = null,
  entityName,
  entityNamePlural,
  addItemUrl,
  defaultQueryParams,
  titleRenderer = null,
  useReactRouter = false,
}) => {
  const totalPages = Math.ceil(
    Math.min(count, maxItemsToPaginate) / itemsPerPage
  )
  return (
    <Route>
      {({ history, location }) => {
        const qsParams = qs.parse(location.search.slice(1))
        const initialPage = parseInt(qsParams.page, 10)
        if (defaultQueryParams && isEmpty(qsParams)) {
          history.push({
            search: qs.stringify({
              ...defaultQueryParams,
            }),
          })
        }
        return (
          <GridRow data-test="collection-list">
            {children}
            <GridCol>
              <article>
                {isComplete && (
                  <FilteredCollectionHeader
                    totalItems={count}
                    summary={summary}
                    collectionName={collectionName}
                    hasFilters={children !== undefined}
                    selectedFilters={selectedFilters}
                    addItemUrl={addItemUrl}
                  />
                )}
                {sortOptions && (
                  <CollectionSort
                    sortOptions={sortOptions}
                    totalPages={totalPages}
                  />
                )}
                {baseDownloadLink && (
                  <RoutedDownloadDataHeader
                    count={count}
                    maxItems={maxItemsToDownload}
                    data-test="download-data-header"
                    baseDownloadLink={baseDownloadLink}
                    entityName={entityName}
                    entityNamePlural={entityNamePlural}
                  />
                )}
                <Task.Status {...taskProps}>
                  {() =>
                    isComplete && (
                      <>
                        <ol>
                          {results.map((item) => (
                            <CollectionItem
                              {...item}
                              key={item.id}
                              titleRenderer={titleRenderer}
                              useReactRouter={useReactRouter}
                            />
                          ))}
                        </ol>
                      </>
                    )
                  }
                </Task.Status>
                <RoutedPagination initialPage={initialPage} items={count} />
              </article>
            </GridCol>
          </GridRow>
        )
      }}
    </Route>
  )
}

FilteredCollectionList.propTypes = {
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
  isComplete: PropTypes.bool,
  children: PropTypes.node,
  collectionName: PropTypes.string,
  router: PropTypes.shape({
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
      query: PropTypes.object.isRequired,
    }),
  }),
  maxItemsToPaginate: PropTypes.number,
  maxItemsToDownload: PropTypes.number,
  selectedFilters: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  }),
  summary: PropTypes.object,
  defaultQueryParams: PropTypes.object,
  titleRenderer: PropTypes.func,
  width: PropTypes.string,
}

export default FilteredCollectionList
