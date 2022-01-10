const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const urls = require('../../../../../src/lib/urls')
const { assertKeyValueTable } = require('../../support/assertions')
const { formatWithoutParsing } = require('../../../../../src/client/utils/date')
const {
  clickSaveAndReturnButton,
} = require('../../../../functional/cypress/support/form-fillers')
const {
  clickAddEventButton,
  fillEventType,
  fillEventForm,
} = require('../../../../functional/cypress/support/eventform-fillers')

const today = new Date()

const createEvent = () => {
  fillEventForm({
    address1: 'Address1',
    address2: 'Address2',
    postcode: 'POST CODE',
    town: 'Campinas',
    country: 'Brazil',
    endDate: {
      year: formatWithoutParsing(today, 'yyyy'),
      month: formatWithoutParsing(today, 'MM'),
      day: formatWithoutParsing(today, 'dd'),
    },
    eventType: 'Account management',
    leadTeam: 'Advanced Manufacturing Sector',
    locationType: 'HQ',
    eventName: 'Eventful event',
    notes: 'Testing a valid form for all fields',
    organiser: 'Barry Oling',
    hasRelatedTradeAgreements: true,
    relatedTradeAgreements: [
      'UK-Australia Mutual Recognition Agreement',
      'UK-India Free Trade Agreement',
    ],
    relatedProgrammes: ['CEN Energy', 'CEN Services'],
    startDate: {
      year: formatWithoutParsing(today, 'yyyy'),
      month: formatWithoutParsing(today, 'MM'),
      day: formatWithoutParsing(today, 'dd'),
    },
    eventShared: true,
    teams: ['Biopartner'],
    service: 'Account Management : Northern Powerhouse',
  })

  clickAddEventButton()

  cy.contains(`'Eventful event' event has been created`).should('be.visible')
}

describe('Event', () => {
  describe('create', () => {
    beforeEach(() => {
      cy.visit(urls.events.create())
    })

    it('should throw validation messages for required fields', () => {
      clickAddEventButton()

      cy.get(selectors.eventCreate.hasRelatedTradeAgreementsFieldId).should(
        'contain',
        'Answer if the event is related to a trade agreement'
      )
      cy.get(selectors.eventCreate.eventNameFieldId).should(
        'contain',
        'Enter an event name'
      )

      cy.get(selectors.eventCreate.eventTypeFieldId).should(
        'contain',
        'Select at least one event type'
      )
      cy.get(selectors.eventCreate.startDateFieldId).should(
        'contain',
        'Enter a valid start date'
      )
      cy.get(selectors.eventCreate.endDateFieldId).should(
        'contain',
        'Enter a valid end date'
      )
      cy.get(selectors.eventCreate.addressLine1FieldId).should(
        'contain',
        'Enter an Address line 1'
      )
      cy.get(selectors.eventCreate.addressTownFieldId).should(
        'contain',
        'Enter a town or city'
      )
      cy.get(selectors.eventCreate.addressPostcodeFieldId).should(
        'contain',
        'Enter a postcode'
      )
      cy.get(selectors.eventCreate.addressCountryFieldId).should(
        'contain',
        'Enter a country'
      )
      cy.get(selectors.eventCreate.serviceFieldId).should(
        'contain',
        'Select at least one service'
      )
      cy.get(selectors.eventCreate.organiserFieldId).should(
        'contain',
        'Enter at least one organiser'
      )
    })

    it('should create an event successfully', () => {
      createEvent()
    })

    it('should create an attendee on a event', () => {
      createEvent()

      cy.visit(urls.events.index())
      cy.contains('Eventful event').click()
      cy.contains('Attendees').click()
      cy.get(selectors.entityCollection.addAttendee).click()

      cy.get(selectors.nav.searchTerm).type('dean cox').type('{enter}')
      cy.get(selectors.collection.items).click()

      cy.get(selectors.message.flashMessages)
        .should(
          'contain',
          'Event attendee added - This has created a service delivery record.'
        )
        .and(
          'contain',
          'If required, you can view or edit the service delivery directly from the attendee record.'
        )
    })
  })

  describe('edit', () => {
    beforeEach(() => {
      cy.visit(urls.events.index())
    })

    it('should display newly created event in collection page', () => {
      cy.get('[data-test="collection-item"]')
        .eq(0)
        .should('contain', 'Eventful event')
    })

    it('should edit event details', () => {
      cy.get('[data-test="collection-item"]')
        .eq(0)
        .should('contain', 'Account management')
      cy.contains('Eventful event').click()
      cy.get(selectors.entityCollection.editEvent).click()
      fillEventType('Exhibition')
      clickSaveAndReturnButton()

      assertKeyValueTable('bodyMainContent', {
        'Type of event': 'Exhibition',
      })
    })
  })

  describe('Add attendee', () => {
    const event = fixtures.event.create.defaultEvent()
    const company = fixtures.company.create.defaultCompany('attendee testing')
    const contact = fixtures.contact.create(company.pk, 'Joe', 'Attendee')

    before(() => {
      cy.loadFixture([event, company, contact])
    })

    it('Should add an interaction with the attendee', () => {
      cy.visit(urls.events.details(event.pk))
      cy.contains('a', 'Attendees').click()
      cy.contains('Add attendee').click()
      cy.get('input').type('Attendee')
      cy.contains('button', 'Search').click()
      cy.get('[data-test="item-contact-0"] a')
        .should('contain', 'Joe Attendee')
        .click()
      cy.contains('Event attendee added')
    })

    it('Should not be able to add a duplicate attendee', () => {
      cy.visit(urls.events.details(event.pk))
      cy.contains('a', 'Attendees').click()
      cy.contains('Add attendee').click()
      cy.get('input').type('Attendee')
      cy.contains('button', 'Search').click()
      cy.get('[data-test="item-contact-0"]').contains('Joe Attendee')
      cy.get('[data-test="item-contact-0"]').contains('Existing attendee')
    })
  })

  describe('Attempting to view non-existent event', () => {
    it('should have a 404 error', () => {
      cy.request({
        url: urls.events.details(1234),
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404)
      })
    })
  })
})
