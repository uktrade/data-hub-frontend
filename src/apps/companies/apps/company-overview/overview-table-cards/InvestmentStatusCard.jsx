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

const InvestmentStatusCard = ({ queryString }) => {
  return (
    <>
      <StyledSummaryTable
        caption="Investment Status"
        data-test="businessDetailsContainer"
      >
        <SummaryTable.Row heading="Last project won">
          23 Jan 2021
        </SummaryTable.Row>

        <SummaryTable.Row heading="Total projects won">3</SummaryTable.Row>
        <SummaryTable.Row heading="Prospect projects">2</SummaryTable.Row>
        <SummaryTable.Row heading="Verify win projects">2</SummaryTable.Row>
        <SummaryTable.Row heading="Abondoned projects">1</SummaryTable.Row>
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
  company: PropTypes.object.isRequired,
}

export default InvestmentStatusCard
