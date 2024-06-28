const urls = require('../../../../../src/lib/urls')
const {
  assertBreadcrumbs,
  assertErrorDialog,
  assertKeyValueTable,
} = require('../../support/assertions')

//TODO - Reinstate this test once we have restored the ESS integration
describe.skip('Event Export Support Details', () => {
  const essInteractionId = '1111'
  const essInteractionIdNoTitle = '2222'
  const notFoundEssId = '404'

  context('Details Render', () => {
    context('when it is a valid ess interaction ', () => {
      beforeEach(() => {
        cy.visit(
          urls.interactions.exportSupportService.details(essInteractionId)
        )
      })
      it('should display ess name in breadcrumb', () => {
        assertBreadcrumbs({
          Home: urls.dashboard.index.route,
          Interactions: urls.interactions.index(),
          'Test ESS Interaction': null,
        })
      })

      it('should display the ess name in the header', () => {
        cy.get('[data-test="heading"]').should(
          'contain',
          'Test ESS Interaction'
        )
      })

      it('should display event details', () => {
        assertKeyValueTable('essInteractionDetails', {
          Company: 'Best Ever Company 2',
          Enquirer: 'Test Person',
          Subject: 'Test ESS Interaction',
          Question:
            'I have a very important question that I would like help with, regarding Exporting',
          'Date of interaction': '2 December 2022',
          Countries: 'Australia, United Kingdom',
          'Communication channel': 'Export Support Services',
        })
      })
    })
  })

  context('when ess title is not provided', () => {
    beforeEach(() => {
      cy.visit(
        urls.interactions.exportSupportService.details(essInteractionIdNoTitle)
      )
    })
    it('should display ess name in breadcrumb', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.index.route,
        Interactions: urls.interactions.index(),
        'ESS Inbound Enquiry': null,
      })
    })

    it('should display "ESS Inbound Interaction"', () => {
      cy.get('[data-test="heading"]').should('contain', 'ESS Inbound Enquiry')
    })
  })

  context('when the ess interaction is not found', () => {
    beforeEach(() => {
      cy.visit(urls.interactions.exportSupportService.details(notFoundEssId))
    })

    it('should render an error message', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.index.route,
        Interactions: urls.interactions.index(),
      })
      assertErrorDialog(
        'TASK_GET_ESS_INTERACTION_DETAILS',
        'Unable to load Export Support details.'
      )
    })
  })
})
