import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { GridCol, GridRow, Paragraph } from 'govuk-react'
import { MEDIA_QUERIES, SPACING } from '@govuk-react/constants'

import { MID_GREY } from '../../utils/colours'

import { ID, TASK_GET_MY_INVESTMENTS_LIST, state2props } from './state'
import {
  MY_INVESTMENTS__LIST_LOADED,
  MY_INVESTMENTS__PAGINATION_CLICK,
  MY_INVESTMENTS__STAGE_CHANGE,
  MY_INVESTMENTS__STATUS_CHANGE,
  MY_INVESTMENTS__LAND_DATE_CHANGE,
  MY_INVESTMENTS__SORT_CHANGE,
  MY_INVESTMENTS__SHOW_DETAILS_CHANGE,
  MY_INVESTMENTS__SAVE_TO_SESSION,
  MY_INVESTMENTS__GET_FROM_SESSION,
} from '../../actions'
import Task from '../Task'

import InvestmentListShowDetails from './InvestmentListShowDetails'
import InvestmentListSelect from './InvestmentListSelect'
import InvestmentList from './InvestmentList'
import Pagination from '../Pagination/'
import InvestmentProjectSummary from '../MyInvestmentProjects/InvestmentProjectSummary'

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
  border-top: 1px solid ${MID_GREY};
  margin-top: ${SPACING.SCALE_3};
`

const StyledCol = styled(GridCol)(() => ({
  paddingBottom: SPACING.SCALE_3,
}))

const MyInvestmentProjects = ({
  results,
  count,
  itemsPerPage,
  page,
  stage,
  status,
  landDateOptions,
  landDate,
  sort,
  onLoad,
  onSortChange,
  onStageChange,
  onStatusChange,
  onLandDateChange,
  onPaginationClick,
  onShowDetailsChange,
  adviser,
  showDetails,
}) => {
  useEffect(() => {
    onLoad()
  }, [])
  return (
    <>
      <GridRow>
        <StyledCol setWidth="one-third">
          <InvestmentProjectSummary adviser={adviser} />
        </StyledCol>

        <GridCol>
          <article>
            <StyledHeader>
              {false && (
                <InvestmentListShowDetails
                  onChange={(event) =>
                    onShowDetailsChange(event.target.checked)
                  }
                  checked={showDetails}
                  disabled={!results.length}
                >
                  Show details
                </InvestmentListShowDetails>
              )}

              <InvestmentListSelect
                id="my-projects-stage-label"
                input={{ id: 'my-projects-stage-select' }}
                data-test="stage-select"
                label="Stage"
                options={STAGE_OPTIONS}
                initialValue={stage}
                onChange={(event) => onStageChange(event.target.value)}
              />

              <InvestmentListSelect
                id="my-projects-status-label"
                input={{ id: 'my-projects-status-select' }}
                data-test="status-select"
                label="Status"
                options={PROJECT_STATUS_OPTIONS}
                initialValue={status}
                onChange={(event) => onStatusChange(event.target.value)}
              />
              <InvestmentListSelect
                id="my-projects-land-date-label"
                input={{ id: 'my-projects-land-date-select' }}
                data-test="land-date-select"
                label="Land date"
                options={landDateOptions}
                initialValue={landDate}
                onChange={(event) => onLandDateChange(event.target.value)}
              />
              <InvestmentListSelect
                id="my-projects-sort-label"
                input={{ id: 'my-projects-sort-select' }}
                data-test="sort-select"
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
                    landDate,
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
                        <StyledParagraph>
                          No investment projects
                        </StyledParagraph>
                      )}
                    </>
                  )
                }}
              </Task.Status>
            </StyledListContainer>
          </article>
        </GridCol>
      </GridRow>
    </>
  )
}

MyInvestmentProjects.propTypes = {
  results: PropTypes.array.isRequired,
  count: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onStageChange: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onLandDateChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onPaginationClick: PropTypes.func.isRequired,
  onShowDetailsChange: PropTypes.func.isRequired,
  adviser: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  showDetails: PropTypes.bool.isRequired,
}

export default connect(state2props, (dispatch) => ({
  onLoad: () => {
    dispatch({
      type: MY_INVESTMENTS__GET_FROM_SESSION,
    })
  },
  onShowDetailsChange: (showDetails) => {
    dispatch({
      type: MY_INVESTMENTS__SHOW_DETAILS_CHANGE,
      showDetails,
    })
  },
  onStageChange: (stage) => {
    dispatch({
      type: MY_INVESTMENTS__STAGE_CHANGE,
      stage,
      page: 1,
    })
    dispatch({
      type: MY_INVESTMENTS__SAVE_TO_SESSION,
      stage,
      page: 1,
    })
  },
  onStatusChange: (status) => {
    dispatch({
      type: MY_INVESTMENTS__STATUS_CHANGE,
      status,
      page: 1,
    })
    dispatch({
      type: MY_INVESTMENTS__SAVE_TO_SESSION,
      status,
      page: 1,
    })
  },
  onLandDateChange: (landDate) => {
    dispatch({
      type: MY_INVESTMENTS__LAND_DATE_CHANGE,
      landDate,
      page: 1,
    })
    dispatch({
      type: MY_INVESTMENTS__SAVE_TO_SESSION,
      landDate,
      page: 1,
    })
  },
  onSortChange: (sort) => {
    dispatch({
      type: MY_INVESTMENTS__SORT_CHANGE,
      sort,
      page: 1,
    })
    dispatch({
      type: MY_INVESTMENTS__SAVE_TO_SESSION,
      sort,
      page: 1,
    })
  },
  onPaginationClick: (page) => {
    dispatch({
      type: MY_INVESTMENTS__PAGINATION_CLICK,
      page,
    })
    dispatch({
      type: MY_INVESTMENTS__SAVE_TO_SESSION,
      page,
    })
  },
}))(MyInvestmentProjects)
