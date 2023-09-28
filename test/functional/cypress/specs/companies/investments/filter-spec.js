import urls from '../../../../../../src/lib/urls'
import { assertChipExists, assertPayload } from '../../../support/assertions'

const fixtures = require('../../../fixtures')

const { dnbCorp } = fixtures.company
const searchEndpoint = '/api-proxy/v3/search/investment_project'

describe('Company Investments Filter', () => {
  before(() => {
    cy.intercept(
      'GET',
      `/api-proxy${urls.companies.dnbHierarchy.relatedCompaniesCount(
        dnbCorp.id
      )}?include_manually_linked_companies=true`,
      { reduced_tree: false, related_companies_count: 1, total: 1 }
    ).as('relatedCompaniesApiRequest')
    cy.visit(urls.companies.investments.companyInvestmentProjects(dnbCorp.id))
  })

  context('Toggle related companies', () => {
    it('should show expected options', () => {
      cy.get('[data-test="include-related-companies-filter"]').should(
        'be.visible'
      )
      cy.get('[data-test="toggle-section-button"]')
        .contains('Related companies')
        .click()
      cy.get('[data-test="include-related-companies-filter"]').should(
        'not.be.visible'
      )
    })

    it('should filter from the url', () => {
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(
        `${urls.companies.investments.companyInvestmentProjects(
          dnbCorp.id
        )}?page=1&sortby=created_on&include_related_companies=include_parent_companies&include_related_companies=include_subsidiary_companies`
      )
      assertPayload('@apiRequest', {
        limit: 10,
        offset: 0,
        investor_company: [dnbCorp.id],
        sortby: 'created_on',
        include_related_companies: [
          'include_parent_companies',
          'include_subsidiary_companies',
        ],
        include_parent_companies: true,
        include_subsidiary_companies: true,
      })
      assertChipExists({
        label: 'Include related companies: Parent companies',
        position: 1,
      })
      assertChipExists({
        label: 'Include related companies: Subsidiary companies',
        position: 2,
      })
    })
  })
})
