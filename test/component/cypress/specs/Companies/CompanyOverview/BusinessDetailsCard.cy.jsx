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
            Turnover: currencyGBP(companyGlobalUltimateAllDetails.turnoverGbp, {
              maximumSignificantDigits: 2,
              notation: 'compact',
              compactDisplay: 'short',
            }),
            'Number of employees':
              companyGlobalUltimateAllDetails.numberOfEmployees,
            'Companies house': `${companyGlobalUltimateAllDetails.companyNumber} (opens in new tab)`,
            'Trading address':
              companyGlobalUltimateAllDetails.address.line1 +
              companyGlobalUltimateAllDetails.address.line2 +
              companyGlobalUltimateAllDetails.address.town +
              companyGlobalUltimateAllDetails.address.postcode,
            Website: `${companyGlobalUltimateAllDetails.website} (opens in new tab)`,
            'DBT sector': companyGlobalUltimateAllDetails.sector.name,
            'Headquarter location':
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
            Turnover: currencyGBP(
              companyNoGlobalUltimateAllDetails.turnoverGbp,
              {
                maximumSignificantDigits: 2,
                notation: 'compact',
                compactDisplay: 'short',
              }
            ),
            'Number of employees':
              companyNoGlobalUltimateAllDetails.numberOfEmployees,
            'Companies house': `${companyNoGlobalUltimateAllDetails.companyNumber} (opens in new tab)`,
            'Trading address':
              companyNoGlobalUltimateAllDetails.address.line1 +
              companyNoGlobalUltimateAllDetails.address.line2 +
              companyNoGlobalUltimateAllDetails.address.town +
              companyNoGlobalUltimateAllDetails.address.postcode,
            Website: `${companyNoGlobalUltimateAllDetails.website} (opens in new tab)`,
            'DBT sector': companyNoGlobalUltimateAllDetails.sector.name,
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
          Turnover: currencyGBP(companyNonUK.turnoverGbp, {
            maximumSignificantDigits: 2,
            notation: 'compact',
            compactDisplay: 'short',
          }),
          'Number of employees': companyNonUK.numberOfEmployees,
          'Trading address':
            companyNonUK.address.line1 +
            companyNonUK.address.line2 +
            companyNonUK.address.town +
            companyNonUK.address.postcode,
          Website: `${companyNonUK.website} (opens in new tab)`,
          'DBT sector': companyNonUK.sector.name,
          'Headquarter location':
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
          Turnover: 'Not set',
          'Number of employees': 'Not set',
          'Trading address': 'Not set',
          Website: 'Not set',
          'DBT sector': 'Not set',
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
          Turnover: currencyGBP(companyRegisteredAddressOnly.turnoverGbp, {
            maximumSignificantDigits: 2,
            notation: 'compact',
            compactDisplay: 'short',
          }),
          'Number of employees': companyRegisteredAddressOnly.numberOfEmployees,
          'Companies house': `${companyRegisteredAddressOnly.companyNumber} (opens in new tab)`,
          'Trading address': 'Not set',
          Website: `${companyRegisteredAddressOnly.website} (opens in new tab)`,
          'DBT sector': companyRegisteredAddressOnly.sector.name,
        },
      })
    })
  })
})
