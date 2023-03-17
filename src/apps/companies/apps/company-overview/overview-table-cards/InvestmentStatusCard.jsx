import React from 'react'
import { Link, Table } from 'govuk-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SummaryTable } from '../../../../../client/components'

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
let prospectCounter = 0
let wonCounter = 0
let verifyWinCounter = 0
let abandonedCounter = 0
let activeCounter = 0
let latestWon = ''
const calculateInvestment = (investmentList) => {
  for (let x = 0; x < investmentList.length; x++) {
    for (let i = 0; i < investmentList[x].badges.length; i++) {
      if (investmentList[x].badges[i].text === 'Prospect') {
        prospectCounter++
      }
      if (investmentList[x].badges[i].text === 'won') {
        wonCounter++
        if (latestWon.length < 1) {
          latestWon = investmentList[x]
        }
      }
      if (investmentList[x].badges[i].text === 'Verify win') {
        verifyWinCounter++
      }
      if (investmentList[x].badges[i].text === 'abandoned') {
        abandonedCounter++
      }
      if (investmentList[x].badges[i].text === 'Active') {
        activeCounter++
      }
    }
  }
}

const InvestmentStatusCard = ({ queryString, investment }) => {
  calculateInvestment(investment)
  return (
    <>
      <StyledSummaryTable
        caption="Investment Status"
        data-test="businessDetailsContainer"
      >
        <SummaryTable.Row heading="Last project won">
          23 Jan 2021
        </SummaryTable.Row>

        <SummaryTable.Row heading="Total projects won">
          {wonCounter}
        </SummaryTable.Row>
        <SummaryTable.Row heading="Active projects">
          {activeCounter}
        </SummaryTable.Row>
        <SummaryTable.Row heading="Prospect projects">
          {prospectCounter}
        </SummaryTable.Row>
        <SummaryTable.Row heading="Verify win projects">
          {verifyWinCounter}
        </SummaryTable.Row>
        <SummaryTable.Row heading="Abondoned projects">
          {abandonedCounter}
        </SummaryTable.Row>
        <StyledTableRow>
          <StyledLastTableCell colSpan={2}>
            <Link
              href={`${queryString}/business-details`}
              data-test="business-page-link"
            >
              View full business details
            </Link>
          </StyledLastTableCell>
        </StyledTableRow>
      </StyledSummaryTable>
    </>
  )
}

InvestmentStatusCard.propTypes = {
  investment: PropTypes.object.isRequired,
}

export default InvestmentStatusCard
