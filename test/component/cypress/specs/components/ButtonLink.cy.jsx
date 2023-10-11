import React from 'react'

import ButtonLink from '../../../../../src/client/components/ButtonLink'

describe('ButtonLink', () => {
  const Component = (props) => <ButtonLink data-test="button-link" {...props} />

  const linkText = 'Example ButtonLink'

  context('When the inline prop is not set', () => {
    beforeEach(() => {
      cy.mount(
        <div>
          <Component>{linkText}</Component>
        </div>
      )
    })

    it('should render the expected text', () => {
      cy.get('[data-test="button-link"]')
        .should('exist')
        .should('contain', linkText)
    })

    it('should render with the default styles', () => {
      cy.get('[data-test="button-link"]')
        .should('have.css', 'color', 'rgb(29, 112, 184)')
        .should(
          'have.css',
          'text-decoration',
          'underline solid rgb(29, 112, 184)'
        )
    })
  })

  context('When the inline prop is set', () => {
    beforeEach(() => {
      cy.mount(
        <div data-test="button-link-container">
          Some text <Component inline={true}>{linkText}</Component>
        </div>
      )
    })

    it('should render the expected text', () => {
      cy.get('[data-test="button-link-container"]')
        .should('exist')
        .should('contain', 'Some text')

      cy.get('[data-test="button-link"]')
        .should('exist')
        .should('contain', linkText)
    })

    it('should render with the default styles', () => {
      cy.get('[data-test="button-link"]')
        .should('have.css', 'color', 'rgb(29, 112, 184)')
        .should(
          'have.css',
          'text-decoration',
          'underline solid rgb(29, 112, 184)'
        )
    })

    it('should render with the inline margins', () => {
      cy.get('[data-test="button-link"]')
        .should('have.css', 'padding', '0px')
        .should('have.css', 'margin', '0px 0px 0px 5px')
        .should('have.css', 'border', '0px none rgb(29, 112, 184)')
    })
  })
})
