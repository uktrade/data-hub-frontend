import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { UNITED_KINGDOM_ID } from '../../../../../common/constants'
import { NewWindowLink, SummaryTable } from '../../../../components'
import { currencyGBP } from '../../../../utils/number-utils'
import urls from '../../../../../lib/urls'
import { buildCellContents } from './transformers'
import {
  StyledLastTableCell,
  StyledSummaryTable,
  StyledTableRow,
} from './components'
import AccessibleLink from '../../../../components/Link'

const StyledAddressList = styled('ul')``

const BusinessDetailsCard = ({ company }) => (
  <StyledSummaryTable
    caption="Business details"
    data-test="business-details-container"
  >
    {(company.registeredAddress?.country?.id == UNITED_KINGDOM_ID ||
      company.address?.country?.id == UNITED_KINGDOM_ID) && (
      <SummaryTable.Row heading="Companies House">
        {buildCellContents(
          company.companyNumber,
          <NewWindowLink
            href={urls.external.companiesHouse(company.companyNumber)}
            aria-label={`Companies House number: ${company.companyNumber} (opens in new tab on Companies House website)`}
            data-test="companies-house-link"
          >
            {company.companyNumber}
          </NewWindowLink>
        )}
      </SummaryTable.Row>
    )}
    <SummaryTable.Row heading="Trading Address">
      {buildCellContents(
        company.address,
        <StyledAddressList>
          {company.address?.line1 && <li>{company.address.line1}</li>}
          {company.address?.line2 && <li>{company.address.line2}</li>}
          {company.address?.town && <li>{company.address.town}</li>}
          {company.address?.postcode && <li>{company.address.postcode}</li>}
        </StyledAddressList>
      )}
    </SummaryTable.Row>
    <SummaryTable.Row heading="Website">
      {buildCellContents(
        company.website,
        <NewWindowLink data-test="website-link" href={company.website}>
          {company.website}
        </NewWindowLink>
      )}
    </SummaryTable.Row>
    <SummaryTable.Row heading="Turnover">
      {buildCellContents(
        company.turnoverGbp || company.turnoverRange,
        company.turnoverGbp
          ? currencyGBP(company.turnoverGbp, {
              maximumSignificantDigits: 2,
            })
          : company.turnoverRange?.name
      )}
    </SummaryTable.Row>
    <SummaryTable.Row heading="Number of Employees">
      {buildCellContents(company.numberOfEmployees, company.numberOfEmployees)}
    </SummaryTable.Row>
    <SummaryTable.Row heading="DBT Sector">
      {buildCellContents(company.sector, company.sector?.name)}
    </SummaryTable.Row>
    {company.globalUltimateCountry && (
      <SummaryTable.Row heading="Headquarter Location">
        {company.globalUltimateCountry}
        <AccessibleLink
          href={urls.companies.dnbHierarchy.tree(company.id)}
          data-test="company-tree-link"
        >
          View company tree
        </AccessibleLink>
      </SummaryTable.Row>
    )}
    <StyledTableRow>
      <StyledLastTableCell colSpan={2}>
        <AccessibleLink
          href={urls.companies.businessDetails(company.id)}
          data-test="business-page-link"
        >
          View full business details
        </AccessibleLink>
      </StyledLastTableCell>
    </StyledTableRow>
  </StyledSummaryTable>
)

BusinessDetailsCard.propTypes = {
  company: PropTypes.object.isRequired,
}

export default BusinessDetailsCard
