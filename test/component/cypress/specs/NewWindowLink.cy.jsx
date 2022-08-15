import React from 'react'
import { mount } from '@cypress/react'
import NewWindowLink from '../../../../src/client/components/NewWindowLink'

describe('NewWindowLink', () => {
  const link = 'https://example.com'
  const linkText = 'example'
  const newTabText = 'opens in a new window or tab'

  const Component = (props) => <NewWindowLink {...props} />

  context('when the "href" prop is passed', () => {
    before(() => {
      mount(<Component href={link}>{linkText}</Component>)
    })

    it('should render the link', () => {
      cy.get('[data-test="newWindowLink"]')
        .should('have.attr', 'aria-label', 'Opens in a new window or tab')
        .should('have.attr', 'href', link)
        .should('have.text', linkText)
      cy.contains(newTabText).should('be.visible')
    })
  })
})
