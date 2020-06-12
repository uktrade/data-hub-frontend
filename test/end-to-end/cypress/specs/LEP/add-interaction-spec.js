const { investments } = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

describe('LEP add Investment Project interaction', () => {
  before(() => {
    cy.visit(
      investments.projects.interactions.index(
        fixtures.investmentProject.newZoo.id
      )
    )
      .get('[data-auto-id="Add interaction"]')
      .click()
  })

  context('The browser URL has updated', () => {
    it('should have the correct url', () => {
      cy.location('pathname').should(
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
      cy.server({
        onAnyAbort: (route, proxy) => {
          console.log(route)
          console.log(proxy)
        },
      })
        .route('POST', '/api-proxy/v3/interaction')
        .as('post')
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
