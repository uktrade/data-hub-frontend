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
  RoutedPagination,
  FilteredCollectionHeader,
} from '../../components'

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
  maxItemsToDownload,
  selectedFilters,
  baseDownloadLink = null,
  entityName,
  entityNamePlural,
  addItemUrl,
  defaultQueryParams,
}) => {
  const totalPages = Math.ceil(count / itemsPerPage)
  return (
    <Route>
      {({ history, location }) => {
        const qsParams = qs.parse(location.search.slice(1))
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
            <GridCol setWidth="two-thirds">
              <article>
                {isComplete && (
                  <FilteredCollectionHeader
                    totalItems={count}
                    summary={summary}
                    collectionName={collectionName}
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
                        {results.map((item) => (
                          <CollectionItem {...item} key={item.id} />
                        ))}
                        <RoutedPagination
                          qsParamName="page"
                          totalPages={totalPages}
                        />
                      </>
                    )
                  }
                </Task.Status>
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
  maxItemsToDownload: PropTypes.number,
  selectedFilters: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  }),
  summary: PropTypes.object,
  defaultQueryParams: PropTypes.object,
}

export default FilteredCollectionList
