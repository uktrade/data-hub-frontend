const urls = require('../../../../../src/lib/urls')
const { assertBreadcrumbs } = require('../../support/assertions')
const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

describe('Investment project details', () => {
  context('When the current stage is at Won', () => {
    before(() => {
      cy.visit(
        urls.investments.projects.details(fixtures.investment.stageWon.id)
      )
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        Investments: urls.investments.index(),
        Projects: urls.investments.projects.index(),
        [fixtures.investment.stageWon.name]: null,
      })
    })

    it('should render a blue info banner', () => {
      cy.get(selectors.message.info).should(
        'have.text',
        'This project has been verified as won. You should not make any changes to this project.' +
          'If you would like to make changes, please contact the Investment Promotion Performance team.'
      )
    })
  })

  context('When and FDI investment type is missing an FDI Type', () => {
    before(() => {
      cy.visit(
        urls.investments.projects.details(
          fixtures.investment.fdiInvestmentWithNoFDIType.id
        )
      )
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        Investments: urls.investments.index(),
        Projects: urls.investments.projects.index(),
        [fixtures.investment.fdiInvestmentWithNoFDIType.name]: null,
      })
    })

    it('should render a summary containing None FDI type replacing undefined', () => {
      cy.get("[data-test='summaryContainer-content']").contains(
        'Investment type'
      )
      cy.get("[data-test='summaryContainer-content']").contains('FDI, None')
    })
  })
})
