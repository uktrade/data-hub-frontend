import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { state2props } from './state'
import {
  MY_INVESTMENTS__PAGINATION_CLICK,
  MY_INVESTMENTS__FILTER_CHANGE,
  MY_INVESTMENTS__SORT_CHANGE,
  MY_INVESTMENTS__SHOW_DETAILS_CHANGE,
} from '../../actions'
import Task from '../Task'

import InvestmentListShowDetails from './InvestmentListShowDetails'
import InvestmentListHeader from './InvestmentListHeader'
import InvestmentListFilter from './InvestmentListFilter'
import InvestmentListSort from './InvestmentListSort'
import InvestmentList from './InvestmentList'
import Pagination from '../Pagination/'

import { STAGE_OPTIONS, SORT_OPTIONS } from './constants'

const MyInvestmentProjects = ({
  results,
  count,
  page,
  itemsPerPage,
  onSortChange,
  onFilterChange,
  onPaginationClick,
  onShowDetailsChange,
  showDetails,
  myInvestmentProjectTaskProps,
}) => (
  <article>
    <InvestmentListHeader>
      {false && (
        <InvestmentListShowDetails
          onChange={(event) => onShowDetailsChange(event.target.checked)}
          checked={showDetails}
          disabled={!results.length}
        >
          Show details
        </InvestmentListShowDetails>
      )}
      <InvestmentListFilter
        options={STAGE_OPTIONS}
        onChange={(event) => onFilterChange(event.target.value)}
      />
      <InvestmentListSort
        options={SORT_OPTIONS}
        onChange={(event) => onSortChange(event.target.value)}
      />
    </InvestmentListHeader>
    <Task.Status {...myInvestmentProjectTaskProps}>
      {() => {
        const totalPages = Math.ceil(count / itemsPerPage)
        return (
          <>
            <InvestmentList
              items={results}
              isPaginated={totalPages > 1}
              showDetails={showDetails}
            />
            <Pagination
              totalPages={totalPages}
              activePage={page}
              onPageClick={onPaginationClick}
            />
          </>
        )
      }}
    </Task.Status>
  </article>
)

MyInvestmentProjects.propTypes = {
  results: PropTypes.array.isRequired,
  count: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onPaginationClick: PropTypes.func.isRequired,
  onShowDetailsChange: PropTypes.func.isRequired,
  showDetails: PropTypes.bool.isRequired,
}

export default connect(state2props, (dispatch) => ({
  onShowDetailsChange: (showDetails) => {
    dispatch({
      type: MY_INVESTMENTS__SHOW_DETAILS_CHANGE,
      showDetails,
    })
  },
  onFilterChange: (filter) =>
    dispatch({
      type: MY_INVESTMENTS__FILTER_CHANGE,
      filter,
      page: 1,
    }),
  onSortChange: (sort) =>
    dispatch({
      type: MY_INVESTMENTS__SORT_CHANGE,
      sort,
      page: 1,
    }),
  onPaginationClick: (page) =>
    dispatch({
      type: MY_INVESTMENTS__PAGINATION_CLICK,
      page,
    }),
}))(MyInvestmentProjects)
