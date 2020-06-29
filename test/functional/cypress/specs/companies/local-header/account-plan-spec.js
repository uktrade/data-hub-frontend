const selectors = require('../../../../../selectors')
const fixtures = require('../../../fixtures')
const urls = require('../../../../../../src/lib/urls')

const companyLocalHeader = selectors.companyLocalHeader()

describe('Local header for company with an account plan', () => {
  context(
    'when visting a company which has an account plan (no contact email)',
    () => {
      before(() => {
        cy.visit(urls.companies.activity.index(fixtures.company.dnbCorp.id))
      })

      it('should display the company name', () => {
        cy.get(companyLocalHeader.companyName).contains(
          fixtures.company.dnbCorp.name
        )
      })

      it('should display the account plan message', () => {
        cy.get(companyLocalHeader.accountPlanMessage).contains(
          'Go to Sharepoint to view the account plan for DnB Corp (opens in a new ' +
            'window or tab). You might have to request access to this file.'
        )
      })
    }
  )
  context(
    'when visting a company which has an account plan (including contact email)',
    () => {
      before(() => {
        cy.visit(urls.companies.activity.index(fixtures.company.oneListCorp.id))
      })

      it('should display the company name', () => {
        cy.get(companyLocalHeader.companyName).contains(
          fixtures.company.oneListCorp.name
        )
      })

      it('should display the account plan message', () => {
        cy.get(companyLocalHeader.accountPlanMessage).contains(
          'Go to Sharepoint to view the account plan for One List Corp (opens in ' +
            'a new window or tab). You might have to request access to this file. ' +
            'To do so, contact the Global Account Manager at travis@example.net'
        )
      })
    }
  )
  context('when visting a company which does not have an account plan', () => {
    before(() => {
      cy.visit(urls.companies.activity.index(fixtures.company.venusLtd.id))
    })

    it('should display the company name', () => {
      cy.get(companyLocalHeader.companyName).contains(
        fixtures.company.venusLtd.name
      )
    })

    it('should not display the account plan message', () => {
      cy.get(companyLocalHeader.accountPlanMessage).should('not.exist')
    })
  })
})
