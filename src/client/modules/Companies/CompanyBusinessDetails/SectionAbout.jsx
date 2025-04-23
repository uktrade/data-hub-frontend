import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Details from '@govuk-react/details'
import { isEmpty } from 'lodash'
import { SPACING_POINTS, LINE_HEIGHT } from '@govuk-react/constants'

import { currencyGBP } from '../../../utils/number-utils'
import { NewWindowLink, SummaryTable } from '../../../components'
import { exportSegmentsLabels, exportSubSegmentsLabels } from './labels'
import urls from '../../../../lib/urls'
import { NOT_SET_TEXT } from '../../../../apps/companies/constants'
import AccessibleLink from '../../../components/Link'

const TableDetails = styled('div')`
  display: flex;
  flex-flow: row wrap;
  * {
    font-size: inherit;
    line-height: inherit;
  }
  & > span {
    flex: 1;
    padding-left: ${SPACING_POINTS[5]}px;
    line-height: ${LINE_HEIGHT.SIZE_24};
  }
  & > details {
    flex: 1;
    padding-left: ${SPACING_POINTS[5]}px;
    line-height: ${LINE_HEIGHT.SIZE_24};
    margin-bottom: 0;
  }
`

const SectionAbout = ({ company, isDnbCompany, isArchived }) => (
  <SummaryTable
    caption={`About ${company.name}`}
    data-test="aboutDetailsContainer"
    actions={
      !isArchived && (
        <AccessibleLink href={urls.companies.edit(company.id)} key={company.id}>
          Edit
        </AccessibleLink>
      )
    }
  >
    <SummaryTable.Row heading="VAT number" hideWhenEmpty={true}>
      {company.vatNumber}
    </SummaryTable.Row>

    {!isDnbCompany && (
      <SummaryTable.Row heading="Business type" hideWhenEmpty={true}>
        {company.businessType?.name}
      </SummaryTable.Row>
    )}

    <SummaryTable.Row heading="Trading name">
      {isEmpty(company.tradingNames) ? NOT_SET_TEXT : company.tradingNames}
    </SummaryTable.Row>

    <SummaryTable.Row heading="CDMS reference" hideWhenEmpty={true}>
      {company.referenceCode}
    </SummaryTable.Row>

    {company.companyNumber && (
      <SummaryTable.Row heading="Companies House number" hideWhenEmpty={true}>
        {company.companyNumber}

        <NewWindowLink
          href={urls.external.companiesHouse(company.companyNumber)}
        >
          View on Companies House website
        </NewWindowLink>
      </SummaryTable.Row>
    )}

    <SummaryTable.Row heading="DUNS number">
      {company.dunsNumber ? company.dunsNumber : NOT_SET_TEXT}
    </SummaryTable.Row>

    <SummaryTable.Row heading="Annual turnover">
      {company.turnoverGbp && (
        <>
          {currencyGBP(company.turnoverGbp, {
            maximumSignificantDigits: 2,
          })}

          {company.isTurnoverEstimated && (
            <TableDetails>
              This is an estimated number
              <Details summary="What does that mean?">
                Actual turnover is not available for this business. The number
                has been modelled by Dun & Bradstreet, based on similar
                businesses.
              </Details>
            </TableDetails>
          )}
        </>
      )}
      {!company.turnoverGbp &&
        (company.turnoverRange ? company.turnoverRange.name : NOT_SET_TEXT)}
    </SummaryTable.Row>

    <SummaryTable.Row heading="Number of employees">
      {company.numberOfEmployees && (
        <>
          {company.numberOfEmployees}

          {company.isNumberOfEmployeesEstimated && (
            <TableDetails>
              This is an estimated number
              <Details summary="What does that mean?">
                Actual number of employees is not available for this business.
                The number has been modelled by Dun & Bradstreet, based on
                similar businesses.
              </Details>
            </TableDetails>
          )}
        </>
      )}
      {!company.numberOfEmployees &&
        (company.employeeRange ? company.employeeRange.name : NOT_SET_TEXT)}
    </SummaryTable.Row>

    <SummaryTable.Row heading="Website">
      {company.website ? (
        <NewWindowLink href={company.website}>{company.website}</NewWindowLink>
      ) : (
        NOT_SET_TEXT
      )}
    </SummaryTable.Row>

    <SummaryTable.Row heading="Business description">
      {company.description || 'No description has been added'}
    </SummaryTable.Row>

    <SummaryTable.Row heading="Segment">
      {exportSegmentsLabels[company.exportSegment] ||
        'No export segment or not known'}
    </SummaryTable.Row>

    <SummaryTable.Row heading="Sub-segment">
      {exportSubSegmentsLabels[company.exportSubSegment] ||
        'No sub export segment or not known'}
    </SummaryTable.Row>
  </SummaryTable>
)

SectionAbout.propTypes = {
  company: PropTypes.object.isRequired,
  isDnbCompany: PropTypes.bool.isRequired,
  isArchived: PropTypes.bool.isRequired,
}

export default SectionAbout
