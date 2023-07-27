const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

describe('Company account management', () => {
  context('When visiting the account management page', () => {
    it('should display the h1 heading of Account Management', () => {
      cy.visit(
        urls.companies.accountManagement.index(
          fixtures.company.allActivitiesCompany.id
        )
      )
      cy.get('h1').contains('Account Management')
    })
  })
})
