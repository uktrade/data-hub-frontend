import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import qs from 'qs'

import Task from '../../../components/Task'
import Pagination from '../../../components/Pagination'

import { EXPORT__PIPELINE_LIST_LOADED } from '../../../actions'
import { ID, TASK_GET_EXPORT_PIPELINE_LIST, state2props } from './state'
import { parsePage } from '../../../../client/utils/pagination.js'

import List from './List'
import ListItemRenderer from './ItemRenderer'

const ExportList = ({ count, results, itemsPerPage, maxItemsToPaginate }) => {
  const history = useHistory()
  const location = useLocation()

  const qsParams = qs.parse(location.search.slice(1))
  const initialPage = parsePage(qsParams.page)
  const maxItems = Math.min(count, maxItemsToPaginate)
  const totalPages = Math.ceil(maxItems / itemsPerPage)

  return (
    <Task.Status
      name={TASK_GET_EXPORT_PIPELINE_LIST}
      id={ID}
      progressMessage="loading export pipeline list"
      startOnRender={{
        payload: {
          page: initialPage,
        },
        onSuccessDispatch: EXPORT__PIPELINE_LIST_LOADED,
      }}
    >
      {() => (
        <>
          <List items={results} itemRenderer={ListItemRenderer} />
          <Pagination
            totalPages={totalPages}
            activePage={initialPage}
            onPageClick={(page, e) => {
              e.preventDefault()
              history.push({
                search: qs.stringify({
                  ...qsParams,
                  page,
                }),
              })
            }}
          />
        </>
      )}
    </Task.Status>
  )
}

ExportList.propTypes = {
  count: PropTypes.number,
  results: PropTypes.array,
  itemsPerPage: PropTypes.number,
  maxItemsToPaginate: PropTypes.number,
}

export default connect(state2props)(ExportList)
