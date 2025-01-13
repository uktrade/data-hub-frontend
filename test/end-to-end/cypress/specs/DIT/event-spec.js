const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const urls = require('../../../../../src/lib/urls')
const { assertKeyValueTable } = require('../../support/assertions')
const {
  formatDate,
  DATE_FORMAT_DAY,
  DATE_FORMAT_MONTH,
  DATE_FORMAT_YEAR,
} = require('../../../../../src/client/utils/date-utils')
const {
  clickSaveAndReturnButton,
} = require('../../../../functional/cypress/support/form-fillers')
const {
  clickAddEventButton,
  fillEventType,
  fillEventForm,
} = require('../../../../functional/cypress/support/eventform-fillers')

const today = new Date()
const eventName = `Eventful event ${Cypress._.random(0, 1e6)}`

const createEvent = () => {
  fillEventForm({
    address1: 'Address1',
    address2: 'Address2',
    postcode: 'POST CODE',
    town: 'Campinas',
    country: 'Brazil',
    endDate: {
      year: formatDate(today, DATE_FORMAT_YEAR),
      month: formatDate(today, DATE_FORMAT_MONTH),
      day: formatDate(today, DATE_FORMAT_DAY),
    },
    eventType: 'Account management',
    leadTeam: 'Advanced Manufacturing Sector',
    locationType: 'HQ',
    eventName: eventName,
    notes: 'Testing a valid form for all fields',
    organiser: 'Barry Oling',
    hasRelatedTradeAgreements: true,
    relatedTradeAgreements: [
      'UK-Australia Mutual Recognition Agreement',
      'UK-India Free Trade Agreement',
    ],
    relatedProgrammes: ['CEN Energy', 'CEN Services'],
    startDate: {
      year: formatDate(today, DATE_FORMAT_YEAR),
      month: formatDate(today, DATE_FORMAT_MONTH),
      day: formatDate(today, DATE_FORMAT_DAY),
    },
    eventShared: true,
    teams: ['Biopartner'],
    service: 'Account management : Northern Powerhouse',
  })

  clickAddEventButton()

  cy.contains(`'${eventName}' event has been created`).should('be.visible')
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

    it.skip('should create an attendee on a event', () => {
      createEvent()
      // This is here to allow the activity stream to poll the event api and detect the new event.
      //TODO once the activity stream poll is made customisable remove this wait
      cy.wait(120000)

      cy.visit(urls.events.index())
      cy.contains(eventName).click()
      cy.contains('Attendees').click()
      cy.contains('Add attendee').click()

      cy.get('input[name="name"]').type('dean cox').type('{enter}')
      cy.contains('Dean Cox').click()

      cy.contains(
        'Event attendee added - This has created a service delivery record. ' +
          'If required, you can view or edit the service delivery directly from the attendee record.'
      )
    })
  })

  describe.skip('edit', () => {
    beforeEach(() => {
      cy.visit(urls.events.index())
    })

    it('should display newly created event in events page', () => {
      cy.get('[data-test="data-hub-event"]').eq(0).should('contain', eventName)
    })

    it('should edit event details', () => {
      cy.get('[data-test="data-hub-event"]')
        .eq(0)
        .get('[data-test="service-type-label"]')
        .eq(0)
        .invoke('text')
        .should('contain', 'Account management')
      cy.contains(eventName).click()
      cy.contains('a', 'Edit event')
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
      cy.contains('button', 'Attendees').click()
      cy.contains('Add attendee').click()
      cy.get('input[name="name"]').type('Attendee').type('{enter}')
      cy.contains('Joe Attendee').click()
      cy.contains('Event attendee added')
    })

    it('Should not be able to add a duplicate attendee', () => {
      cy.visit(urls.events.details(event.pk))
      cy.contains('button', 'Attendees').click()
      cy.contains('Add attendee').click()
      cy.get('input[name="name"]').type('Attendee').type('{enter}')
      cy.contains('Joe Attendee').click()
      cy.contains('Add attendee').click()
      cy.get('input[name="name"]').type('Attendee').type('{enter}')
      cy.contains('Joe Attendee').click()
      cy.contains(
        'Event attendee not added - This contact has already been added as an event attendee'
      )
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
