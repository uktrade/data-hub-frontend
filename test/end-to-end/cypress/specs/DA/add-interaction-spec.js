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
      cy.get('[data-test="add-collection-item-button"]')
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
    beforeEach(() => {
      cy.intercept('POST', '/api-proxy/v4/interaction').as('post')

      const url = investments.projects.interactions.createType(
        fixtures.investmentProject.newGolfCourse.id,
        'investment',
        'interaction'
      )

      console.log('BBBBBBBBBBBBBBBB', url)
      cy.log('BBBBBBBBBBBBBBBBBBBB', url)

      cy.visit(
        url
        // investments.projects.interactions.createType(
        //   fixtures.investmentProject.newGolfCourse.id,
        //   'investment',
        //   'interaction'
        // )
      )
    })

    it('should have the correct headings', () => {
      cy.get('h1').should('have.text', 'Add interaction')
      cy.get('h2').eq(0).should('have.text', 'MARS EXPORTS LTD')
    })

    it('should add an interaction', () => {
      const subject = 'The best Investment Project interaction'
      const formSelectors = selectors.interactionForm

      cy.get(formSelectors.service)
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
