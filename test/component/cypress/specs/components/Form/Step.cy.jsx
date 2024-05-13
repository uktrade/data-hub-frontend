import React from 'react'

import { Form, Step } from '../../../../../../src/client/components'

describe('Step', () => {
  context('When there are no steps', () => {
    it('should render a save button', () => {
      cy.mountWithProvider(<Form id="my-form" />)
      cy.get('button').contains('Save')
    })
  })

  context('When there is 1 step', () => {
    it('should render the content and submit button only', () => {
      cy.mountWithProvider(
        <Form id="my-form">
          <Step name="step1">
            <div>Page content 1</div>
          </Step>
        </Form>
      )
      cy.contains('Page content 1')
      cy.get('button').should('have.text', 'Submit')
      cy.get('[data-test="cancel-link"]').should('not.exist')
    })
    it('should render the content, submit and cancel link', () => {
      cy.mountWithProvider(
        <Form id="my-form">
          <Step name="step1" cancelUrl="/">
            <div>Page content 1</div>
          </Step>
        </Form>
      )
      cy.contains('Page content 1')
      cy.get('button').should('have.text', 'Submit')
      cy.get('[data-test="cancel-link"]').should('have.text', 'Cancel')
    })
  })

  context('When there are 2 steps', () => {
    it('should only render the cancel link on the first step', () => {
      cy.mountWithProvider(
        <Form id="my-form">
          <Step name="step1" cancelUrl="/">
            <div>Page content 1</div>
          </Step>
          <Step name="step2" cancelUrl="/">
            <div>Page content 2</div>
          </Step>
        </Form>
      )
      cy.contains('Page content 1')
      cy.get('[data-test="cancel-link"]').should('exist')
      cy.get('button').contains('Continue').click()
      cy.contains('Page content 2')
      // The cancel link can only live on the first step, after that
      // it's either continue or submit (if it's the last step).
      cy.get('[data-test="cancel-link"]').should('not.exist')
      cy.get('button').contains('Submit')
      cy.get('button').contains('Back')
    })
  })
})
