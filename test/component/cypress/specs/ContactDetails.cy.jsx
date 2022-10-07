import React from 'react'
import { mount } from '@cypress/react'
import ContactInformation from '../../../../src/client/components/ContactInformation'

describe('ContactInformation', () => {
  context('Default component use', () => {
    beforeEach(() => {
      mount(<ContactInformation />)
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
        "Information you'll need to add a contact"
      )
      cy.get('[data-test="contact-information-details"]> div').should(
        'contain.text',
        "You need to give the new contact's:"
      )
    })
  })
})
