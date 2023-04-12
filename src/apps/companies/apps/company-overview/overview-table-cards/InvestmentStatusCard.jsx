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

const { format } = require('../../../../../client/utils/date')

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
const StyledSpan = styled('span')`
  color: grey;
`

const InvestmentStatusCard = ({
  queryString,
  companyId,
  summary,
  statusList,
  stageList,
}) => {
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
            caption="Investment status"
            data-test="investmentsStatusContainer"
          >
            <SummaryTable.Row heading="Last Project won">
              {summary?.won?.last_won_project?.id != null ? (
                <div>
                  <Link
                    href={`/investments/projects/${summary.won.last_won_project.id}`}
                    data-test="latest-won-project-link"
                  >
                    {format(summary.won.last_won_project.last_changed)}
                  </Link>
                  <br />
                  <Link
                    href={`/investments/projects/${summary.won.last_won_project.id}`}
                  >
                    {summary.won.last_won_project.name}
                  </Link>
                </div>
              ) : (
                <StyledSpan>None</StyledSpan>
              )}
            </SummaryTable.Row>
            <SummaryTable.Row heading="Total projects won">
              {statusList?.won ? statusList.won : '0'}
            </SummaryTable.Row>
            <SummaryTable.Row heading="Active projects">
              {stageList?.active ? stageList.active : '0'}
            </SummaryTable.Row>
            <SummaryTable.Row heading="Prospect projects">
              {stageList?.prospect ? stageList.prospect : '0'}
            </SummaryTable.Row>
            <SummaryTable.Row heading="Verify win projects">
              {stageList?.verifyWin ? stageList.verifyWin : '0'}
            </SummaryTable.Row>
            <SummaryTable.Row heading="Abandoned projects">
              {statusList?.abandoned ? statusList.abandoned : '0'}
            </SummaryTable.Row>
            <StyledTableRow>
              <StyledLastTableCell colSpan={2}>
                <Link
                  href={`${queryString}/investments/projects`}
                  data-test="investment-page-link"
                >
                  View all investments
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
