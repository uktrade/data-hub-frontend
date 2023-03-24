import React from 'react'
import { Link, Table } from 'govuk-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SummaryTable } from '../../../../../client/components'
import { TASK_GET_PROJECTS_LIST, companyProjectsState2props } from './state'
import { OVERVIEW__COMPANY_INVESTMENT_WON_COUNT } from '../../../../../client/actions'
import Task from '../../../../../client/components/Task'
import { connect } from 'react-redux'
import { COMPANY_PROJECTS_LIST_ID } from '../../../../investments/client/projects/state'

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

const ActiveInvestmentProjectsCard = ({
  queryString,
  companyId,
  company,
  ...props
}) => {
  return (
    <>
      <Task.Status
        name={TASK_GET_PROJECTS_LIST}
        id={COMPANY_PROJECTS_LIST_ID}
        progressMessage="Loading projects"
        startOnRender={{
          payload: { companyId },
          onSuccessDispatch: OVERVIEW__COMPANY_INVESTMENT_WON_COUNT,
        }}
      >
        {() => (
          <StyledSummaryTable
            caption="Active investment projects"
            data-test="investmentsStatusContainer"
          >
            <StyledTableRow>content goes here</StyledTableRow>
            <StyledTableRow>
              <StyledLastTableCell colSpan={2}>
                <Link
                  href={`${queryString}/investments/projects`}
                  data-test="investment-page-link"
                >
                  View {props.stageList?.active ? props.stageList.active : '0'}{' '}
                  more active investments
                </Link>
              </StyledLastTableCell>
            </StyledTableRow>
          </StyledSummaryTable>
        )}
      </Task.Status>
    </>
  )
}

ActiveInvestmentProjectsCard.propTypes = {
  investment: PropTypes.object.isRequired,
}

export default connect(companyProjectsState2props)(ActiveInvestmentProjectsCard)
