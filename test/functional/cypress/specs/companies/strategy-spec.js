const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

describe('Company account management strategy', () => {
  context('When visiting the strategy create page', () => {
    it('should display the h1 heading of Strategy', () => {
      cy.visit(
        urls.companies.accountManagement.create(
          fixtures.company.allActivitiesCompany.id
        )
      )
      cy.get('h1').contains('Strategy')
    })
  })
})
