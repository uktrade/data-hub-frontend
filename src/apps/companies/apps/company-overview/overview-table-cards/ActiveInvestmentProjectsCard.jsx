import React from 'react'
import { Link, Table } from 'govuk-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SummaryTable } from '../../../../../client/components'
import { FONT_SIZE, FONT_WEIGHTS } from '@govuk-react/constants'
import { companyProjectsState2props } from './state'
import { connect } from 'react-redux'

import { BLUE, GREY_2 } from '../../../../../client/utils/colours'

const StyledActiveInvestmentSubject = styled('h3')`
  font-size: ${FONT_SIZE.SIZE_20};
  font-weight: ${FONT_WEIGHTS.bold};
  line-height: ${FONT_SIZE.SIZE_24};
  margin-top: 10px;
  margin-bottom: 0;
  & > a:link,
  a:visited,
  a:hover,
  a:active {
    text-decoration: none;
    color: ${BLUE};
  }
`

const StyledSummaryTable = styled(SummaryTable)`
  margin: 0;
  & > tbody th {
    width: 50%;
  }
`
const StyledTableRow = styled(Table.Row)`
  border: 0;
  & > tbody tr {
    width: 50%;
  }
`
const StyledLastTableRow = styled(Table.Row)`
  border-bottom: 1px solid ${GREY_2};
`
const StyledTableCell = styled(Table.Cell)`
  border: 0;
  padding: 0;
`

const StyledLastTableCell = styled(Table.Cell)`
  border: 0;
  padding-top: 0;
  padding-bottom: 10px;
`

const StyledCardLastTableCell = styled(Table.Cell)`
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
    (dateA, dateB) =>
      Number(dateA.estimated_land_date) - Number(dateB.estimated_land_date)
  )
  return allInvestmentResults.map((investment) => {
    if (investment.stage.name === 'Active') {
      return (
        <>
          <StyledTableRow>
            <StyledTableCell colSpan={2}>
              <StyledActiveInvestmentSubject>
                <Link
                  href={`/investments/projects/${investment.id}/details`}
                  data-test="investment-page-link"
                >
                  {investment.name}
                </Link>
              </StyledActiveInvestmentSubject>
            </StyledTableCell>
          </StyledTableRow>
          <StyledLastTableRow>
            <StyledLastTableCell colSpan={1}>
              Estimated land date
            </StyledLastTableCell>
            <StyledLastTableCell colSpan={1}>
              {new Date(investment.estimated_land_date).toLocaleDateString(
                'en-GB',
                { month: 'long', year: 'numeric' }
              )}
            </StyledLastTableCell>
          </StyledLastTableRow>
        </>
      )
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
      {props.stageList?.active ? (
        <ActiveInvestmentList props={props} />
      ) : (
        'No active investments'
      )}

      <StyledTableRow>
        <StyledCardLastTableCell colSpan={2}>
          <Link
            href={`${queryString}/investments/projects`}
            data-test="investment-page-link"
          >
            View {props.stageList?.active ? props.stageList.active : '0'} more
            active investments
          </Link>
        </StyledCardLastTableCell>
      </StyledTableRow>
    </StyledSummaryTable>
  )
}

ActiveInvestmentProjectsCard.propTypes = {
  investment: PropTypes.object.isRequired,
}

export default connect(companyProjectsState2props)(ActiveInvestmentProjectsCard)
