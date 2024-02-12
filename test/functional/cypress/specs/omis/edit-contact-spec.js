import fixtures from '../../fixtures/index'
import urls from '../../../../../src/lib/urls'
import {
  assertErrorSummary,
  assertFieldTypeahead,
  assertFlashMessage,
  assertPayload,
} from '../../support/assertions'
import { clearTypeahead } from '../../support/form-fillers'

const { draftOrder } = fixtures.omis

describe('Edit order contact', () => {
  beforeEach(() => {
    cy.visit(urls.omis.edit.contact(draftOrder.id))
  })

  it('should render the contact field', () => {
    cy.get('[data-test="field-contact"]').then((element) =>
      assertFieldTypeahead({
        element,
        label: 'Contact responsible for the order',
        placeholder: 'Select a contact',
        values: draftOrder.contact,
      })
    )
  })

  it('should render the details component', () => {
    cy.get('[data-test="add-a-new-contact-link"]').should('exist')
  })

  it('should not submit the form if no contact is selected', () => {
    clearTypeahead('[data-test=field-contact]')
    cy.get('[data-test=submit-button]').click()
    assertErrorSummary(['Select the contact responsible for this order'])
  })

  it('should submit form successfully', () => {
    cy.intercept('PATCH', `/api-proxy/v3/omis/order/${draftOrder.id}`).as(
      'apiRequest'
    )
    cy.get('[data-test="field-contact"]').selectTypeaheadOption('Joseph Woof')
    cy.get('[data-test=submit-button]').click()
    assertPayload('@apiRequest', {
      id: draftOrder.id,
      contact: '5e75d636-1d24-416a-aaf0-3fb220d594ce',
    })
    assertFlashMessage('Contact updated')
    cy.location('pathname').should('eq', urls.omis.workOrder(draftOrder.id))
  })

  context('Add contact loop', () => {
    before(() => {
      cy.visit(urls.omis.edit.contact(draftOrder.id))
    })

    after(() => {
      window.sessionStorage.clear()
    })

    it('should redirect the user back to the edit contact form after the contact is added', () => {
      cy.get('[data-test="add-a-new-contact-link"]').click()
      cy.contains('a', 'add a new contact').click()

      cy.contains('a', 'Cancel').should(
        'have.attr',
        'href',
        urls.omis.edit.contact(draftOrder.id)
      )

      cy.contains('div', 'First name').find('input').type('John')
      cy.contains('div', 'Last name').find('input').type('Doe')
      cy.contains('div', 'Job title').find('input').type('Full-stack dev')
      cy.contains('fieldset', 'Is this person a primary contact?')
        .contains('label', 'Yes')
        .click()
      cy.contains('div', 'Phone number').find('input').type('123 567 789')
      cy.contains('div', 'Email').find('input').type('john@new.com')
      cy.contains(
        'fieldset',
        'Is this contact’s work address the same as the company address?'
      )
        .contains('label', 'Yes')
        .click()
      cy.contains('button', 'Add contact').click()

      cy.url().should('include', urls.omis.edit.contact(draftOrder.id))

      // We are not expecting John Doe here, because the mocked sandbox response
      // returns Json Russel
      cy.contains(`You have successfully added a new contact Json Russel`)
    })
  })
})
