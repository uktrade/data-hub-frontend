import React from 'react'
import { Link } from 'govuk-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { NewWindowLink, SummaryTable } from '../../../../../client/components'
import { currencyGBP } from '../../../../../client/utils/number-utils'
import urls from '../../../../../lib/urls'
import { buildCellContents } from './transformers'
import {
  StyledLastTableCell,
  StyledSummaryTable,
  StyledTableRow,
} from './components'

const StyledAddressList = styled('ul')``

const countryCode = '80756b9a-5d95-e211-a939-e4115bead28a'

const BusinessDetailsCard = ({ company }) => (
  <StyledSummaryTable
    caption="Business details"
    data-test="businessDetailsContainer"
  >
    {(company.registeredAddress?.country.id == countryCode ||
      company.address?.country.id == countryCode) && (
      <SummaryTable.Row heading="Companies House">
        {buildCellContents(
          company.companyNumber,
          <NewWindowLink
            href={urls.external.companiesHouse(company.companyNumber)}
            aria-label="Opens on Companies House website"
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
          {company.registeredAddress?.line2 && <li>{company.address.line2}</li>}
          {company.registeredAddress?.town && <li>{company.address.town}</li>}
          {company.registeredAddress?.postcode && (
            <li>{company.address.postcode}</li>
          )}
        </StyledAddressList>
      )}
    </SummaryTable.Row>
    <SummaryTable.Row heading="Website">
      {buildCellContents(
        company.website,
        <NewWindowLink href={company.website}>{company.website}</NewWindowLink>
      )}
    </SummaryTable.Row>
    <SummaryTable.Row heading="Turnover">
      {buildCellContents(
        company.turnoverGbp && company.turnoverRange,
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
        <Link
          href={urls.companies.dnbHierarchy.tree(company.id)}
          data-test="company-tree-link"
        >
          View company tree
        </Link>
      </SummaryTable.Row>
    )}
    <StyledTableRow>
      <StyledLastTableCell colSpan={2}>
        <Link
          href={urls.companies.businessDetails(company.id)}
          data-test="business-page-link"
        >
          View full business details
        </Link>
      </StyledLastTableCell>
    </StyledTableRow>
  </StyledSummaryTable>
)
BusinessDetailsCard.propTypes = {
  company: PropTypes.object.isRequired,
}

export default BusinessDetailsCard
