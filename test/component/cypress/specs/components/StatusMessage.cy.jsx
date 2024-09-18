import React from 'react'

import StatusMessage from '../../../../../src/client/components/StatusMessage'

const Component = (props) => <StatusMessage {...props} />

describe('StatusMessage', () => {
  context('When the colour prop is not set', () => {
    assertStatusMessage('rgb(29, 112, 184)')
  })

  context('When the colour prop is set', () => {
    assertStatusMessage('rgb(255, 0, 0)')
  })
})

export function assertStatusMessage(colour) {
  beforeEach(() => {
    cy.mount(<Component colour={colour}>Status Message</Component>)
  })

  it('should render the text', () => {
    cy.get('[data-test=status-message]')
      .should('exist')
      .should('have.text', 'Status Message')
  })

  it('should render with the default styling', () => {
    cy.get('[data-test=status-message]')
      .should('have.css', 'padding', '15px')
      .should('have.css', 'margin-bottom', '20px')
      .should('have.css', 'font-weight', '700')
      .should('have.css', 'line-height', '24px')
  })

  it('should render with the expected colours', () => {
    cy.get('[data-test=status-message]')
      .should('have.css', 'color', colour)
      .should('have.css', 'border-color', colour)
  })
}
