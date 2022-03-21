// const selectors = require('../../../../selectors')
const {
  activityStreamResults,
} = require('../../../../../src/client/components/ContactInteractions/fixtures/activityStreamResults')
const urls = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')

describe('Contact interactions', () => {
  context('when viewing a contact with data on Activity Stream', () => {
    before(() => {
      const contactId = fixtures.contact.deanCox.id
      cy.intercept(
        'GET',
        '/api-proxy/v4/activity-feed',
        activityStreamResults
      ).as('apiRequest')
      cy.visit(urls.contacts.contactInteractions(contactId))
      cy.wait('@apiRequest')
    })

    it('should display the Interactions', () => {
      cy.get(`[data-test=aventri]`).should('be.visible')
    })
  })
})
