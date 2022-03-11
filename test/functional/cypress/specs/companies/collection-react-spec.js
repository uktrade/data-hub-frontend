import { assertBreadcrumbs } from '../../support/assertions'
import urls from '../../../../../src/lib/urls'

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
  const company2 = companyFaker({
    trading_names: ['Company Corp', 'Company Ltd'],
    headquarter_type: {
      id: 'ukhq-id',
      name: 'ukhq',
    },
    uk_region: {
      id: '874cd12a-6095-e211-a939-e4115bead28a',
      name: 'London',
    },
  })
  const company3 = companyFaker({
    address: {
      line_1: '123 Fake Street',
      line_2: 'Fake Borough',
      town: 'New York',
      postcode: '12345',
    },
    headquarter_type: {
      id: 'ghq-id',
      name: 'ghq',
    },
    global_headquarters: {
      id: 'company-id',
      name: 'Company Ltd, New York',
    },
    uk_region: null,
  })
  const otherCompanies = companyListFaker(7)
  const companyList = [company1, company2, company3, ...otherCompanies]

  before(() => {
    cy.intercept('POST', '/v4/search/company', {
      body: {
        count: companyList.length,
        results: companyList,
      },
    }).as('apiRequest')
    cy.visit(urls.companies.index())
    cy.wait('@apiRequest')
  })

  beforeEach(() => {
    cy.get('[data-test="collection-list"]').as('collectionList')
    cy.get('[data-test="collection-item"]').as('collectionItems')
    cy.get('@collectionItems').eq(0).as('firstListItem')
    cy.get('@collectionItems').eq(1).as('secondListItem')
    cy.get('@collectionItems').eq(2).as('thirdListItem')
  })

  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: '/',
      Companies: null,
    })
  })

  it('should have a link to add company', () => {
    cy.get('[data-test="add-collection-item-button"]')
      .should('exist')
      .should('contain', 'Add company')
      .should('have.attr', 'href', '/companies/create')
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

  it('should contain trading names', () => {
    cy.get('@secondListItem')
      .find('[data-test="metadata"]')
      .should('contain', 'Company Corp, Company Ltd')
  })

  it('should contain UK HQ Badge', () => {
    cy.get('@secondListItem')
      .find('[data-test="badge"]')
      .should('contain', 'UK HQ')
  })

  it('should contain UK Region Badge', () => {
    cy.get('@secondListItem')
      .find('[data-test="badge"]')
      .should('contain', 'London')
  })

  it('should contain Global HQ Badge', () => {
    cy.get('@thirdListItem')
      .find('[data-test="badge"]')
      .should('contain', 'Global HQ')
    cy.get('@thirdListItem')
      .find('[data-test="metadata"]')
      .should('contain', company3.global_headquarters.name)
  })
})
