import React from 'react'
import { mount } from '@cypress/react'
import { withErrorBoundary } from '../../../../src/client/components/ErrorBoundary'
import config from '../../../../src/client/config'

const sinon = require('sinon')

const SpannerInTheWorks = () => {
  throw Error('Spanner in the works!')
}

const COMPONENT = withErrorBoundary(SpannerInTheWorks)

describe('ErrorBoundary', () => {
  let sandbox = sinon.createSandbox()

  context('when an error occurs in production', () => {
    beforeEach(() => {
      sandbox.stub(config, 'isProd').value(true)
    })

    after(() => {
      sandbox.restore()
    })

    it('has expected node env as production', () => {
      expect(config.isProd).to.be.true
    })

    it('should show a general error message', () => {
      cy.on('uncaught:exception', () => {
        return false
      })

      mount(<COMPONENT />)

      cy.get('[data-test="error-message"] h2').should(
        'contain',
        'Oops, something went wrong.'
      )
      cy.get('[data-test="error-message"] p').should(
        'contain',
        'Error: We’re working on it!'
      )
    })
  })

  context('when an error occurs in development', () => {
    beforeEach(() => {
      sandbox.stub(config, 'isProd').value(false)
    })

    after(() => {
      sandbox.restore()
    })

    it('has expected node env as development', () => {
      expect(config.isProd).to.be.false
    })

    it('should show a specific error message', () => {
      cy.on('uncaught:exception', () => {
        return false
      })

      mount(<COMPONENT />)

      cy.get('[data-test="error-message"] h2').should(
        'contain',
        'Oops, something went wrong.'
      )
      cy.get('[data-test="error-message"] p').should(
        'contain',
        'Error: Spanner in the works!'
      )
    })
  })
})
