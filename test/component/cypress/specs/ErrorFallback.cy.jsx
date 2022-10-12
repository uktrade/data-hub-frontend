import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import config from '../../../../src/client/config'
import ErrorFallback from '../../../../src/client/components/ErrorFallback'

const sinon = require('sinon')

const SpannerInTheWorks = () => {
  throw Error('Spanner in the works!')
}

const COMPONENT = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <SpannerInTheWorks />
  </ErrorBoundary>
)

describe('ErrorFallback', () => {
  let sandbox = sinon.createSandbox()

  context('when an error occurs in production', () => {
    beforeEach(() => {
      sandbox.stub(config, 'isProd').value(true)
      cy.on('uncaught:exception', () => {
        return false
      })
    })

    after(() => {
      sandbox.restore()
    })

    it('has expected node env as production', () => {
      expect(config.isProd).to.be.true
    })

    it('should show a general error message', () => {
      cy.mount(<COMPONENT />)

      cy.get('[data-test="error-message"] h2').should(
        'contain',
        'Oops, something went wrong.'
      )
      cy.get('[data-test="error-message"] p').should(
        'contain',
        'Error: We’re working on it!'
      )
    })

    it('should show a retry button', () => {
      cy.mount(<COMPONENT />)

      cy.get('[data-test="error-message"] button').should('contain', 'Retry')
    })
  })

  context('when an error occurs in development', () => {
    beforeEach(() => {
      sandbox.stub(config, 'isProd').value(false)
      cy.on('uncaught:exception', () => {
        return false
      })
    })

    after(() => {
      sandbox.restore()
    })

    it('has expected node env as development', () => {
      expect(config.isProd).to.be.false
    })

    it('should show a specific error message', () => {
      cy.mount(<COMPONENT />)

      cy.get('[data-test="error-message"] h2').should(
        'contain',
        'Oops, something went wrong.'
      )
      cy.get('[data-test="error-message"] p').should(
        'contain',
        'Error: Spanner in the works!'
      )
    })

    it('should show a retry button', () => {
      cy.mount(<COMPONENT />)

      cy.get('[data-test="error-message"] button').should('contain', 'Retry')
    })
  })
})
