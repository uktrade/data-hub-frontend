import React from 'react'
import { Link } from 'govuk-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { kebabCase } from 'lodash'

import { SummaryTable, Tag } from '../../../../../client/components'
import Task from '../../../../../client/components/Task'
import {
  TASK_GET_LATEST_EXPORT_WINS,
  OVERVIEW_COMPANY_EXPORT_WINS_LIST_ID,
  exportWinsState2props,
} from './state'
import { OVERVIEW__EXPORT_WINS_SUMMARY } from '../../../../../client/actions'
import { format } from '../../../../../client/utils/date'
import { transformExportCountries } from '../../exports/transformer'
import { companies } from '../../../../../lib/urls'
import { buildCellContents } from './transformers'
import {
  StyledLastTableCell,
  StyledSpan,
  StyledSummaryTable,
  StyledTableRow,
} from './components'

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

const maximumTenCountries = (countries, maxCount) =>
  countries.slice(0, maxCount)

const getCountries = (transformedCountries, index) =>
  transformedCountries[index]?.values?.length || 0

export const getMaxTenCountries = (transformedCountries, index) =>
  maximumTenCountries(transformedCountries[index]?.values || [], 10)

export const numberOfCurrentExportCountries = (exportCountries) =>
  getCountries(transformExportCountries(exportCountries), 0)

export const maximumTenCurrentExportCountries = (exportCountries) =>
  getMaxTenCountries(transformExportCountries(exportCountries), 0)

export const numberOfFutureInterestCountries = (exportCountries) =>
  getCountries(transformExportCountries(exportCountries), 1)

export const maximumTenFutureInterestCountries = (exportCountries) =>
  getMaxTenCountries(transformExportCountries(exportCountries), 1)

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

export const Countries = ({
  countries,
  company,
  divDataTest,
  linkDataTest,
}) => (
  <StyledDiv data-test={divDataTest}>
    {countries.map((country) => (
      <div key={country.id}>
        <StyledLink
          href={companies.exports.history.country(company.id, country.id)}
          data-test={`${linkDataTest}-${kebabCase(country.name)}-link`}
        >
          {country.name}
        </StyledLink>
      </div>
    ))}
  </StyledDiv>
)

export const ExportStatusDetails = ({
  company,
  count,
  latestExportWin,
  maximumTenCurrentExportCountries,
  maximumTenFutureInterestCountries,
  numberOfCurrentExportCountries,
  numberOfFutureInterestCountries,
}) => (
  <StyledSummaryTable
    caption="Export status"
    data-test="export-status-container"
  >
    <SummaryTable.Row heading="Export potential">
      <StyledSpan>Unavailable</StyledSpan>
    </SummaryTable.Row>
    <SummaryTable.Row heading="Export sub-segment">
      {buildCellContents(
        company.exportSubSegment,
        <StyledTD>
          <div>
            <StyledTag colour="green">
              {SUBSEGMENT[company.exportSubSegment]}
            </StyledTag>
          </div>
        </StyledTD>
      )}
    </SummaryTable.Row>
    <SummaryTable.Row heading="Currently exporting to">
      {buildCellContents(
        numberOfCurrentExportCountries,
        <Countries
          company={company}
          countries={maximumTenCurrentExportCountries}
          divDataTest={'current-export-list'}
          linkDataTest={'current-export-country'}
        />
      )}
      {numberOfCurrentExportCountries > 10 && (
        <StyledViewMoreLink
          href={companies.exports.index(company.id)}
          data-test="export-status-currently-exporting-to-link"
        >
          {`View ${numberOfCurrentExportCountries - 10} more`}
        </StyledViewMoreLink>
      )}
    </SummaryTable.Row>
    <SummaryTable.Row heading="Future countries of interest">
      {buildCellContents(
        numberOfFutureInterestCountries,
        <Countries
          company={company}
          countries={maximumTenFutureInterestCountries}
          divDataTest={'future-export-list'}
          linkDataTest={'future-export-country'}
        />
      )}
      {numberOfCurrentExportCountries > 10 && (
        <StyledViewMoreLink
          href={companies.exports.index(company.id)}
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
      {count ? count.error ? <StyledSpan>{count.error}</StyledSpan> : count : 0}
    </SummaryTable.Row>
    <StyledTableRow>
      <StyledLastTableCell colSpan={2}>
        <Link
          href={companies.exports.index(company.id)}
          data-test="export-status-page-link"
        >
          View full export details
        </Link>
      </StyledLastTableCell>
    </StyledTableRow>
  </StyledSummaryTable>
)

const unableToLoadExportWinsErrorMessage = {
  error: 'Unable to load export wins',
}

export const ExportStatusCard = ({
  activePage,
  company,
  count,
  latestExportWin,
}) => (
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
          numberOfCurrentExportCountries={numberOfCurrentExportCountries(
            company.exportCountries
          )}
          numberOfFutureInterestCountries={numberOfFutureInterestCountries(
            company.exportCountries
          )}
          maximumTenCurrentExportCountries={maximumTenCurrentExportCountries(
            company.exportCountries
          )}
          maximumTenFutureInterestCountries={maximumTenFutureInterestCountries(
            company.exportCountries
          )}
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
        numberOfCurrentExportCountries={numberOfCurrentExportCountries(
          company.exportCountries
        )}
        numberOfFutureInterestCountries={numberOfFutureInterestCountries(
          company.exportCountries
        )}
        maximumTenCurrentExportCountries={maximumTenCurrentExportCountries(
          company.exportCountries
        )}
        maximumTenFutureInterestCountries={maximumTenFutureInterestCountries(
          company.exportCountries
        )}
      />
    )}
  </Task.Status>
)

ExportStatusCard.propTypes = {
  company: PropTypes.object.isRequired,
}

export default connect(exportWinsState2props)(ExportStatusCard)
