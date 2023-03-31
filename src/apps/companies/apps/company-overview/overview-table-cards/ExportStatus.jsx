import React from 'react'
import { Link, Table } from 'govuk-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { SummaryTable } from '../../../../../client/components'
import Task from '../../../../../client/components/Task'
import {
  TASK_GET_LATEST_EXPORT_WINS,
  OVERVIEW_COMPANY_EXPORT_WINS_LIST_ID,
  exportWinsState2props,
} from './state'
import { connect } from 'react-redux'
import { OVERVIEW__EXPORT_WINS_SUMMARY } from '../../../../../client/actions'
import { format } from '../../../../../client/utils/date'

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
const GreenLabel = styled('span')`
  background-color: #cce2d9;
  color: #005b30;
  padding: 4px;
  white-space: pre-line;
  font-size: 14px;
  text-transform: uppercase;
  font-weight: bold;
`

export const SUBSEGMENT = {
  sustain_nurture_and_grow: 'Sustain: Nurture & grow',
  sustain_develop_export_capability: 'Sustain: develop export capability',
  sustain_communicate_benefits: 'Sustain: communicate benefits',
  sustain_increase_competitiveness: 'Sustain: increase competitiveness',
  reassure_nurture_and_grow: 'Reassure: nurture & grow',
  reassure_develop_export_capability: 'Reassure: develop export capability',
  reassure_leave_be: 'Reassure: leave be',
  reassure_change_the_game: 'Reassure: change the game',
  promote_develop_export_capability: 'Promote: develop export capability',
  promote_communicate_benefits: 'Promote: communicate benefits',
  promote_change_the_game: 'Promote: change the game',
  challenge: 'Challenge',
}

const ExportStatus = ({ activePage, company, queryString, ...props }) => {
  return (
    <Task.Status
      name={TASK_GET_LATEST_EXPORT_WINS}
      id={OVERVIEW_COMPANY_EXPORT_WINS_LIST_ID}
      progressMessage="Loading export wins"
      startOnRender={{
        payload: {
          companyId: company.id,
          companyName: company.name,
          activePage: activePage,
        },
        onSuccessDispatch: OVERVIEW__EXPORT_WINS_SUMMARY,
      }}
    >
      {() => (
        <StyledSummaryTable
          caption="Export status"
          data-test="exportStatusContainer"
        >
          <SummaryTable.Row heading="Export potential">
            {company.export_potential ? (
              <StyledTD>
                <div>
                  <GreenLabel>{company.export_potential}</GreenLabel>
                </div>
              </StyledTD>
            ) : (
              <StyledSpan>Not set</StyledSpan>
            )}
          </SummaryTable.Row>
          <SummaryTable.Row heading="Export sub-segment">
            {company.export_sub_segment ? (
              <StyledTD>
                <div>
                  <GreenLabel>
                    {SUBSEGMENT[company.export_sub_segment]}
                  </GreenLabel>
                </div>
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
                      data-test="export-status-currently-exporting-to-link"
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
                      data-test="export-status-country-of-interest-link"
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
          <SummaryTable.Row heading="Last export win">
            {props.latestExportWin
              ? `${format(props.latestExportWin.date)}, ${
                  props.latestExportWin.country
                }`
              : 'No export wins recorded'}
          </SummaryTable.Row>
          <SummaryTable.Row heading="Total exports won">
            {props.count}
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
      )}
    </Task.Status>
  )
}

ExportStatus.propTypes = {
  company: PropTypes.object.isRequired,
}
export default connect(exportWinsState2props)(ExportStatus)
