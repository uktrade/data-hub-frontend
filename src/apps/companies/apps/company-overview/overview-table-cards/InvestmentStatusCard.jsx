import React from 'react'
import { Link, Table } from 'govuk-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SummaryTable } from '../../../../../client/components'
import {
  TASK_GET_PROJECT_WON_COUNT,
  OVERVIEW_COMPANY_PROJECTS_LIST_ID,
  companyProjectsState2props,
} from './state'
import { OVERVIEW__COMPANY_INVESTMENT_WON_COUNT } from '../../../../../client/actions'
import Task from '../../../../../client/components/Task'
import { connect } from 'react-redux'

const StyledSummaryTable = styled(SummaryTable)`
  margin: 0;
  & > tbody th {
    width: 50%;
  }
`
const StyledTableRow = styled(Table.Row)`
  border: 0;
`
const StyledLastTableCell = styled(Table.Cell)`
  border: 0;
  padding-bottom: 0;
`
const InvestmentStatusCard = ({ queryString, companyId, ...props }) => {
  return (
    <>
      <Task.Status
        name={TASK_GET_PROJECT_WON_COUNT}
        id={OVERVIEW_COMPANY_PROJECTS_LIST_ID}
        progressMessage="Loading projects"
        startOnRender={{
          payload: { companyId },
          onSuccessDispatch: OVERVIEW__COMPANY_INVESTMENT_WON_COUNT,
        }}
      >
        {() => (
          <StyledSummaryTable
            caption="Investment Status"
            data-test="businessDetailsContainer"
          >
            <SummaryTable.Row heading="Last project won">
              23 Jan 2021
            </SummaryTable.Row>

            <SummaryTable.Row heading="Total projects won">
              {props.statusList?.won ? props.statusList.won : '0'}
            </SummaryTable.Row>
            <SummaryTable.Row heading="Active projects">
              {props.stageList?.active ? props.stageList.active : '0'}
            </SummaryTable.Row>
            <SummaryTable.Row heading="Prospect projects">
              {props.stageList?.prospect ? props.stageList.prospect : '0'}
            </SummaryTable.Row>
            <SummaryTable.Row heading="Verify win projects">
              {props.stageList?.verifyWin ? props.stageList.verifyWin : '0'}
            </SummaryTable.Row>
            <SummaryTable.Row heading="Abandoned projects">
              {props.statusList?.abandoned ? props.statusList.abandoned : '0'}
            </SummaryTable.Row>
            <StyledTableRow>
              <StyledLastTableCell colSpan={2}>
                <Link
                  href={`${queryString}/investments`}
                  data-test="investment-page-link"
                >
                  View full investment details
                </Link>
              </StyledLastTableCell>
            </StyledTableRow>
          </StyledSummaryTable>
        )}
      </Task.Status>
    </>
  )
}

InvestmentStatusCard.propTypes = {
  investment: PropTypes.object.isRequired,
}

export default connect(companyProjectsState2props)(InvestmentStatusCard)
