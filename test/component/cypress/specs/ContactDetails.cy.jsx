import React from 'react'

import ContactInformation from '../../../../src/client/components/ContactInformation'

describe('ContactInformation', () => {
  context('Default component use', () => {
    beforeEach(() => {
      cy.mount(<ContactInformation />)
    })

    it('should show the add a new contact link', () => {
      cy.get('[data-test="add-a-new-contact-link"]')
        .should('be.visible')
        .should('contain', 'add a new contact')
        .should('have.attr', 'href')
    })

    it('should render the contact information details component', () => {
      cy.get('[data-test="contact-information-details"]').should('be.visible')
      cy.get('[data-test="contact-information-details"]> Summary').should(
        'contain.text',
        'Information needed to add a new contact'
      )
      cy.get('[data-test="contact-information-details"]> div').should(
        'contain.text',
        'You need:'
      )
    })
  })
})
