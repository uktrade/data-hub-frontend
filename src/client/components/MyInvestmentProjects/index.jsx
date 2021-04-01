import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { MEDIA_QUERIES, SPACING } from '@govuk-react/constants'

import { ID, TASK_GET_MY_INVESTMENTS_LIST, state2props } from './state'
import {
  MY_INVESTMENTS__LIST_LOADED,
  MY_INVESTMENTS__PAGINATION_CLICK,
  MY_INVESTMENTS__FILTER_CHANGE,
  MY_INVESTMENTS__SORT_CHANGE,
  MY_INVESTMENTS__SHOW_DETAILS_CHANGE,
} from '../../actions'
import Task from '../Task'

import InvestmentListShowDetails from './InvestmentListShowDetails'
import InvestmentListFilter from './InvestmentListFilter'
import InvestmentListSort from './InvestmentListSort'
import InvestmentList from './InvestmentList'
import Pagination from '../Pagination/'

import { STAGE_OPTIONS, SORT_OPTIONS } from './constants'

const StyledHeader = styled('header')`
  select {
    width: 100%;
  }
  ${MEDIA_QUERIES.TABLET} {
    label:first-child {
      margin-bottom: ${SPACING.SCALE_2};
      span {
        padding-right: ${SPACING.SCALE_2};
      }
    }
  }
  ${MEDIA_QUERIES.DESKTOP} {
    display: inline-flex;
    label:first-child {
      margin: 0 ${SPACING.SCALE_6} 0 0;
      span {
        padding-right: 0;
      }
    }
  }
`

const MyInvestmentProjects = ({
  results,
  count,
  itemsPerPage,
  page,
  filter,
  sort,
  onSortChange,
  onFilterChange,
  onPaginationClick,
  onShowDetailsChange,
  adviser,
  showDetails,
}) => (
  <article>
    <StyledHeader>
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
    </StyledHeader>
    <Task.Status
      name={TASK_GET_MY_INVESTMENTS_LIST}
      id={ID}
      progressMessage="Loading your investment projects"
      startOnRender={{
        payload: {
          adviser,
          page,
          filter,
          sort,
        },
        onSuccessDispatch: MY_INVESTMENTS__LIST_LOADED,
      }}
    >
      {() => {
        const totalPages = Math.ceil(count / itemsPerPage)
        return (
          <>
            <InvestmentList
              data-test="my-investment-projects-list"
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
  adviser: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
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
