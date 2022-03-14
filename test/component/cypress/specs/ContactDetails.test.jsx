import React from 'react'
import { mount } from '@cypress/react'
import ContactDetails from '../../../../src/client/components/ContactDetails'

describe('ContactDetails', () => {
  context('Default component use', () => {
    beforeEach(() => {
      mount(<ContactDetails />)
    })

    it('should show the add a new contact link', () => {
      cy.get('[data-test="add-a-new-contact-link"]')
        .should('be.visible')
        .should('contain', 'add a new contact')
        .should('have.attr', 'href')
    })

    it('should render the contact information details component', () => {
      cy.get('[data-test="add-a-new-contact-details"]').should('be.visible')
      cy.get('[data-test="add-a-new-contact-details"]> Summary').should(
        'contain.text',
        "Information you'll need to add a contact"
      )
      cy.get('[data-test="add-a-new-contact-details"]> div').should(
        'contain.text',
        "You need to give the new contact's:"
      )
    })
  })
})
