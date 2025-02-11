import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useLocation, useNavigate } from 'react-router-dom'

import { GridRow, GridCol } from 'govuk-react'
import { isEmpty } from 'lodash'
import qs from 'qs'

import Task from '../Task'
import Analytics from '../Analytics'

import CollectionItem from '../../components/CollectionList/CollectionItem'
import CollectionSort from '../../components/CollectionList/CollectionSort'
import RoutedDownloadDataHeader from '../../components/RoutedDownloadDataHeader'
import Pagination from '../../components/Pagination'
import FilteredCollectionHeader from './FilteredCollectionHeader'

/**
 * Prepare filters data to be sent to analytics data layer.
 */
const filtersToAnalytics = (filters) =>
  Object.fromEntries(
    Object.entries(filters)
      .filter(([, value]) => value && value.options && value.options.length)
      .map(([key, value]) => [
        value?.queryParam || key,
        value.options.map((option) => option.label),
      ])
  )

const getSelectedFilters = (filters) =>
  Object.fromEntries(
    Object.entries(filters).filter(
      ([, value]) => value && value.options && value.options.length
    )
  )

const getPageNumber = (qsParams, defaultValue = 1) => {
  const pageNumber = parseInt(qsParams.page, 10)
  return isNaN(pageNumber) ? defaultValue : pageNumber
}

const collectionItemTemplateDefault = (
  item,
  titleRenderer,
  useReactRouter,
  pushAnalytics,
  selectedFilters,
  sanitizeFiltersForAnalytics
) => {
  return (
    <CollectionItem
      {...item}
      key={item.id}
      titleRenderer={titleRenderer}
      useReactRouter={useReactRouter}
      onClick={() => {
        pushAnalytics({
          event: 'filterResultClick',
          extra: {
            ...filtersToAnalytics(selectedFilters),
            ...(sanitizeFiltersForAnalytics &&
              sanitizeFiltersForAnalytics(getSelectedFilters(selectedFilters))),
          },
        })
      }}
    />
  )
}

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
  sanitizeFiltersForAnalytics = null,
  useReactRouter = false,
  collectionItemTemplate = collectionItemTemplateDefault,
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  const totalPages = Math.ceil(
    Math.min(count, maxItemsToPaginate) / itemsPerPage
  )
  const qsParams = qs.parse(location.search.slice(1))

  useEffect(() => {
    if (defaultQueryParams && isEmpty(qsParams)) {
      navigate({
        search: qs.stringify({
          ...defaultQueryParams,
        }),
      })
    }
  }, [])

  const initialPage = getPageNumber(qsParams)
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
              useReactRouter={useReactRouter}
            />
          )}
          {sortOptions && (
            <CollectionSort sortOptions={sortOptions} totalPages={totalPages} />
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
                <ol aria-live="polite">
                  {results.map((item, index) => (
                    <Analytics key={`${item.id}-${index}`}>
                      {(pushAnalytics) =>
                        collectionItemTemplate(
                          item,
                          titleRenderer,
                          useReactRouter,
                          pushAnalytics,
                          selectedFilters,
                          sanitizeFiltersForAnalytics
                        )
                      }
                    </Analytics>
                  ))}
                </ol>
              )
            }
          </Task.Status>
          <Pagination
            totalPages={totalPages}
            activePage={initialPage}
            onPageClick={(page, e) => {
              e.preventDefault()
              navigate({
                search: qs.stringify({
                  ...qsParams,
                  page,
                }),
              })
            }}
          />
        </article>
      </GridCol>
    </GridRow>
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
  sanitizeFiltersForAnalytics: PropTypes.func,
  width: PropTypes.string,
}

export default FilteredCollectionList
