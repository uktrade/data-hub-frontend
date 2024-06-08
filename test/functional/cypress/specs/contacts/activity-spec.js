const urls = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')

describe('Contact activity', () => {
  const contactId = fixtures.contact.deanCox.id

  context('when viewing a contact with no activity', () => {
    before(() => {
      cy.intercept(
        'GET',
        `${urls.contacts.activity.data(
          contactId
        )}?page=1&selectedSortBy=newest`,
        {
          body: { activities: [] },
        }
      )
      cy.visit(urls.contacts.contactActivities(contactId))
    })

    it('should display 0 activities', () => {
      cy.get('#contact-activity').contains('0 activities')
    })
  })
})
