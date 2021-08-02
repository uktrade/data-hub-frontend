const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const urls = require('../../../../../src/lib/urls')
const { assertKeyValueTable } = require('../../support/assertions')
const { formatWithoutParsing } = require('../../../../../src/client/utils/date')

const today = new Date()

const createEvent = () => {
  cy.get(selectors.eventCreate.tradeAgreementExistsYes).click()
  cy.get(selectors.eventCreate.relatedTradeAgreements)
    .eq(0)
    .select('UK-Australia Mutual Recognition Agreement')
  cy.get(selectors.eventCreate.addAnotherTradeAgreement).click()
  cy.get(selectors.eventCreate.relatedTradeAgreements)
    .eq(1)
    .select('UK-India Free Trade Agreement')
  cy.get(selectors.eventCreate.eventName).type('Eventful event')
  cy.get(selectors.eventCreate.eventType).select('Account management')
  cy.get(selectors.eventCreate.startDateDay).type(
    formatWithoutParsing(today, 'dd')
  )
  cy.get(selectors.eventCreate.startDateMonth).type(
    formatWithoutParsing(today, 'MM')
  )
  cy.get(selectors.eventCreate.startDateYear).type(
    formatWithoutParsing(today, 'yyyy')
  )
  cy.get(selectors.eventCreate.endDateDay).type(
    formatWithoutParsing(today, 'dd')
  )
  cy.get(selectors.eventCreate.endDateMonth).type(
    formatWithoutParsing(today, 'MM')
  )
  cy.get(selectors.eventCreate.endDateYear).type(
    formatWithoutParsing(today, 'yyyy')
  )
  cy.get(selectors.eventCreate.addressLine1).type('Address1')
  cy.get(selectors.eventCreate.addressLine2).type('Address2')
  cy.get(selectors.eventCreate.addressTown).type('Campinas')
  cy.get(selectors.eventCreate.addressCountry).select('Brazil')
  cy.get(selectors.eventCreate.service).select(
    'Account Management : Northern Powerhouse'
  )
  cy.get(selectors.eventCreate.organiser).click()
  cy.get(selectors.eventCreate.organiserInput).type('Barry')
  cy.get(selectors.eventCreate.organiserOption).should('be.visible')
  cy.get(selectors.eventCreate.organiserInput).type('{enter}')
  cy.get(selectors.eventCreate.sharedYes).click()
  cy.get(selectors.eventCreate.teams).eq(0).select('Automotive Sector')
  cy.get(selectors.eventCreate.addAnotherSharedTeam).click()
  cy.get(selectors.eventCreate.teams).eq(1).select('Biopartner')
  cy.get(selectors.eventCreate.relatedProgrammes).eq(0).select('CEN Energy')
  cy.get(selectors.eventCreate.addAnotherProgramme).click()
  cy.get(selectors.eventCreate.relatedProgrammes).eq(1).select('CEN Services')

  cy.get(selectors.eventCreate.saveEvent).click()

  cy.get(selectors.message.successful).should('contain', 'Event created')
}

describe('Event', () => {
  describe('create', () => {
    beforeEach(() => {
      cy.visit(urls.events.create())
    })

    it('should throw validation messages for required fields', () => {
      cy.get(selectors.eventCreate.saveEvent).click()
      cy.get(selectors.eventCreate.tradeAgreementError).should(
        'contain',
        'This field is required.'
      )
      cy.get(selectors.eventCreate.nameError).should(
        'contain',
        'This field may not be blank.'
      )
      cy.get(selectors.eventCreate.typeError).should(
        'contain',
        'This field may not be null.'
      )
      cy.get(selectors.eventCreate.startDateError).should(
        'contain',
        'This field may not be null.'
      )
      cy.get(selectors.eventCreate.endDateError).should(
        'contain',
        'This field may not be null.'
      )
      cy.get(selectors.eventCreate.addressLine1Error).should(
        'contain',
        'This field may not be blank.'
      )
      cy.get(selectors.eventCreate.addressTownError).should(
        'contain',
        'This field may not be blank.'
      )
      cy.get(selectors.eventCreate.addressCountryError).should(
        'contain',
        'This field may not be null.'
      )
      cy.get(selectors.eventCreate.serviceError).should(
        'contain',
        'This field may not be null.'
      )
      cy.get(selectors.eventCreate.organiserError).should(
        'contain',
        'This field may not be null.'
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

      cy.get(selectors.message.successful)
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
    before(() => {
      cy.visit(urls.events.index())
    })

    it('should display newly created event in collection page', () => {
      cy.get(selectors.collection.items).should('contain', 'Eventful event')
    })

    it('should edit event details', () => {
      cy.get(selectors.collection.items).should('contain', 'Account management')
      cy.contains('Eventful event').click()
      cy.get(selectors.entityCollection.editEvent).click()
      cy.get(selectors.eventCreate.eventType).select('Exhibition')
      cy.get(selectors.eventCreate.saveAndReturn).click()

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
      cy.get('main li a').should('not.exist')
      cy.get('main li').should('contain', 'Existing attendee')
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
