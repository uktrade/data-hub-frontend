import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
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
    id,
    children,
    pageSize = 10,
    payload = {},
    // State props
    onPageClick,
    currentPage,
    result,
  }) => (
    <Route>
      {({ location }) => {
        const qsParams = qs.parse(location.search.slice(1))
        const routePage = parseInt(qsParams.page, 10) || 1

        return (
          <Task>
            {(getTask) => {
              const task = getTask(name, id)
              return (
                <>
                  {currentPage && (
                    <Redirect
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
                        collectionName={name}
                      />
                      <StyledCollectionSort
                        totalPages={Math.floor(result.count / pageSize)}
                      />
                      {result ? children(result.results) : null}
                      <Pagination
                        totalPages={Math.ceil(result.count / pageSize)}
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
                    </LoadingBox>
                  ) : (
                    <Task.Status
                      name={name}
                      id={id}
                      startOnRender={{
                        payload: {
                          ...payload,
                          limit: pageSize,
                          offset: (routePage - 1) * pageSize,
                        },
                        onSuccessDispatch: PAGINATED_RESOURCE__ON_SUCCESS,
                      }}
                    />
                  )}
                </>
              )
            }}
          </Task>
        )
      }}
    </Route>
  ),
})

PaginatedResource.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  children: PropTypes.func,
  pageSize: PropTypes.number,
  payload: PropTypes.object,
}

export default PaginatedResource
