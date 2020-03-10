const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

const { companies, interactions } = require('../../../../../src/lib/urls')

const today = Cypress.moment().format('D MMMM YYYY')

describe('Interaction', () => {
  beforeEach(() => {
    cy.visit(
      companies.interactions.createType(
        fixtures.company.venusLtd.id,
        'export',
        'interaction'
      )
    )
  })

  it('should add the interaction', () => {
    const subject = 'Some interesting interaction'

    const formSelectors = selectors.interactionForm

    cy.get(formSelectors.service).select('Export Win')
    cy.get(formSelectors.contact).select('Johnny Cakeman')
    cy.get(formSelectors.communicationChannel).select('Email/Website')
    cy.get(formSelectors.subject).type(subject)
    cy.get(formSelectors.notes).type('Conversation with potential client')
    cy.get(formSelectors.policyFeedbackNo).click()
    cy.get(formSelectors.countriesDiscussed.no).click()

    cy.get(selectors.interactionForm.add).click()
    cy.get(selectors.message.successful).should(
      'contain',
      'Interaction created'
    )

    cy.visit(interactions.index())
    cy.get(selectors.filter.interaction.myInteractions).click()

    cy.get(selectors.collection.items)
      .should('contain', 'Johnny Cakeman')
      .and('contain', 'Some interesting interaction')
      .and('contain', 'Venus Ltd')
      .and(
        'contain',
        'DIT Staff, UKTI Team East Midlands - International Trade Team'
      )
      .and('contain', 'Export Win')
      .and('contain', today)
  })
})

describe('Service delivery', () => {
  beforeEach(() => {
    cy.visit(
      companies.interactions.createType(
        fixtures.company.venusLtd.id,
        'export',
        'service-delivery'
      )
    )
  })

  it('should create the service delivery', () => {
    const subject = 'Some interesting service delivery'

    const formSelectors = selectors.interactionForm

    cy.get(formSelectors.service).select('Export Win')
    cy.get(formSelectors.contact).select('Johnny Cakeman')
    cy.get(formSelectors.eventNo).click()
    cy.get(formSelectors.subject).type(subject)
    cy.get(formSelectors.notes).type('Conversation with potential client')
    cy.get(formSelectors.policyFeedbackNo).click()
    cy.get(formSelectors.countriesDiscussed.no).click()

    cy.get(selectors.interactionForm.add).click()
    cy.get(selectors.message.successful).should(
      'contain',
      'Service delivery created'
    )
  })

  it('should display newly created service delivery', () => {
    cy.visit(interactions.index())
    cy.get(selectors.filter.interaction.myInteractions).click()

    cy.get(selectors.collection.items)
      .should('contain', 'Johnny Cakeman')
      .and('contain', 'Some interesting service delivery')
      .and('contain', 'Venus Ltd')
      .and(
        'contain',
        'DIT Staff, UKTI Team East Midlands - International Trade Team'
      )
      .and('contain', 'Export Win')
      .and('contain', today)
  })
})
