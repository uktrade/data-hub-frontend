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
import { GREY_1 } from '../../../../../client/utils/colours'

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
  color: ${GREY_1};
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
                <Link
                  href={`/investments/projects/${summary.won.last_won_project.id}`}
                  data-test="latest-won-project-link"
                >
                  {`${format(summary.won.last_won_project.last_changed)} - ${
                    summary.won.last_won_project.name
                  }`}
                </Link>
              ) : (
                <StyledSpan>None</StyledSpan>
              )}
            </SummaryTable.Row>
            <SummaryTable.Row heading="Total projects won">
              {statusList?.won ? (
                <Link
                  href={`/companies/${companyId}/investments/projects?page=1&sortby=created_on%3Adesc&stage%5B0%5D=945ea6d1-eee3-4f5b-9144-84a75b71b8e6`}
                  data-test="total-project-won"
                >
                  {statusList.won}
                </Link>
              ) : (
                '0'
              )}
            </SummaryTable.Row>
            <SummaryTable.Row heading="Active projects">
              {stageList?.active ? (
                <Link
                  href={`/companies/${companyId}/investments/projects?page=1&sortby=created_on%3Adesc&stage%5B0%5D=7606cc19-20da-4b74-aba1-2cec0d753ad8`}
                  data-test="total-active-projects"
                >
                  {stageList.active}
                </Link>
              ) : (
                '0'
              )}
            </SummaryTable.Row>
            <SummaryTable.Row heading="Prospect projects">
              {stageList?.prospect ? (
                <Link
                  href={`/companies/${companyId}/investments/projects?page=1&sortby=created_on%3Adesc&stage%5B0%5D=8a320cc9-ae2e-443e-9d26-2f36452c2ced`}
                  data-test="total-prospect-projects"
                >
                  {stageList.prospect}
                </Link>
              ) : (
                '0'
              )}
            </SummaryTable.Row>
            <SummaryTable.Row heading="Verify win projects">
              {stageList?.verifyWin ? (
                <Link
                  href={`/companies/${companyId}/investments/projects?page=1&sortby=created_on%3Adesc&stage%5B0%5D=49b8f6f3-0c50-4150-a965-2c974f3149e3`}
                  data-test="total-verify-win-projects"
                >
                  {stageList.verifyWin}
                </Link>
              ) : (
                '0'
              )}
            </SummaryTable.Row>
            <SummaryTable.Row heading="Abandoned projects">
              {statusList?.abandoned ? (
                <Link
                  href={`/companies/${companyId}/investments/projects?page=1&sortby=created_on%3Adesc&status%5B0%5D=abandoned`}
                  data-test="total-abandoned-projects"
                >
                  {statusList.abandoned}
                </Link>
              ) : (
                '0'
              )}
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
