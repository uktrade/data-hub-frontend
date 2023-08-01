import React from 'react'
import { Link } from 'govuk-react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { SummaryTable } from '../../../../../client/components'
import {
  TASK_GET_PROJECT_WON_COUNT,
  OVERVIEW_COMPANY_PROJECTS_LIST_ID,
  companyProjectsState2props,
} from './state'
import { OVERVIEW__COMPANY_INVESTMENT_WON_COUNT } from '../../../../../client/actions'
import urls from '../../../../../lib/urls'
import Task from '../../../../../client/components/Task'
import {
  StyledLastTableCell,
  StyledSpan,
  StyledSummaryTable,
  StyledTableRow,
} from './components'

const { format } = require('../../../../../client/utils/date')

const buildProjectStatusUrl = (companyId, param) =>
  urls.companies.investments.companyInvestmentProjects(companyId) + param

const buildProjectCountCell = (
  list,
  heading,
  urlParam,
  companyId,
  dataTest
) => (
  <SummaryTable.Row heading={heading}>
    {list ? (
      <Link
        href={buildProjectStatusUrl(companyId, urlParam)}
        data-test={dataTest}
      >
        {list}
      </Link>
    ) : (
      '0'
    )}
  </SummaryTable.Row>
)

const InvestmentStatusCard = ({
  companyId,
  summary,
  statusList,
  stageList,
}) => (
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
                href={urls.investments.projects.details(
                  summary.won.last_won_project.id
                )}
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
          {buildProjectCountCell(
            statusList?.won,
            'Total projects won',
            '?page=1&sortby=created_on%3Adesc&stage%5B0%5D=945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
            companyId,
            'total-project-won'
          )}
          {buildProjectCountCell(
            stageList?.active,
            'Active projects',
            '?page=1&sortby=created_on%3Adesc&stage%5B0%5D=7606cc19-20da-4b74-aba1-2cec0d753ad8',
            companyId,
            'total-active-projects'
          )}
          {buildProjectCountCell(
            stageList?.prospect,
            'Prospect projects',
            '?page=1&sortby=created_on%3Adesc&stage%5B0%5D=8a320cc9-ae2e-443e-9d26-2f36452c2ced',
            companyId,
            'total-prospect-projects'
          )}
          {buildProjectCountCell(
            stageList?.verifyWin,
            'Verify win projects',
            '?page=1&sortby=created_on%3Adesc&stage%5B0%5D=49b8f6f3-0c50-4150-a965-2c974f3149e3',
            companyId,
            'total-verify-win-projects'
          )}
          {buildProjectCountCell(
            statusList?.abandoned,
            'Abandoned projects',
            '?page=1&sortby=created_on%3Adesc&status%5B0%5D=abandoned',
            companyId,
            'total-abandoned-projects'
          )}
          <StyledTableRow>
            <StyledLastTableCell colSpan={2}>
              <Link
                href={urls.companies.investments.companyInvestmentProjectsWithSearch(
                  companyId
                )}
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

InvestmentStatusCard.propTypes = {
  companyId: PropTypes.string.isRequired,
}

export default connect(companyProjectsState2props)(InvestmentStatusCard)
