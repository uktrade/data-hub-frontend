import React from 'react'
import PropTypes from 'prop-types'
import { useLocation, Navigate } from 'react-router-dom'
import qs from 'qs'

import styled from 'styled-components'

import multiInstance from '../../utils/multiinstance'
import Task from '../Task'
import LoadingBox from '../Task/LoadingBox'
import Pagination from '../Pagination'
import CollectionHeader from '../CollectionList/CollectionHeader'
import CollectionSort from '../CollectionList/CollectionSort'
import {
  PAGINATED_RESOURCE__GO_TO_PAGE,
  PAGINATED_RESOURCE__ON_SUCCESS,
} from '../../actions'

const StyledCollectionSort = styled(CollectionSort)`
  margin-bottom: 15px;
`

/**
 * @function PaginatedResource
 * Same as {Resource} but injects a paginated subset of items into
 * {children} and renders a routed pagination below {children}.
 * You will most likely never need to use this component directly,
 * but use the ones created with the `createCollectionResource` factory.
 * @example
 * const CompanyResource = createEntityResource('Company', (id) => `v4/company/${id}`)
 *
 * <CompanyResource.Paginated id="my-paginated-company-view">
 *  {currentPage =>
 *    <pre>{JSON.stringify(currentPage, null, 2)}</pre>
 *  }
 * </CompanyResource.Paginated>
 *
 * @param {Object} props
 * @param {string} props.name - The name of the task which loads the resource
 * @param {string} props.id - The unique ID of the resource for the given name.
 * The ID will be the task's payload.e
 * @param {Object} props.payload - A payload with which the task will be called with.
 * This has to be an object because the component will merge it with the pagination
 * payload {{limit: number, offset: number}}.
 * @param {(result: any) => React.ReactNode} props.children - The single child should be
 * a function which recieves an array of the items for the current page as its only
 * parameter.
 * @param {number} [props.pageSize = 10] - The desired number of items per page.
 * @param {{name: string, value: string | number}[]} [props.sortOptions = []] -
 * The options for the sort by dropdown. Forwarded to {sortOptions} prop of {StyledCollectionSort}.
 * @param {string} [props.sortByQsParamName = 'sortby'] - The name of the query string parameter
 * under which the selected sort by option will be persisted.
 * Forwarded to {qsParamName} prop of {StyledCollectionSort}.
 * @param {number} [props.defaultSortOptionIndex = 0] - The index of the sort option
 * that should be selected when there's nothing set in the query string.
 * @param {string} [props.addItemUrl =] - If set, an "Add <item-name>" button
 * will be displayed on the top-right corner of the header behaving as a link
 * to the value of this prop. This is just forwarded to CollectionHeader.
 * @example
 * <PaginatedResource name="My task name" id="foo">
 *   {currentPage =>
 *     <pre>{JSON.stringify(currentPage, null, 2)}</pre>
 *   }
 * </PaginatedResource>
 */
const PaginatedResource = multiInstance({
  name: 'PaginatedResource',
  actionPattern: 'PAGINATED_RESOURCE__',
  reducer: (state, { type, result, page }) => {
    switch (type) {
      case PAGINATED_RESOURCE__GO_TO_PAGE:
        return {
          ...state,
          clickedPage: page,
        }
      case PAGINATED_RESOURCE__ON_SUCCESS:
        return {
          ...state,
          currentPage: state?.clickedPage,
          clickedPage: null,
          result,
        }
      default:
        return state
    }
  },
  dispatchToProps: (dispatch) => ({
    onPageClick: (page) =>
      dispatch({ type: PAGINATED_RESOURCE__GO_TO_PAGE, page }),
  }),
  component: ({
    name,
    heading,
    id,
    children,
    pageSize = 10,
    payload = {},
    sortOptions = [],
    defaultSortOptionIndex = 0,
    sortByQsParamName = 'sortby',
    onPageClick,
    currentPage,
    result,
    shouldPluralize,
    noResults = "You don't have any results",
    addItemUrl,
  }) => {
    // We know better than ESLint that we are in deed in a React component
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const location = useLocation()
    const qsParams = qs.parse(location.search.slice(1))
    const sortby =
      qsParams[sortByQsParamName] || sortOptions[defaultSortOptionIndex]?.value

    return (
      <Task>
        {(getTask) => {
          const location = useLocation()
          const qsParams = qs.parse(location.search.slice(1))
          const routePage = parseInt(qsParams.page, 10) || 1
          const totalPages = result ? Math.ceil(result.count / pageSize) : 0
          const hasZeroResults = result?.count === 0

          const task = getTask(name, id)

          return (
            <>
              <Task.StartOnRender
                name={name}
                id={id}
                payload={{
                  ...payload,
                  sortby,
                  limit: pageSize,
                  offset: (routePage - 1) * pageSize,
                }}
                onSuccessDispatch={PAGINATED_RESOURCE__ON_SUCCESS}
              />
              {currentPage && (
                <Navigate
                  to={{
                    ...location,
                    search: qs.stringify({
                      ...qsParams,
                      page: currentPage,
                    }),
                  }}
                />
              )}

              {result ? (
                <LoadingBox name={name} id={id}>
                  <CollectionHeader
                    totalItems={result.count}
                    collectionName={heading || name}
                    shouldPluralize={shouldPluralize}
                    addItemUrl={addItemUrl}
                  />
                  {totalPages > 0 && (
                    <StyledCollectionSort
                      totalPages={totalPages}
                      sortOptions={sortOptions}
                      qsParamName={sortByQsParamName}
                    />
                  )}
                  {result ? children(result.results || result) : null}
                  <Pagination
                    totalPages={totalPages}
                    activePage={routePage}
                    onPageClick={(clickedPage) => {
                      onPageClick(clickedPage)
                      task?.start({
                        onSuccessDispatch: PAGINATED_RESOURCE__ON_SUCCESS,
                        payload: {
                          ...payload,
                          limit: pageSize,
                          offset: (clickedPage - 1) * pageSize,
                        },
                      })
                    }}
                  />
                  {totalPages === 1 && <br />}
                </LoadingBox>
              ) : (
                <Task.Status name={name} id={id} />
              )}
              {hasZeroResults && <p data-test="no-results">{noResults}</p>}
            </>
          )
        }}
      </Task>
    )
  },
})

PaginatedResource.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  children: PropTypes.func,
  pageSize: PropTypes.number,
  payload: PropTypes.object,
}

export default PaginatedResource
