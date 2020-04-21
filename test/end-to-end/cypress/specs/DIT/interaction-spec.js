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

  context('An interaction with no countries discussed', () => {
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

  context('An interaction where countries were discussed', () => {
    function selectCountry(id, text) {
      const typeahead = `${id} .multiselect`
      const textInput = `${id} .multiselect__input`

      cy.get(typeahead)
        .click()
        .get(textInput)
        .type(text)
        .type('{enter}')
        .type('{esc}')
    }

    context('A unique country is added to each category', () => {
      it('should add the interaction', () => {
        const subject = 'Some interesting interaction about countries'
        const formSelectors = selectors.interactionForm

        cy.get(formSelectors.service).select('Export Win')
        cy.get(formSelectors.contact).select('Johnny Cakeman')
        cy.get(formSelectors.communicationChannel).select('Email/Website')
        cy.get(formSelectors.subject).type(subject)
        cy.get(formSelectors.notes).type(
          'Conversation with potential client about countries'
        )
        cy.get(formSelectors.policyFeedbackNo).click()
        cy.get(formSelectors.countriesDiscussed.yes).click()
        selectCountry(formSelectors.countries.export, 'Fran')
        selectCountry(formSelectors.countries.future, 'Germ')
        selectCountry(formSelectors.countries.noInterest, 'Spai')

        cy.get(selectors.interactionForm.add).click()
        cy.get(selectors.message.successful)
          .should('contain', 'Interaction created')
          .and('contain', 'You discussed some countries within the interaction')

        cy.get('.table--key-value')
          .should('contain', 'Countries currently exporting toFrance')
          .and('contain', 'Future countries of interestGermany')
          .and('contain', 'Countries not interested inSpain')

        cy.visit(companies.exports.index(fixtures.company.venusLtd.id))

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

        cy.get(formSelectors.service).select('Export Win')
        cy.get(formSelectors.contact).select('Johnny Cakeman')
        cy.get(formSelectors.communicationChannel).select('Email/Website')
        cy.get(formSelectors.subject).type(subject)
        cy.get(formSelectors.notes).type(
          'Conversation with potential client about countries'
        )
        cy.get(formSelectors.policyFeedbackNo).click()
        cy.get(formSelectors.countriesDiscussed.yes).click()
        selectCountry(formSelectors.countries.export, 'Fran')
        selectCountry(formSelectors.countries.future, 'Fran')

        cy.get(selectors.interactionForm.add).click()
        cy.contains(
          'A country that was discussed cannot be entered in multiple fields.'
        )
      })
    })
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
