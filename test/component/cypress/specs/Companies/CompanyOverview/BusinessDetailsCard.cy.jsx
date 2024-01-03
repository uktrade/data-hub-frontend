import React from 'react'

import { BusinessDetailsCard } from '../../../../../../src/client/modules/Companies/CompanyOverview/TableCards'

import { currencyGBP } from '../../../../../../src/client/utils/number-utils'
import {
  assertSummaryTable,
  assertLink,
} from '../../../../../functional/cypress/support/assertions'

import {
  companyGlobalUltimateAllDetails,
  companyNoGlobalUltimateAllDetails,
  companyRegisteredAddressOnly,
  companyNoDetails,
  companyNonUK,
} from '../FakerItems'

describe('BusinessDetailsCard', () => {
  const Component = (props) => <BusinessDetailsCard {...props} />

  context(
    'When the company has global headquarter and all information set',
    () => {
      beforeEach(() => {
        cy.mount(<Component company={companyGlobalUltimateAllDetails} />)
      })

      it('should render the right text', () => {
        assertSummaryTable({
          dataTest: 'business-details-container',
          content: {
            'Companies House': `${companyGlobalUltimateAllDetails.companyNumber} (opens in new tab)`,
            'Trading Address':
              companyGlobalUltimateAllDetails.address.line1 +
              companyGlobalUltimateAllDetails.address.line2 +
              companyGlobalUltimateAllDetails.address.town +
              companyGlobalUltimateAllDetails.address.postcode,
            Website: `${companyGlobalUltimateAllDetails.website} (opens in new tab)`,
            Turnover: currencyGBP(companyGlobalUltimateAllDetails.turnoverGbp, {
              maximumSignificantDigits: 2,
            }),
            'Number of Employees':
              companyGlobalUltimateAllDetails.numberOfEmployees,
            'DBT Sector': companyGlobalUltimateAllDetails.sector.name,
            'Headquarter Location':
              companyGlobalUltimateAllDetails.globalUltimateCountry +
              'View company tree',
          },
        })
      })

      it('should contain four links', () => {
        assertLink(
          'companies-house-link',
          `https://beta.companieshouse.gov.uk/company/${companyGlobalUltimateAllDetails.companyNumber}`
        )
        assertLink('website-link', companyGlobalUltimateAllDetails.website)
        assertLink(
          'company-tree-link',
          `/companies/${companyGlobalUltimateAllDetails.id}/company-tree`
        )
        assertLink(
          'business-page-link',
          `/companies/${companyGlobalUltimateAllDetails.id}/business-details`
        )
      })
    }
  )

  context(
    'When the company has no global headquarter but all other information is set',
    () => {
      beforeEach(() => {
        cy.mount(<Component company={companyNoGlobalUltimateAllDetails} />)
      })

      it('should render the right text', () => {
        assertSummaryTable({
          dataTest: 'business-details-container',
          content: {
            'Companies House': `${companyNoGlobalUltimateAllDetails.companyNumber} (opens in new tab)`,
            'Trading Address':
              companyNoGlobalUltimateAllDetails.address.line1 +
              companyNoGlobalUltimateAllDetails.address.line2 +
              companyNoGlobalUltimateAllDetails.address.town +
              companyNoGlobalUltimateAllDetails.address.postcode,
            Website: `${companyNoGlobalUltimateAllDetails.website} (opens in new tab)`,
            Turnover: currencyGBP(
              companyNoGlobalUltimateAllDetails.turnoverGbp,
              {
                maximumSignificantDigits: 2,
              }
            ),
            'Number of Employees':
              companyNoGlobalUltimateAllDetails.numberOfEmployees,
            'DBT Sector': companyNoGlobalUltimateAllDetails.sector.name,
          },
        })
      })

      it('should contain three links', () => {
        assertLink(
          'companies-house-link',
          `https://beta.companieshouse.gov.uk/company/${companyNoGlobalUltimateAllDetails.companyNumber}`
        )
        assertLink('website-link', companyNoGlobalUltimateAllDetails.website)
        assertLink(
          'business-page-link',
          `/companies/${companyNoGlobalUltimateAllDetails.id}/business-details`
        )
        cy.get('[data-test="company-tree-link"]').should('not.exist')
      })
    }
  )

  context('When the company is not in the UK', () => {
    beforeEach(() => {
      cy.mount(<Component company={companyNonUK} />)
    })

    it('should render the right text that does not contain the companies house field', () => {
      assertSummaryTable({
        dataTest: 'business-details-container',
        content: {
          'Trading Address':
            companyNonUK.address.line1 +
            companyNonUK.address.line2 +
            companyNonUK.address.town +
            companyNonUK.address.postcode,
          Website: `${companyNonUK.website} (opens in new tab)`,
          Turnover: currencyGBP(companyNonUK.turnoverGbp, {
            maximumSignificantDigits: 2,
          }),
          'Number of Employees': companyNonUK.numberOfEmployees,
          'DBT Sector': companyNonUK.sector.name,
          'Headquarter Location':
            companyNonUK.globalUltimateCountry + 'View company tree',
        },
      })
    })

    it('should contain three links', () => {
      assertLink('website-link', companyNonUK.website)
      assertLink(
        'company-tree-link',
        `/companies/${companyNonUK.id}/company-tree`
      )
      assertLink(
        'business-page-link',
        `/companies/${companyNonUK.id}/business-details`
      )
      cy.get('[data-test="companies-house-link"]').should('not.exist')
    })
  })

  context('When the company has no information set', () => {
    beforeEach(() => {
      cy.mount(<Component company={companyNoDetails} />)
    })

    it('should render the right text', () => {
      assertSummaryTable({
        dataTest: 'business-details-container',
        content: {
          'Trading Address': 'Not set',
          Website: 'Not set',
          Turnover: 'Not set',
          'Number of Employees': 'Not set',
          'DBT Sector': 'Not set',
        },
      })
    })

    it('should contain only the business details link', () => {
      cy.get('[data-test="companies-house-link"]').should('not.exist')
      cy.get('[data-test="website-link"]').should('not.exist')
      cy.get('[data-test="company-tree-link"]').should('not.exist')
      assertLink(
        'business-page-link',
        `/companies/${companyNoDetails.id}/business-details`
      )
    })
  })

  context('When the company only has a UK registered address', () => {
    beforeEach(() => {
      cy.mount(<Component company={companyRegisteredAddressOnly} />)
    })

    it('should still show the Company House field if set', () => {
      assertSummaryTable({
        dataTest: 'business-details-container',
        content: {
          'Companies House': `${companyRegisteredAddressOnly.companyNumber} (opens in new tab)`,
          'Trading Address': 'Not set',
          Website: `${companyRegisteredAddressOnly.website} (opens in new tab)`,
          Turnover: currencyGBP(companyRegisteredAddressOnly.turnoverGbp, {
            maximumSignificantDigits: 2,
          }),
          'Number of Employees': companyRegisteredAddressOnly.numberOfEmployees,
          'DBT Sector': companyRegisteredAddressOnly.sector.name,
        },
      })
    })
  })
})
