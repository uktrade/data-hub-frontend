import React from 'react'
import NewWindowLink from '../../../../src/client/components/NewWindowLink'

describe('NewWindowLink', () => {
  const href = 'https://example.com'
  const text = 'Read more...'
  const ariaLabel = 'Read more about something (opens in new tab)'

  const Component = (props) => <NewWindowLink {...props} />

  context('When passing href', () => {
    it('should correctly set the href attribute', () => {
      cy.mount(<Component href={href}>{text}</Component>)
      cy.get('[data-test="newWindowLink"]').should('have.attr', 'href', href)
    })
  })

  context('When passing text without warning', () => {
    it('should correctly set the text without a warning', () => {
      cy.mount(<Component showWarning={false}>{text}</Component>)
      cy.get('[data-test="newWindowLink"]').should('have.text', text)
    })
  })

  context('When passing text with a warning', () => {
    it('should set the text and warning', () => {
      cy.mount(<Component showWarning={true}>{text}</Component>)
      cy.get('[data-test="newWindowLink"]').should(
        'have.text',
        `${text} (opens in new tab)`
      )
    })
  })

  context('When passing text with a warning (the default)', () => {
    it('should set the text and warning', () => {
      cy.mount(<Component>{text}</Component>)
      cy.get('[data-test="newWindowLink"]').should(
        'have.text',
        `${text} (opens in new tab)`
      )
    })
  })

  context('When passing text and an arial label', () => {
    it('should correctly set the text and aria-label attribute', () => {
      cy.mount(<Component aria-label={ariaLabel}>{text}</Component>)
      cy.get('[data-test="newWindowLink"]').should(
        'have.attr',
        'aria-label',
        ariaLabel
      )
    })
  })
})
