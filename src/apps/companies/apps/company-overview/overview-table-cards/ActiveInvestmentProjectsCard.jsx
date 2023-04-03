import React from 'react'
import { Link, Table } from 'govuk-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SummaryTable } from '../../../../../client/components'
import { companyProjectsState2props } from './state'
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

const ActiveInvestmentList = ({ props }) => {
  const allInvestmentResults = props.resultList
  for (const i of allInvestmentResults) {
    let newDate = new Date(i.estimated_land_date)
    i.estimated_land_date = newDate
  }
  allInvestmentResults.sort(
    (objA, objB) =>
      Number(objA.estimated_land_date) - Number(objB.estimated_land_date)
  )
  return allInvestmentResults.map((investment) => {
    if (investment.stage.name === 'Active') {
      return (
        <>
          <StyledTableRow>
            <StyledLastTableCell colSpan={2}>
              <Link href={`#`} data-test="investment-page-link">
                {investment.name}
              </Link>
            </StyledLastTableCell>
          </StyledTableRow>
          <StyledTableRow>
            <StyledLastTableCell colSpan={1}>
              Estimated land date
            </StyledLastTableCell>
            <StyledLastTableCell colSpan={1}>
              {new Date(investment.estimated_land_date).toString()}
            </StyledLastTableCell>
          </StyledTableRow>
          <StyledTableRow>
            <StyledLastTableCell colSpan={1}>
              Last interaction date
            </StyledLastTableCell>
            <StyledLastTableCell colSpan={1}>Need to sort</StyledLastTableCell>
          </StyledTableRow>
        </>
      )
      // console.log(
      //   '//////////',
      //   investment.name,
      //   `'Estimated land date' ${investment.estimated_land_date}`,
      //   `'Last interaction date' ${investment.modified_on}`,
      //   investment,
      //   index
      // )
    }
  })
}

const ActiveInvestmentProjectsCard = ({
  queryString,
  companyId,
  company,
  ...props
}) => {
  return (
    <StyledSummaryTable
      caption="Active investment projects"
      data-test="investmentsStatusContainer"
    >
      <StyledTableRow>
        {props.stageList?.active ? (
          <ActiveInvestmentList props={props} />
        ) : (
          'No active investments'
        )}
      </StyledTableRow>
      <StyledTableRow>
        <StyledLastTableCell colSpan={2}>
          <Link
            href={`${queryString}/investments/projects`}
            data-test="investment-page-link"
          >
            View {props.stageList?.active ? props.stageList.active : '0'} more
            active investments
          </Link>
        </StyledLastTableCell>
      </StyledTableRow>
    </StyledSummaryTable>
  )
}

ActiveInvestmentProjectsCard.propTypes = {
  investment: PropTypes.object.isRequired,
}

export default connect(companyProjectsState2props)(ActiveInvestmentProjectsCard)
