import React from 'react'
import { Link, Table } from 'govuk-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { GREY_1 } from '../../../../../client/utils/colours'
import { SummaryTable, Tag } from '../../../../../client/components'
import Task from '../../../../../client/components/Task'
import {
  TASK_GET_LATEST_EXPORT_WINS,
  OVERVIEW_COMPANY_EXPORT_WINS_LIST_ID,
  exportWinsState2props,
} from './state'
import { connect } from 'react-redux'
import { OVERVIEW__EXPORT_WINS_SUMMARY } from '../../../../../client/actions'
import { format } from '../../../../../client/utils/date'
import { kebabCase } from 'lodash'

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

const StyledDiv = styled('div')`
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
  color: ${GREY_1};
`

const StyledLink = styled(Link)`
  margin-right: 5px;
`
const StyledViewMoreLink = styled(Link)`
  font-size: 12px;
  margin-right: 5px;
`

const StyledTag = styled(Tag)`
  white-space: pre-wrap;
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

const Countries = ({ countries, company, divDataTest, linkDataTest }) => {
  return (
    <StyledDiv data-test={divDataTest}>
      {countries.map((country) => (
        <div key={country.id}>
          <StyledLink
            href={`/companies/${company.id}/exports/history/${country.id}`}
            data-test={`${linkDataTest}-${kebabCase(country.name)}-link`}
          >
            {country.name}
          </StyledLink>
        </div>
      ))}
    </StyledDiv>
  )
}

const ExportStatusDetails = ({
  company,
  count,
  latestExportWin,
  maximumTenCurrentExportCountries,
  maximumTenFutureInterestCountries,
  numberOfCurrentExportCountries,
  numberOfFutureInterestCountries,
  queryString,
}) => {
  return (
    <StyledSummaryTable
      caption="Export status"
      data-test="exportStatusContainer"
    >
      <SummaryTable.Row heading="Export potential">
        {company.export_potential ? (
          <StyledTD>
            <div>
              <StyledTag colour="green">{company.export_potential}</StyledTag>
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
              <StyledTag colour="green">
                {SUBSEGMENT[company.export_sub_segment]}
              </StyledTag>
            </div>
          </StyledTD>
        ) : (
          <StyledSpan>Not set</StyledSpan>
        )}
      </SummaryTable.Row>
      <SummaryTable.Row heading="Currently exporting to">
        {numberOfCurrentExportCountries ? (
          <Countries
            company={company}
            countries={maximumTenCurrentExportCountries}
            divDataTest={'current-export-list'}
            linkDataTest={'current-export-country'}
          />
        ) : (
          <StyledSpan>Not set</StyledSpan>
        )}
        {numberOfCurrentExportCountries > 10 && (
          <StyledViewMoreLink
            href={`/companies/${company.id}/exports`}
            data-test="export-status-currently-exporting-to-link"
          >
            {`View ${numberOfCurrentExportCountries - 10} more`}
          </StyledViewMoreLink>
        )}
      </SummaryTable.Row>
      <SummaryTable.Row heading="Future countries of interest">
        {numberOfFutureInterestCountries ? (
          <Countries
            company={company}
            countries={maximumTenFutureInterestCountries}
            divDataTest={'future-export-list'}
            linkDataTest={'future-export-country'}
          />
        ) : (
          <StyledSpan>Not set</StyledSpan>
        )}
        {numberOfCurrentExportCountries > 10 && (
          <StyledViewMoreLink
            href={`/companies/${company.id}/exports`}
            data-test="export-status-future-exporting-to-link"
          >
            {`View ${numberOfFutureInterestCountries - 10} more`}
          </StyledViewMoreLink>
        )}
      </SummaryTable.Row>
      <SummaryTable.Row heading="Last export win">
        {latestExportWin ? (
          latestExportWin.error ? (
            <StyledSpan>{latestExportWin.error}</StyledSpan>
          ) : (
            `${format(latestExportWin.date)}, ${latestExportWin.country}`
          )
        ) : (
          'No export wins recorded'
        )}
      </SummaryTable.Row>
      <SummaryTable.Row heading="Total exports won">
        {count ? (
          count.error ? (
            <StyledSpan>{count.error}</StyledSpan>
          ) : (
            count
          )
        ) : (
          0
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

const unableToLoadExportWinsErrorMessage = {
  error: 'Unable to load export wins',
}

const ExportStatus = ({
  activePage,
  company,
  queryString,
  numberOfCurrentExportCountries,
  maximumTenCurrentExportCountries,
  numberOfFutureInterestCountries,
  maximumTenFutureInterestCountries,
  count,
  latestExportWin,
}) => {
  return (
    <Task.Status
      name={TASK_GET_LATEST_EXPORT_WINS}
      id={OVERVIEW_COMPANY_EXPORT_WINS_LIST_ID}
      progressMessage="Loading export wins"
      renderError={() => (
        <>
          <ExportStatusDetails
            company={company}
            count={unableToLoadExportWinsErrorMessage}
            latestExportWin={unableToLoadExportWinsErrorMessage}
            numberOfCurrentExportCountries={numberOfCurrentExportCountries}
            numberOfFutureInterestCountries={numberOfFutureInterestCountries}
            maximumTenCurrentExportCountries={maximumTenCurrentExportCountries}
            maximumTenFutureInterestCountries={
              maximumTenFutureInterestCountries
            }
            queryString={queryString}
          />
        </>
      )}
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
        <ExportStatusDetails
          company={company}
          count={count}
          latestExportWin={latestExportWin}
          maximumTenCurrentExportCountries={maximumTenCurrentExportCountries}
          maximumTenFutureInterestCountries={maximumTenFutureInterestCountries}
          numberOfCurrentExportCountries={numberOfCurrentExportCountries}
          numberOfFutureInterestCountries={numberOfFutureInterestCountries}
          queryString={queryString}
        />
      )}
    </Task.Status>
  )
}

ExportStatus.propTypes = {
  company: PropTypes.object.isRequired,
}
export default connect(exportWinsState2props)(ExportStatus)
