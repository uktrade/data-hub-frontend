import React from 'react'

import { Form } from '../../../../../src/client/components'
import { Step } from '../../../../../src/client/components'
import DataHubProvider from '../provider'

describe('Step', () => {
  context('When there are no steps', () => {
    const Component = () => (
      <DataHubProvider>
        <Form id="my-form"></Form>
      </DataHubProvider>
    )
    it('should render a save button', () => {
      cy.mount(<Component />)
      cy.get('button').contains('Save')
    })
  })

  context('When there is 1 step', () => {
    const Component = (props) => (
      <DataHubProvider>
        <Form id="my-form">
          <Step name="step1" {...props}>
            <div>Page content 1</div>
          </Step>
        </Form>
      </DataHubProvider>
    )
    it('should render the content and submit button only', () => {
      cy.mount(<Component />)
      cy.contains('Page content 1')
      cy.get('button').should('have.text', 'Submit')
      cy.get('[data-test="cancel-link"]').should('not.exist')
    })
    it('should render the content, submit and cancel link', () => {
      cy.mount(<Component cancelUrl="/" />)
      cy.contains('Page content 1')
      cy.get('button').should('have.text', 'Submit')
      cy.get('[data-test="cancel-link"]').should('have.text', 'Cancel')
    })
  })

  context('When there are 2 steps', () => {
    const Component = () => (
      <DataHubProvider>
        <Form id="my-form">
          <Step name="step1" cancelUrl="/">
            <div>Page content 1</div>
          </Step>
          <Step name="step2" cancelUrl="/">
            <div>Page content 2</div>
          </Step>
        </Form>
      </DataHubProvider>
    )
    it('should only render the cancel link on the first step', () => {
      cy.mount(<Component />)
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
