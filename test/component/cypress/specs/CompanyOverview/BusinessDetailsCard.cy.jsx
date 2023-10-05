import React from 'react'

import styled from 'styled-components'

import { BusinessDetailsCard } from '../../../../../src/apps/companies/apps/company-overview/overview-table-cards'

import { companyFaker } from '../../../../functional/cypress/fakers/companies'
import {
  UNITED_KINGDOM_ID,
  CANADA_ID,
} from '../../../../../src/common/constants'
import { currencyGBP } from '../../../../../src/client/utils/number-utils'

const companyGlobalUltimateAllDetails = companyFaker({
  companyNumber: '01261539',
  address: {
    line1: '1 On The Road',
    line2: '',
    town: 'Bristol',
    county: 'North Somerset',
    postcode: 'BS20 2BB',
    country: {
      id: UNITED_KINGDOM_ID,
      name: 'United Kingdom',
    },
  },
  website: 'www.there.com',
  numberOfEmployees: 200,
  turnoverGbp: 200000,
  sector: {
    name: 'Aerospace',
    id: '9538cecc-5f95-e211-a939-e4115bead28a',
  },
  globalUltimateCountry: 'United Kingdom',
})

const companyNoGlobalUltimateAllDetails = companyFaker({
  companyNumber: '01261539',
  address: {
    line1: '1 On The Road',
    line2: '',
    town: 'Bristol',
    county: 'North Somerset',
    postcode: 'BS20 2BB',
    country: {
      id: UNITED_KINGDOM_ID,
      name: 'United Kingdom',
    },
  },
  website: 'www.there.com',
  numberOfEmployees: 200,
  turnoverGbp: 200000,
  sector: {
    name: 'Aerospace',
    id: '9538cecc-5f95-e211-a939-e4115bead28a',
  },
  globalUltimateCountry: null,
})

const companyRegisteredAddressOnly = companyFaker({
  companyNumber: '01261539',
  address: null,
  registeredAddress: {
    line1: '1 On The Road',
    line2: '',
    town: 'Bristol',
    county: 'North Somerset',
    postcode: 'BS20 2BB',
    country: {
      id: UNITED_KINGDOM_ID,
      name: 'United Kingdom',
    },
  },
  website: 'www.there.com',
  numberOfEmployees: 200,
  turnoverGbp: 200000,
  sector: {
    name: 'Aerospace',
    id: '9538cecc-5f95-e211-a939-e4115bead28a',
  },
  globalUltimateCountry: null,
})

const companyNoDetails = companyFaker({
  companyNumber: null,
  address: null,
  website: null,
  numberOfEmployees: null,
  turnoverGbp: null,
  sector: null,
})

const companyNonUK = companyFaker({
  companyNumber: '01261539',
  address: {
    line1: '1 Off The Road',
    line2: '',
    town: 'Montreal',
    county: 'QC',
    postcode: 'H3Z 2Y7',
    country: {
      id: CANADA_ID,
      name: 'Canada',
    },
  },
  website: 'www.there.com',
  numberOfEmployees: 200,
  turnoverGbp: 200000,
  sector: {
    name: 'Aerospace',
    id: '9538cecc-5f95-e211-a939-e4115bead28a',
  },
  globalUltimateCountry: 'Canada',
})

const CardContainer = styled('div')`
  border: 1px solid #b1b4b6;
  padding: 20px;
  margin-bottom: 20px;
`

const assertTable = ({ element, rows }) => {
  cy.get(element).as('table')

  cy.get('@table')
    .find('tbody')
    .find('tr')
    .each((el, i) => {
      cy.wrap(el)
        .children()
        .each((el, j) => {
          cy.wrap(el).should('have.text', rows[i][j])
        })
    })
}

describe('BusinessDetailsCard', () => {
  const Component = (props) => <BusinessDetailsCard {...props} />

  context(
    'When the company has global headquarter and all information set',
    () => {
      beforeEach(() => {
        cy.mount(
          <CardContainer>
            <Component company={companyGlobalUltimateAllDetails} />
          </CardContainer>
        )
      })

      it('should render the right text', () => {
        assertTable({
          element: '[data-test="businessDetailsContainer"]',
          rows: [
            [
              'Companies House',
              `${companyGlobalUltimateAllDetails.companyNumber} (opens in new tab)`,
            ],
            [
              'Trading Address',
              companyGlobalUltimateAllDetails.address.line1 +
                companyGlobalUltimateAllDetails.address.line2 +
                companyGlobalUltimateAllDetails.address.town +
                companyGlobalUltimateAllDetails.address.postcode,
            ],
            [
              'Website',
              `${companyGlobalUltimateAllDetails.website} (opens in new tab)`,
            ],
            [
              'Turnover',
              currencyGBP(companyGlobalUltimateAllDetails.turnoverGbp, {
                maximumSignificantDigits: 2,
              }),
            ],
            [
              'Number of Employees',
              companyGlobalUltimateAllDetails.numberOfEmployees,
            ],
            ['DBT Sector', companyGlobalUltimateAllDetails.sector.name],
            [
              'Headquarter Location',
              companyGlobalUltimateAllDetails.globalUltimateCountry +
                'View company tree',
            ],
            ['View full business details'],
          ],
        })
      })

      it('should contain four links', () => {
        cy.get('[data-test="companies-house-link"]')
          .should('exist')
          .should(
            'have.attr',
            'href',
            `https://beta.companieshouse.gov.uk/company/${companyGlobalUltimateAllDetails.companyNumber}`
          )
        cy.get('[data-test="website-link"]')
          .should('exist')
          .should('have.attr', 'href', companyGlobalUltimateAllDetails.website)
        cy.get('[data-test="company-tree-link"]')
          .should('exist')
          .should(
            'have.attr',
            'href',
            `/companies/${companyGlobalUltimateAllDetails.id}/company-tree`
          )
        cy.get('[data-test="business-page-link"]')
          .should('exist')
          .should(
            'have.attr',
            'href',
            `/companies/${companyGlobalUltimateAllDetails.id}/business-details`
          )
      })
    }
  )

  context(
    'When the company has no global headquarter but all other information is set',
    () => {
      beforeEach(() => {
        cy.mount(
          <CardContainer>
            <Component company={companyNoGlobalUltimateAllDetails} />
          </CardContainer>
        )
      })

      it('should render the right text', () => {
        assertTable({
          element: '[data-test="businessDetailsContainer"]',
          rows: [
            [
              'Companies House',
              `${companyNoGlobalUltimateAllDetails.companyNumber} (opens in new tab)`,
            ],
            [
              'Trading Address',
              companyNoGlobalUltimateAllDetails.address.line1 +
                companyNoGlobalUltimateAllDetails.address.line2 +
                companyNoGlobalUltimateAllDetails.address.town +
                companyNoGlobalUltimateAllDetails.address.postcode,
            ],
            [
              'Website',
              `${companyNoGlobalUltimateAllDetails.website} (opens in new tab)`,
            ],
            [
              'Turnover',
              currencyGBP(companyNoGlobalUltimateAllDetails.turnoverGbp, {
                maximumSignificantDigits: 2,
              }),
            ],
            [
              'Number of Employees',
              companyNoGlobalUltimateAllDetails.numberOfEmployees,
            ],
            ['DBT Sector', companyNoGlobalUltimateAllDetails.sector.name],
            ['View full business details'],
          ],
        })
      })

      it('should contain three links', () => {
        cy.get('[data-test="companies-house-link"]')
          .should('exist')
          .should(
            'have.attr',
            'href',
            `https://beta.companieshouse.gov.uk/company/${companyNoGlobalUltimateAllDetails.companyNumber}`
          )
        cy.get('[data-test="website-link"]')
          .should('exist')
          .should(
            'have.attr',
            'href',
            companyNoGlobalUltimateAllDetails.website
          )
        cy.get('[data-test="company-tree-link"]').should('not.exist')
        cy.get('[data-test="business-page-link"]')
          .should('exist')
          .should(
            'have.attr',
            'href',
            `/companies/${companyNoGlobalUltimateAllDetails.id}/business-details`
          )
      })
    }
  )

  context('When the company is not in the UK', () => {
    beforeEach(() => {
      cy.mount(
        <CardContainer>
          <Component company={companyNonUK} />
        </CardContainer>
      )
    })

    it('should render the right text that does not contain the companies house field', () => {
      assertTable({
        element: '[data-test="businessDetailsContainer"]',
        rows: [
          [
            'Trading Address',
            companyNonUK.address.line1 +
              companyNonUK.address.line2 +
              companyNonUK.address.town +
              companyNonUK.address.postcode,
          ],
          ['Website', `${companyNonUK.website} (opens in new tab)`],
          [
            'Turnover',
            currencyGBP(companyNonUK.turnoverGbp, {
              maximumSignificantDigits: 2,
            }),
          ],
          ['Number of Employees', companyNonUK.numberOfEmployees],
          ['DBT Sector', companyNonUK.sector.name],
          [
            'Headquarter Location',
            companyNonUK.globalUltimateCountry + 'View company tree',
          ],
          ['View full business details'],
        ],
      })
    })

    it('should contain only three links', () => {
      cy.get('[data-test="companies-house-link"]').should('not.exist')
      cy.get('[data-test="website-link"]')
        .should('exist')
        .should('have.attr', 'href', companyNonUK.website)
      cy.get('[data-test="company-tree-link"]')
        .should('exist')
        .should(
          'have.attr',
          'href',
          `/companies/${companyNonUK.id}/company-tree`
        )
      cy.get('[data-test="business-page-link"]')
        .should('exist')
        .should(
          'have.attr',
          'href',
          `/companies/${companyNonUK.id}/business-details`
        )
    })
  })

  context('When the company has no information set', () => {
    beforeEach(() => {
      cy.mount(
        <CardContainer>
          <Component company={companyNoDetails} />
        </CardContainer>
      )
    })

    it('should render the right text', () => {
      assertTable({
        element: '[data-test="businessDetailsContainer"]',
        rows: [
          ['Trading Address', `Not set`],
          ['Website', `Not set`],
          ['Turnover', `Not set`],
          ['Number of Employees', `Not set`],
          ['DBT Sector', `Not set`],
          ['View full business details'],
        ],
      })
    })

    it('should contain only the business details link', () => {
      cy.get('[data-test="companies-house-link"]').should('not.exist')
      cy.get('[data-test="website-link"]').should('not.exist')
      cy.get('[data-test="company-tree-link"]').should('not.exist')
      cy.get('[data-test="business-page-link"]')
        .should('exist')
        .should(
          'have.attr',
          'href',
          `/companies/${companyNoDetails.id}/business-details`
        )
    })
  })

  context('When the company only has a UK registered address', () => {
    beforeEach(() => {
      cy.mount(
        <CardContainer>
          <Component company={companyRegisteredAddressOnly} />
        </CardContainer>
      )
    })

    it('should still show the Company House field if set', () => {
      assertTable({
        element: '[data-test="businessDetailsContainer"]',
        rows: [
          [
            'Companies House',
            `${companyRegisteredAddressOnly.companyNumber} (opens in new tab)`,
          ],
          ['Trading Address', 'Not set'],
          [
            'Website',
            `${companyRegisteredAddressOnly.website} (opens in new tab)`,
          ],
          [
            'Turnover',
            currencyGBP(companyRegisteredAddressOnly.turnoverGbp, {
              maximumSignificantDigits: 2,
            }),
          ],
          [
            'Number of Employees',
            companyRegisteredAddressOnly.numberOfEmployees,
          ],
          ['DBT Sector', companyRegisteredAddressOnly.sector.name],
          ['View full business details'],
        ],
      })
    })
  })
})
