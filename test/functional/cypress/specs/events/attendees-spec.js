const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const urls = require('../../../../../src/lib/urls')

const {
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')

describe('Event Attendees', () => {
  context('Enabled events', () => {
    before(() => {
      cy.visit(`/events/${fixtures.event.oneDayExhibition.id}/attendees`)
      cy.get('.c-collection').as('collectionList')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Events: urls.events.index(),
        'One-day exhibition': null,
      })
    })

    it('should render the header', () => {
      assertLocalHeader('One-day exhibition')
    })

    it('should display a collection header', () => {
      cy.get('main article h2').should('contain', 'Event Attendees')
    })

    it('should display attendee collection list', () => {
      cy.get(selectors.entityCollection.collection)
        .find('header')
        .should('contain', '1,233')
        .parent()
        .find('span')
        .should('contain', 'Page 1 of 13')
        .parents('header')
        .next()
        .find('li')
        .should('have.length', 100)
    })

    it('should be able to use the pagination', () => {
      cy.get(selectors.entityCollection.collection)
        .find('nav ul li')
        .as('pageLinks')
        .eq(1)
        .click()

      cy.get(selectors.entityCollection.collection)
        .find('header')
        .should('contain', 'Page 2 of 13')

      cy.get('@pageLinks').eq(0).click()

      cy.get(selectors.entityCollection.collection)
        .find('header')
        .should('contain', 'Page 1 of 13')
    })
  })
  context('Disabled events', () => {
    before(() => {
      cy.visit(`/events/${fixtures.event.teddyBearExpo.id}/attendees`)
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Events: urls.events.index(),
        'Teddy bear expo': null,
      })
    })

    it('should render the header', () => {
      assertLocalHeader('Teddy bear expo')
    })

    it('should display a message indicating when the event was disabled', () => {
      assertLocalHeader(
        'This event was disabled on 5 September 2017 and can no longer be edited'
      )
    })

    it('should not display add attendees button for disabled events', () => {
      cy.get(selectors.entityCollection.addAttendee).should('not.exist')
    })

    it('should display a message indicating that you cannot add an event attendee', () => {
      cy.get('main article h2')
        .next()
        .should(
          'contain',
          'You cannot add an event attendee because the event has been disabled.'
        )
    })

    it('should display a collection header', () => {
      cy.get('main article h2').should('contain', 'Event Attendees')
    })

    it('should display attendee collection list', () => {
      cy.get(selectors.collection.headerCount).should('contain', '1,233')
    })
  })
})
