import { assertBreadcrumbs } from '../../support/assertions'
import { companies } from '../../../../../src/lib/urls'

import { companyFaker, companyListFaker } from '../../fakers/companies'

describe('Company Collections - React', () => {
  const company1 = companyFaker({
    address: {
      line_1: 'Level 6, Avenue K Tower',
      line_2: '156 Jalan Ampang',
      town: 'Kuala Lumpur',
      postcode: '50450',
      country: {
        id: 'malaysia-123',
        name: 'Malaysia',
      },
    },
    sector: {
      id: 'b1959812-6095-e211-a939-e4115bead28a',
      name: 'Energy',
    },
  })
  const otherCompanies = companyListFaker(9)
  const companyList = [company1, ...otherCompanies]

  before(() => {
    cy.intercept('POST', '/api-proxy/v4/search/company', {
      body: {
        count: companyList.length,
        results: companyList,
      },
    }).as('apiRequest')
    // Visit the new react companies page - note this will need to be changed
    // to `companies.index()` when ready
    cy.visit(companies.react.index())
    cy.wait('@apiRequest')
  })

  beforeEach(() => {
    cy.get('[data-test="collection-list"]').as('collectionList')
    cy.get('[data-test="collection-item"]').as('collectionItems')
    cy.get('@collectionItems').eq(0).as('firstListItem')
  })

  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: '/',
      Companies: null,
    })
  })

  it('should display a list of companies', () => {
    cy.get('@collectionList').should('have.length', 1)
    cy.get('@collectionItems').should('have.length', companyList.length)
  })

  it('should contain country badge', () => {
    cy.get('@firstListItem')
      .find('[data-test="badge"]')
      .eq(0)
      .should('contain', 'Malaysia')
  })

  it('should contain company sector and primary address', () => {
    cy.get('@firstListItem')
      .find('[data-test="metadata"]')
      .should('contain', 'Energy')
      .and(
        'contain',
        'Level 6, Avenue K Tower, 156 Jalan Ampang, Kuala Lumpur, 50450, Malaysia'
      )
  })
})
