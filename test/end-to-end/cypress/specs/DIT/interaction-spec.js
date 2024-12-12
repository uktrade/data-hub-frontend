const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const {
  formatDate,
  DATE_FORMAT_FULL,
} = require('../../../../../src/client/utils/date-utils')
const { companies, interactions } = require('../../../../../src/lib/urls')
const {
  assertSummaryTable,
} = require('../../../../functional/cypress/support/assertions')

const today = formatDate(new Date(), DATE_FORMAT_FULL)

const selectInteractionType = (theme, kind) => {
  cy.contains('label', theme).click()
  kind && cy.contains('label', kind).click()
  cy.contains('button', 'Continue').click()
}

describe('Interaction', () => {
  const company = fixtures.company.create.defaultCompany('interaction testing')
  const contact = fixtures.contact.create(company.pk)
  before(() => {
    cy.loadFixture([company])
    cy.loadFixture([contact])
  })

  beforeEach(() => {
    cy.visit(companies.interactions.create(company.pk))
    selectInteractionType('Export', 'A standard interaction')
  })

  context('An interaction with no countries discussed', () => {
    it('should add the interaction', () => {
      const subject = 'Some interesting interaction'
      const formSelectors = selectors.interactionForm

      cy.get(formSelectors.service).select('Export win')
      cy.get(formSelectors.hasRelatedTradeAgreementsNo).click()
      cy.get(formSelectors.contact).selectTypeaheadOption('Johnny Cakeman')
      cy.get(formSelectors.communicationChannel).selectTypeaheadOption(
        'Email/Website'
      )
      cy.get(formSelectors.subject).type(subject)
      cy.get(formSelectors.notes).type('Conversation with potential client')
      cy.get(formSelectors.policyFeedbackNo).click()
      cy.get(formSelectors.countriesDiscussed.no).click()
      cy.get(formSelectors.exportBarrier.no).click()
      cy.get(formSelectors.add).click()

      cy.contains('h1', subject)

      cy.visit(interactions.index())
      cy.get('[data-test="my-interactions-filter"]').find('input').click()

      cy.get('[data-test="collection-item"]')
        .should('contain', 'Some interesting interaction')
        .and('contain', 'Johnny Cakeman')
        .and('contain', 'interaction testing')
        .and(
          'contain',
          'DIT Staff, UKTI Team East Midlands - International Trade Team'
        )
        .and('contain', 'Export win')
        .and('contain', today)
    })
  })

  context('An interaction where countries were discussed', () => {
    context('A unique country is added to each category', () => {
      it('should add the interaction', () => {
        const subject = 'Some interesting interaction about countries'
        const formSelectors = selectors.interactionForm

        cy.get(formSelectors.service).select('Export win')
        cy.get(formSelectors.hasRelatedTradeAgreementsNo).click()
        cy.get(formSelectors.contact).selectTypeaheadOption('Johnny Cakeman')
        cy.get(formSelectors.communicationChannel).selectTypeaheadOption(
          'Email/Website'
        )
        cy.get(formSelectors.subject).type(subject)
        cy.get(formSelectors.notes).type(
          'Conversation with potential client about countries'
        )
        cy.get(formSelectors.policyFeedbackNo).click()
        cy.get(formSelectors.countriesDiscussed.yes).click()
        cy.get(formSelectors.countries.export).selectTypeaheadOption('Fran')
        cy.get(formSelectors.countries.future).selectTypeaheadOption('Germ')
        cy.get(formSelectors.countries.noInterest).selectTypeaheadOption('Spai')
        cy.get(formSelectors.exportBarrier.no).click()
        cy.get(formSelectors.add).click()

        assertSummaryTable({
          dataTest: 'interaction-details-table',
          heading: null,
          showEditLink: false,
          content: {
            Company: 'interaction testing',
            'Contact(s)': 'Johnny Cakeman',
            Service: 'Export win',
            Notes: 'Conversation with potential client about countries',
            'Date of interaction': today,
            'Adviser(s)':
              'DIT Staff, UKTI Team East Midlands - International Trade Team',
            'Communication channel': 'Email/Website',
            'Countries currently exporting to': 'France',
            'Future countries of interest': 'Germany',
            'Countries not interested in': 'Spain',
          },
        })

        cy.visit(companies.exports.index(company.pk))

        cy.contains('Export countries information')
          .parent()
          .should('contain', 'Currently exporting toFrance')
          .and('contain', 'Future countries of interestGermany')
          .and('contain', 'Countries of no interestSpain')
      })
    })

    context('The same country is added to two categories', () => {
      it('should get an error saving the interaction', () => {
        const subject = 'Some interesting interaction about countries'
        const formSelectors = selectors.interactionForm

        cy.get(formSelectors.service).select('Export win')
        cy.get(formSelectors.contact).selectTypeaheadOption('Johnny Cakeman')
        cy.get(formSelectors.communicationChannel).selectTypeaheadOption(
          'Email/Website'
        )
        cy.get(formSelectors.subject).type(subject)
        cy.get(formSelectors.notes).type(
          'Conversation with potential client about countries'
        )
        cy.get(formSelectors.policyFeedbackNo).click()
        cy.get(formSelectors.countriesDiscussed.yes).click()
        cy.get(formSelectors.countries.export).selectTypeaheadOption('Fran')
        cy.get(formSelectors.countries.future).selectTypeaheadOption('Fran')
        cy.get(formSelectors.exportBarrier.no).click()
        cy.get(formSelectors.add).click()

        cy.contains(
          'A country that was discussed cannot be entered in multiple fields'
        )
      })
    })

    context('The no countries are added to any categories', () => {
      it('should get an error saving the interaction', () => {
        const subject = 'Some interesting interaction about countries'
        const formSelectors = selectors.interactionForm

        cy.get(formSelectors.service).select('Export win')
        cy.get(formSelectors.contact).selectTypeaheadOption('Johnny Cakeman')
        cy.get(formSelectors.communicationChannel).selectTypeaheadOption(
          'Email/Website'
        )
        cy.get(formSelectors.subject).type(subject)
        cy.get(formSelectors.notes).type(
          'Conversation with potential client about countries'
        )
        cy.get(formSelectors.policyFeedbackNo).click()
        cy.get(formSelectors.countriesDiscussed.yes).click()
        cy.get(formSelectors.exportBarrier.no).click()
        cy.get(formSelectors.add).click()

        cy.contains('Select at least one country in one of the three fields')
      })
    })
  })
})

describe('Service delivery', () => {
  const company = fixtures.company.create.defaultCompany('interaction testing')
  const contact = fixtures.contact.create(company.pk)

  before(() => {
    cy.loadFixture([company])
    cy.loadFixture([contact])
  })

  beforeEach(() => {
    cy.visit(companies.interactions.create(company.pk))
    selectInteractionType('Export', 'A service you have provided')
  })

  it('should create the service delivery', () => {
    const subject = 'Some interesting service delivery'
    const formSelectors = selectors.interactionForm

    cy.get(formSelectors.service).select('Export win')
    cy.get(formSelectors.hasRelatedTradeAgreementsNo).click()
    cy.get(formSelectors.contact).selectTypeaheadOption('Johnny Cakeman')
    cy.get(formSelectors.eventNo).click()
    cy.get(formSelectors.subject).type(subject)
    cy.get(formSelectors.notes).type('Conversation with potential client')
    cy.get(formSelectors.policyFeedbackNo).click()
    cy.get(formSelectors.countriesDiscussed.no).click()
    cy.get(formSelectors.exportBarrier.no).click()
    cy.get(formSelectors.add).click()

    cy.contains('h1', subject)
  })

  it('should display newly created service delivery', () => {
    cy.visit(interactions.index())
    cy.get('[data-test="my-interactions-filter"]').find('input').click()

    cy.get('[data-test="collection-item"]')
      .should('contain', 'Some interesting service delivery')
      .and('contain', 'Johnny Cakeman')
      .and('contain', 'interaction testing')
      .and(
        'contain',
        'DIT Staff, UKTI Team East Midlands - International Trade Team'
      )
      .and('contain', 'Export win')
      .and('contain', today)
  })
})
