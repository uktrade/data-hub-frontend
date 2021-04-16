const fixtures = require('../../../fixtures')
const selectors = require('../../../../../selectors')
const urls = require('../../../../../../src/lib/urls')

const { dnbCorp } = fixtures.company

describe('Company Investment Project Collection', () => {
  before(() => {
    cy.visit(urls.companies.investments.companyInvestmentProjects(dnbCorp))
  })

  it('should render a meta title', () => {
    cy.title().should(
      'eq',
      'Investments - Zboncak Group|271eb29e-425b-4cd8-b386-3208c3a5f978 - Companies - DIT Data Hub'
    )
  })

  it('should load investment collection where projects have no sector', () => {
    cy.get(selectors.collection.items).first().should('not.have.text', 'Sector')
  })
})
