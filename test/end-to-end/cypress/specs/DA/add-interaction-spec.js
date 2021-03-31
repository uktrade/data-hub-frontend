const { investments } = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

describe('DA add Investment Project interaction', () => {
  context('The browser URL has updated', () => {
    investmentProjectNewGolf = fixtures.investmentProject.create.newGolfCourseDA()

    before(() => {
      cy.loadFixture([investmentProjectNewGolf])
      cy.visit(
        investments.projects.interactions.index(investmentProjectNewGolf.pk)
      )
    })

    it('should have the correct url', () => {
      cy.get('[data-auto-id="Add interaction"]')
        .click()
        .location('pathname')
        .should(
          'eq',
          investments.projects.interactions.createType(
            investmentProjectNewGolf.pk,
            'investment',
            'interaction'
          )
        )
    })
  })

  context('DA completes the form and clicks "Add interaction"', () => {
    investmentProjectNewGolf = fixtures.investmentProject.create.newGolfCourseDA()

    before(() => {
      cy.loadFixture([investmentProjectNewGolf])
      cy.server().route('POST', '/api-proxy/v3/interaction').as('post')

      cy.visit(
        investments.projects.interactions.createType(
          investmentProjectNewGolf.pk,
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
