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
`

const StyledTableCell = styled(Table.Cell)`
  border: 0;
  padding-bottom: 0;
`

const StyledActiveInvestmentTableRow = styled(Table.Row)`
  border: 0;
`

const StyledActiveInvestmentTableBottomRow = styled(Table.Row)`
  border-bottom: 1px solid ${GREY_2};
`

const StyledActiveInvestmentHeadingTableCell = styled(Table.Cell)`
  border: 0;
  padding: 0;
`

const StyledActiveInvestmentHeadingTableCellHeader = styled(Table.CellHeader)`
  border: 0;
  padding-top: 10px;
  font-weight: 400;
`

const StyledActiveInvestmentTableCell = styled(Table.Cell)`
  border: 0;
`

let upcomingActiveInvestments = []

const ActiveInvestmentList = ({ props }) => {
  const allInvestments = props.resultList
  const allActiveInvestments = []
  for (const investment of allInvestments) {
    if (investment.stage.name === 'Active') {
      let newDate = new Date(investment.estimated_land_date)
      investment.estimated_land_date = newDate
      allActiveInvestments.push(investment)
    }
  }
  allActiveInvestments.sort(
    (dateA, dateB) =>
      Number(dateA.estimated_land_date) - Number(dateB.estimated_land_date)
  )
  if (allActiveInvestments.length > 3) {
    upcomingActiveInvestments = allActiveInvestments.slice(0, 3)
  } else {
    upcomingActiveInvestments = allActiveInvestments
    return allActiveInvestments
  }
  return upcomingActiveInvestments.map((activeInvestment) => {
    return (
      <>
        <StyledActiveInvestmentTableRow>
          <StyledActiveInvestmentHeadingTableCell colSpan={2}>
            <StyledActiveInvestmentSubject>
              <Link
                href={`/investments/projects/${activeInvestment.id}/details`}
                data-test="investment-page-link"
              >
                {activeInvestment.name}
              </Link>
            </StyledActiveInvestmentSubject>
          </StyledActiveInvestmentHeadingTableCell>
        </StyledActiveInvestmentTableRow>
        <StyledActiveInvestmentTableBottomRow>
          <StyledActiveInvestmentHeadingTableCellHeader colSpan={1}>
            Estimated land date
          </StyledActiveInvestmentHeadingTableCellHeader>
          <StyledActiveInvestmentTableCell colSpan={1}>
            {new Date(activeInvestment.estimated_land_date).toLocaleDateString(
              'en-GB',
              { month: 'long', year: 'numeric' }
            )}
          </StyledActiveInvestmentTableCell>
        </StyledActiveInvestmentTableBottomRow>
      </>
    )
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
        <StyledTableRow>
          <StyledTableCell colSpan={2}>
            There are no active investments
          </StyledTableCell>
        </StyledTableRow>
      )}

      <StyledTableRow>
        <StyledTableCell colSpan={2}>
          {props.stageList?.active ? (
            <Link
              href={`${queryString}/investments/projects`}
              data-test="investment-page-link"
            >
              View{' '}
              {props.stageList?.active > 3
                ? props.stageList.active - upcomingActiveInvestments.length
                : upcomingActiveInvestments.length}{' '}
              more active{' '}
              {props.stageList?.active - upcomingActiveInvestments.length > 1
                ? 'investments'
                : 'investment'}
            </Link>
          ) : (
            <Link
              href={`${queryString}/investments/projects`}
              data-test="investment-page-link"
            >
              View all investments
            </Link>
          )}
        </StyledTableCell>
      </StyledTableRow>
    </StyledSummaryTable>
  )
}

ActiveInvestmentProjectsCard.propTypes = {
  investment: PropTypes.object.isRequired,
}

export default connect(companyProjectsState2props)(ActiveInvestmentProjectsCard)
