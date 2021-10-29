import urls from '../../../../../src/lib/urls'

import { companyListFaker } from '../../fakers/companies'

describe('Company Collections - Pagination', () => {
  const companyList = companyListFaker(10)

  it('should show a maximum of 1000 pages', () => {
    cy.intercept('POST', '/api-proxy/v4/search/company', {
      body: {
        // 10 items per page, so 20000 items require 2000 pages
        count: 20000,
        results: companyList,
      },
    }).as('apiRequest')
    cy.visit(urls.companies.index())
    cy.wait('@apiRequest')

    cy.get('[data-test=pagination').should(
      'have.attr',
      'data-total-pages',
      2000
    )
  })

  it('should show 1000 pages', () => {
    cy.intercept('POST', '/api-proxy/v4/search/company', {
      body: {
        // 10 items per page, so 9991 items require 1000 pages
        count: 9991,
        results: companyList,
      },
    }).as('apiRequest')
    cy.visit(urls.companies.index())
    cy.wait('@apiRequest')

    cy.get('[data-test=pagination').should(
      'have.attr',
      'data-total-pages',
      1000
    )
  })

  it('should show up to 999 pages', () => {
    cy.intercept('POST', '/api-proxy/v4/search/company', {
      body: {
        // 10 items per page, so 9990 items require 999 pages.
        count: 9990,
        results: companyList,
      },
    }).as('apiRequest')
    cy.visit(urls.companies.index())
    cy.wait('@apiRequest')

    cy.get('[data-test=pagination').should('have.attr', 'data-total-pages', 999)
  })
})
