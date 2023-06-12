const { investments } = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

describe('LEP add Investment Project interaction', () => {
  context('The browser URL has updated', () => {
    before(() => {
      cy.visit(
        investments.projects.interactions.index(
          fixtures.investmentProject.newZoo.id
        )
      )
    })
    it('should have the correct url', () => {
      cy.get('[data-test="Add interaction"]')
        .click()
        .location('pathname')
        .should(
          'eq',
          investments.projects.interactions.createType(
            fixtures.investmentProject.newZoo.id,
            'investment',
            'interaction'
          )
        )
    })
  })

  context('LEP completes the form and clicks "Add interaction"', () => {
    before(() => {
      cy.intercept('POST', '/api-proxy/v4/interaction').as('post')

      cy.visit(
        investments.projects.interactions.createType(
          fixtures.investmentProject.newZoo.id,
          'investment',
          'interaction'
        )
      )
    })

    it('should add an interaction', () => {
      const subject = 'The best Investment Project interaction'
      const formSelectors = selectors.interactionForm

      cy.contains('Add interaction for Mars Exports Ltd')
        .get(formSelectors.service)
        .select('Investment - services')

        .get(formSelectors.contact)
        .selectTypeaheadOption('Mark Halomi')
        .get(formSelectors.communicationChannel)
        .selectTypeaheadOption('Email/Website')
        .get(formSelectors.subject)
        .type(subject)
        .get(formSelectors.notes)
        .type('Conversation about Investment services')
        .get(formSelectors.policyFeedbackNo)
        .click()
        .get(formSelectors.hasRelatedOpportunityNo)
        .click()
        .get(formSelectors.add)
        .click()
        .wait('@post')
        .then((request) => {
          expect(request.response.statusCode).to.eql(201)
        })

      cy.contains('h1', subject)
    })
  })
})
