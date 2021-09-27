import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Paragraph } from 'govuk-react'
import { GREY_1 } from 'govuk-colours'
import { MEDIA_QUERIES, SPACING } from '@govuk-react/constants'

import { ID, TASK_GET_MY_INVESTMENTS_LIST, state2props } from './state'
import {
  MY_INVESTMENTS__LIST_LOADED,
  MY_INVESTMENTS__PAGINATION_CLICK,
  MY_INVESTMENTS__STAGE_CHANGE,
  MY_INVESTMENTS__STATUS_CHANGE,
  MY_INVESTMENTS__SORT_CHANGE,
  MY_INVESTMENTS__SHOW_DETAILS_CHANGE,
} from '../../actions'
import Task from '../Task'

import InvestmentListShowDetails from './InvestmentListShowDetails'
import InvestmentListFilter from './InvestmentListFilter'
import InvestmentList from './InvestmentList'
import Pagination from '../Pagination/'

import {
  PROJECT_STATUS_OPTIONS,
  STAGE_OPTIONS,
  SORT_OPTIONS,
} from './constants'

const StyledHeader = styled('header')({
  [MEDIA_QUERIES.DESKTOP]: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: `-${SPACING.SCALE_1} -${SPACING.SCALE_2}`,
  },
})

const StyledParagraph = styled(Paragraph)`
  margin-top: ${SPACING.SCALE_3};
`

const StyledListContainer = styled('div')`
  border-top: 2px solid ${GREY_1};
  margin-top: ${SPACING.SCALE_3};
`

const MyInvestmentProjects = ({
  results,
  count,
  itemsPerPage,
  page,
  stage,
  status,
  sort,
  onSortChange,
  onStageChange,
  onStatusChange,
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
        label="Stage"
        options={STAGE_OPTIONS}
        initialValue={stage}
        onChange={(event) => onStageChange(event.target.value)}
      />
      <InvestmentListFilter
        label="Status"
        options={PROJECT_STATUS_OPTIONS}
        initialValue={status}
        onChange={(event) => onStatusChange(event.target.value)}
      />
      <InvestmentListFilter
        label="Sort"
        options={SORT_OPTIONS}
        initialValue={sort}
        onChange={(event) => onSortChange(event.target.value)}
      />
    </StyledHeader>
    <StyledListContainer>
      <Task.Status
        name={TASK_GET_MY_INVESTMENTS_LIST}
        id={ID}
        progressMessage="Loading your investment projects"
        startOnRender={{
          payload: {
            adviser,
            page,
            stage,
            status,
            sort,
          },
          onSuccessDispatch: MY_INVESTMENTS__LIST_LOADED,
        }}
      >
        {() => {
          const totalPages = Math.ceil(count / itemsPerPage)
          return (
            <>
              {results.length ? (
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
              ) : (
                <StyledParagraph>No investment projects</StyledParagraph>
              )}
            </>
          )
        }}
      </Task.Status>
    </StyledListContainer>
  </article>
)

MyInvestmentProjects.propTypes = {
  results: PropTypes.array.isRequired,
  count: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onStageChange: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
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
  onStageChange: (stage) =>
    dispatch({
      type: MY_INVESTMENTS__STAGE_CHANGE,
      stage,
      page: 1,
    }),
  onStatusChange: (status) =>
    dispatch({
      type: MY_INVESTMENTS__STATUS_CHANGE,
      status,
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
