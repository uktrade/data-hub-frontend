import React from 'react'

import Hcsat from '../../../../../src/client/components/Hcsat'

describe('HCSAT', () => {
  const Component = (props) => <Hcsat {...props} />

  context('When a user thinks a page is useful', () => {
    beforeEach(() => {
      cy.mount(<Component />)
      cy.intercept('POST', '/api-proxy/v4/hcsat*', { body: { id: '1234' } }).as(
        'submitHcsatFeedback'
      )
    })

    it('should send to API and show thank you message', () => {
      cy.get('[data-test="hcsat"]').as('hcsat').contains('Is this page useful?')
      cy.get('@hcsat').find('[data-test="hcsat-page-is-useful"]').click()
      cy.get('@hcsat').contains('Thank you for your feedback.')

      cy.wait('@submitHcsatFeedback').its('request.body').should('include', {
        was_useful: true,
      })
    })
  })

  context('When a user thinks a page is NOT useful', () => {
    beforeEach(() => {
      cy.mount(<Component />)
      cy.intercept('POST', '/api-proxy/v4/hcsat*', { body: { id: '1234' } }).as(
        'submitHcsatFeedback'
      )
    })

    it('should send to API and show additional feedback options', () => {
      cy.get('[data-test="hcsat"]').as('hcsat').contains('Is this page useful?')
      cy.get('@hcsat').find('[data-test="hcsat-page-is-not-useful"]').click()
      cy.wait('@submitHcsatFeedback').its('request.body').should('include', {
        was_useful: false,
      })

      cy.get('[data-test="hcsat-additional-feedback-form"]').as('feedbackForm')
      cy.get('@feedbackForm').contains('What went wrong?')
      cy.get('@feedbackForm').contains('I did not find what I was looking for.')
      cy.get('@feedbackForm').contains(
        'I found it difficult to navigate the page.'
      )
      cy.get('@feedbackForm').contains('The page lacks a feature I need.')
      cy.get('@feedbackForm').contains(
        'I was unable to load/refresh/render the page.'
      )
      cy.get('@feedbackForm').contains(
        'I did not find the information accurate.'
      )
      cy.get('@feedbackForm').contains('Other')
      cy.get('@feedbackForm').contains('How could we improve the service?')
      cy.get('@feedbackForm')
        .find('[data-test="hcsat-improvement-suggestion"]')
        .should('exist')
      cy.get('@feedbackForm')
        .find('[data-test="hcsat-other-issues"]')
        .should('not.exist')
    })
  })

  context(
    'When a user thinks a page is NOT useful and submits additional feedback',
    () => {
      const hcsatApiResponseId = '1234'

      beforeEach(() => {
        cy.mount(<Component />)
        cy.intercept('POST', '/api-proxy/v4/hcsat*', {
          body: { id: hcsatApiResponseId },
        }).as('submitHcsatFeedback')
      })

      it('should show additional textarea when "other" is selected', () => {
        cy.get('[data-test="hcsat"]')
          .as('hcsat')
          .contains('Is this page useful?')
        cy.get('@hcsat').find('[data-test="hcsat-page-is-not-useful"]').click()
        cy.wait('@submitHcsatFeedback').its('request.body').should('include', {
          was_useful: false,
        })

        cy.get('[data-test="hcsat-additional-feedback-form"]').as(
          'feedbackForm'
        )
        cy.get('@feedbackForm')
          .find('[data-test="hcsat-other-issues"]')
          .should('not.exist')
        cy.get('@feedbackForm').contains('Other').click()
        cy.get('@feedbackForm')
          .find('[data-test="hcsat-other-issues"]')
          .should('exist')
      })

      it('should send empty additional feedback to API with ID from API in URL', () => {
        cy.get('[data-test="hcsat"]')
          .as('hcsat')
          .contains('Is this page useful?')
        cy.get('@hcsat').find('[data-test="hcsat-page-is-not-useful"]').click()
        cy.wait('@submitHcsatFeedback').its('request.body').should('include', {
          was_useful: false,
        })

        cy.get('[data-test="hcsat-additional-feedback-form"]').as(
          'feedbackForm'
        )

        cy.intercept('PATCH', `/api-proxy/v4/hcsat/${hcsatApiResponseId}*`, {
          body: { id: hcsatApiResponseId },
        }).as('submitAdditionalHcsatFeedback')

        cy.get('@feedbackForm')
          .find('[data-test="hcsat-send-additional-feedback"]')
          .click()

        // No additional feedback given but allows empty submit
        cy.wait('@submitAdditionalHcsatFeedback')
          .its('request.body')
          .should('include', {
            improvement_suggestion: '',
          })
      })

      it('should send populated additional feedback to API with ID from API in URL', () => {
        cy.get('[data-test="hcsat"]')
          .as('hcsat')
          .contains('Is this page useful?')
        cy.get('@hcsat').find('[data-test="hcsat-page-is-not-useful"]').click()
        cy.wait('@submitHcsatFeedback').its('request.body').should('include', {
          was_useful: false,
        })

        cy.get('[data-test="hcsat-additional-feedback-form"]').as(
          'feedbackForm'
        )

        cy.get('@feedbackForm')
          .contains('I did not find what I was looking for.')
          .click()
        cy.get('@feedbackForm')
          .contains('I found it difficult to navigate the page.')
          .click()
        cy.get('@feedbackForm')
          .contains('The page lacks a feature I need.')
          .click()
        cy.get('@feedbackForm')
          .contains('I was unable to load/refresh/render the page.')
          .click()
        cy.get('@feedbackForm')
          .contains('I did not find the information accurate.')
          .click()
        cy.get('@feedbackForm').contains('Other').click()
        cy.get('@feedbackForm')
          .find('[data-test="hcsat-improvement-suggestion"]')
          .type('Some improvement suggestions')
        cy.get('@feedbackForm')
          .find('[data-test="hcsat-other-issues"]')
          .type('Other issues')

        cy.intercept('PATCH', `/api-proxy/v4/hcsat/${hcsatApiResponseId}*`, {
          body: { id: hcsatApiResponseId },
        }).as('submitAdditionalHcsatFeedback')

        cy.get('@feedbackForm')
          .find('[data-test="hcsat-send-additional-feedback"]')
          .click()

        cy.wait('@submitAdditionalHcsatFeedback')
          .its('request.body')
          .should('include', {
            improvement_suggestion: 'Some improvement suggestions',
            other_issues_detail: 'Other issues',
            did_not_find_what_i_wanted: true,
            difficult_navigation: true,
            lacks_feature: true,
            unable_to_load: true,
            inaccurate_information: true,
            other_issues: true,
          })
      })
    }
  )
})
