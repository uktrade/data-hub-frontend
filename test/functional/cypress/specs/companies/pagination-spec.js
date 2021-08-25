import urls from '../../../../../src/lib/urls'

import { companyListFaker } from '../../fakers/companies'

describe('Company Collections - Pagination', () => {
  const companyList = companyListFaker(10)

  it('should show a maximum of 1000 pages', () => {
    cy.intercept('POST', '/api-proxy/v4/search/company', {
      body: {
        count: 20000,
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
        // There are 10 items on a page, so 9990 items require 999 pages
        count: 9990,
        results: companyList,
      },
    }).as('apiRequest')
    cy.visit(urls.companies.index())
    cy.wait('@apiRequest')

    cy.get('[data-test=pagination').should('have.attr', 'data-total-pages', 999)
  })
})
