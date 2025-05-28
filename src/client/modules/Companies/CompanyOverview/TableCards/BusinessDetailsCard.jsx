import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { FONT_SIZE } from '@govuk-react/constants'

import { UNITED_KINGDOM_ID } from '../../../../../common/constants'
import { NewWindowLink, SummaryTableHighlight } from '../../../../components'
import { currencyGBP, shortNumber } from '../../../../utils/number-utils'
import urls from '../../../../../lib/urls'
import { buildCellContents } from './transformers'
import AccessibleLink from '../../../../components/Link'

const StyledAddressList = styled('ul')``

const StyledAccessibleLink = styled(AccessibleLink)`
  font-size: ${FONT_SIZE.SIZE_16};
`

const BusinessDetailsCard = ({ company }) => (
  <>
    <SummaryTableHighlight
      caption="Business details"
      data-test="business-details-container"
    >
      <SummaryTableHighlight.HighlightRow heading="Turnover">
        {buildCellContents(
          company.turnoverGbp || company.turnoverRange,
          company.turnoverGbp
            ? currencyGBP(company.turnoverGbp, {
                maximumSignificantDigits: 2,
                notation: 'compact',
                compactDisplay: 'short',
              })
            : company.turnoverRange?.name
        )}
      </SummaryTableHighlight.HighlightRow>
      <SummaryTableHighlight.HighlightRow heading="Number of employees">
        {buildCellContents(
          shortNumber(company.numberOfEmployees),
          shortNumber(company.numberOfEmployees, 9999)
        )}
      </SummaryTableHighlight.HighlightRow>
      {(company.registeredAddress?.country?.id == UNITED_KINGDOM_ID ||
        company.address?.country?.id == UNITED_KINGDOM_ID) && (
        <SummaryTableHighlight.Row heading="Companies house">
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
        </SummaryTableHighlight.Row>
      )}
      <SummaryTableHighlight.Row heading="Trading address">
        {buildCellContents(
          company.address,
          <StyledAddressList>
            {company.address?.line1 && <li>{company.address.line1}</li>}
            {company.address?.line2 && <li>{company.address.line2}</li>}
            {company.address?.town && <li>{company.address.town}</li>}
            {company.address?.postcode && <li>{company.address.postcode}</li>}
          </StyledAddressList>
        )}
      </SummaryTableHighlight.Row>
      <SummaryTableHighlight.Row heading="Website">
        {buildCellContents(
          company.website,
          <NewWindowLink data-test="website-link" href={company.website}>
            {company.website}
          </NewWindowLink>
        )}
      </SummaryTableHighlight.Row>
      <SummaryTableHighlight.Row heading="DBT sector">
        {buildCellContents(company.sector, company.sector?.name)}
      </SummaryTableHighlight.Row>
      {company.globalUltimateCountry && (
        <SummaryTableHighlight.Row heading="Headquarter location">
          {company.globalUltimateCountry}
          <AccessibleLink
            href={urls.companies.dnbHierarchy.tree(company.id)}
            data-test="company-tree-link"
          >
            View company tree
          </AccessibleLink>
        </SummaryTableHighlight.Row>
      )}
    </SummaryTableHighlight>
    <StyledAccessibleLink
      href={urls.companies.businessDetails(company.id)}
      data-test="business-page-link"
    >
      View full business details
    </StyledAccessibleLink>
  </>
)

BusinessDetailsCard.propTypes = {
  company: PropTypes.object.isRequired,
}

export default BusinessDetailsCard
