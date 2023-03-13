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
const StyledTD = styled('td')`
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  border: 0;
`

const StyledLastTableCell = styled(Table.Cell)`
  border: 0;
  padding-bottom: 0;
`
const StyledSpan = styled('span')`
  color: grey;
`

const StyledLink = styled(Link)`
  color: grey;
`
const GreenLabel = styled('label')`
  background-color: #cce2d9;
  color: #005b30;
  padding: 4px;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 14px;
`

export const SUBSEGMENT = {
  sustain_nurture_and_grow: 'Sustain: Nurture & grow',
  sustain_develop_export_capability: '',
}

const ExportStatus = ({ company, queryString }) => {
  return (
    <StyledSummaryTable
      caption="Export status"
      data-test="exportStatusContainer"
    >
      <SummaryTable.Row heading="Export potential">
        {company.export_potential ? (
          <GreenLabel>{company.export_potential}</GreenLabel>
        ) : (
          <StyledSpan>Not set</StyledSpan>
        )}
      </SummaryTable.Row>
      <SummaryTable.Row heading="Export sub-segment">
        {company.export_sub_segment ? (
          <StyledTD>
            <GreenLabel>{SUBSEGMENT[company.export_sub_segment]}</GreenLabel>
          </StyledTD>
        ) : (
          <StyledSpan>Not set</StyledSpan>
        )}
      </SummaryTable.Row>
      <SummaryTable.Row heading="Currently exporting to">
        {company.export_to_countries?.length > 0 ? (
          <StyledTD>
            {company.export_to_countries.map((country) => (
              <span>
                <StyledLink
                  href={`/companies/${company.id}/exports/history/${country.id}`}
                >
                  {country.name}
                </StyledLink>
                &nbsp;
              </span>
            ))}
          </StyledTD>
        ) : (
          <StyledSpan>Not set</StyledSpan>
        )}
      </SummaryTable.Row>
      <SummaryTable.Row heading="Future countries of interest">
        {company.future_interest_countries?.length > 0 ? (
          <StyledTD>
            {company.future_interest_countries.map((country) => (
              <span>
                <StyledLink
                  href={`/companies/${company.id}/exports/history/${country.id}`}
                >
                  {country.name}
                </StyledLink>
                &nbsp;
              </span>
            ))}
          </StyledTD>
        ) : (
          <StyledSpan>Not set</StyledSpan>
        )}
      </SummaryTable.Row>
      <StyledTableRow>
        <StyledLastTableCell colSpan={2}>
          <Link
            href={`${queryString}/exports`}
            data-test="export-status-page-link"
          >
            View full export details
          </Link>
        </StyledLastTableCell>
      </StyledTableRow>
    </StyledSummaryTable>
  )
}

ExportStatus.propTypes = {
  company: PropTypes.object.isRequired,
}

export default ExportStatus
