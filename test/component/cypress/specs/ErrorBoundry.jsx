import React from 'react'
import { mount } from '@cypress/react'
import ErrorBoundary from '../../../../src/client/components/ErrorBoundary'

const SpannerInTheWorks = () => {
  throw Error('spanner in the works')
}

describe('ErrorBoundary', () => {
  context('When no props are passed', () => {
    it('should show a general error message', () => {
      cy.on('uncaught:exception', () => {
        return false
      })

      mount(
        <ErrorBoundary>
          <SpannerInTheWorks />
        </ErrorBoundary>
      )

      cy.get('[data-test="error-message"]')
        .should('contain', 'Oops Something went wrong.')
        .should(
          'contain',
          'Error: We are working on getting this fixed as soon as we can.'
        )
    })
  })
})
