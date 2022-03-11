const { investments } = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

describe('DA add Investment Project interaction', () => {
  context('The browser URL has updated', () => {
    before(() => {
      cy.visit(
        investments.projects.interactions.index(
          fixtures.investmentProject.newGolfCourse.id
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
            fixtures.investmentProject.newGolfCourse.id,
            'investment',
            'interaction'
          )
        )
    })
  })

  context('DA completes the form and clicks "Add interaction"', () => {
    before(() => {
      cy.server().route('POST', '/v4/interaction').as('post')

      cy.visit(
        investments.projects.interactions.createType(
          fixtures.investmentProject.newGolfCourse.id,
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
        .select('Investment - Services')
        .get(formSelectors.hasRelatedTradeAgreementsNo)
        .click()
        .get(formSelectors.contact)
        .selectTypeaheadOption('Fred Peterson')
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
        .should((xhr) => {
          expect(xhr.status, 'successful POST').to.equal(201)
        })

      cy.contains('h1', subject)
    })
  })
})
