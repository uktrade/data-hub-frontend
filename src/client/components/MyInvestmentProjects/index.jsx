import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { ID, TASK_GET_MY_INVESTMENTS_LIST, state2props } from './state'
import {
  MY_INVESTMENTS__LIST_LOADED,
  MY_INVESTMENTS__PAGE_SELECTED,
} from '../../actions'
import Task from '../Task'

import InvestmentListHeader from './InvestmentListHeader'
import InvestmentList from './InvestmentList'
import Pagination from '../Pagination/'

const MyInvestmentProjects = ({
  results,
  count,
  itemsPerPage,
  page,
  onPageClick,
  adviser,
}) => (
  <article>
    <InvestmentListHeader />
    <Task.Status
      name={TASK_GET_MY_INVESTMENTS_LIST}
      id={ID}
      progressMessage="Loading your investment projects"
      startOnRender={{
        payload: {
          page,
          adviser,
        },
        onSuccessDispatch: MY_INVESTMENTS__LIST_LOADED,
      }}
    >
      {() => (
        <>
          <InvestmentList items={results} />
          <Pagination
            totalPages={Math.ceil(count / itemsPerPage)}
            activePage={page}
            onPageClick={onPageClick}
          />
        </>
      )}
    </Task.Status>
  </article>
)

MyInvestmentProjects.propTypes = {
  results: PropTypes.array.isRequired,
  count: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onPageClick: PropTypes.func.isRequired,
  adviser: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
}

export default connect(state2props, (dispatch) => ({
  onPageClick: (page) => {
    dispatch({
      type: MY_INVESTMENTS__PAGE_SELECTED,
      page,
    })
  },
}))(MyInvestmentProjects)
