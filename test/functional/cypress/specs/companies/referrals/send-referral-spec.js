import { companies, dashboard } from '../../../../../../src/lib/urls'
import { company } from '../../../fixtures'
import { sendReferral } from '../../../../../selectors'
import {
  assertBreadcrumbs,
  assertErrorSummary,
  assertFlashMessage,
  assertLocalHeader,
  assertSummaryTable,
} from '../../../support/assertions'

const selectTypeahead = (field, input) =>
  cy.get(field).within(() => {
    cy.intercept('/api-proxy/adviser/?*').as('adviserResults')
    cy.get('input').clear().type(input)
    cy.wait('@adviserResults')
    cy.get('[data-test="typeahead-menu-option"]').first().click()
  })

const enterAdviserDefault = () =>
  selectTypeahead(sendReferral.adviserField, 'shawn')

const enterSubjectDefault = () =>
  cy.get(sendReferral.subjectField).click().type('Example subject')

const enterNotesDefault = () =>
  cy.get(sendReferral.notesField).click().type('Example notes')

const enterContactDefault = () =>
  selectTypeahead(sendReferral.contactField, 'johnny')

describe('Send a referral form', () => {
  describe('All but successful completion', () => {
    beforeEach(() => {
      cy.visit(companies.referrals.send(company.withContacts.id))

      assertBreadcrumbs({
        Home: dashboard.index(),
        Companies: companies.index(),
        [company.withContacts.name]: companies.detail(company.withContacts.id),
        'Send a referral': null,
      })
      assertLocalHeader('Send a referral')
    })

    context(
      'when "Continue" button is clicked without specifying a subject',
      () => {
        it('should display error message', () => {
          enterAdviserDefault()
          enterNotesDefault()
          cy.contains('button', 'Continue').click()
          assertErrorSummary([
            'Enter a subject for the referral (Max 255 characters)',
          ])
        })
      }
    )

    context(
      'when "Continue" button is clicked without specifying notes',
      () => {
        it('should display error message', () => {
          enterAdviserDefault()
          enterSubjectDefault()
          cy.contains('button', 'Continue').click()
          assertErrorSummary(['Enter notes for the referral'])
        })
      }
    )
  })

  describe('Advisor input fields', () => {
    beforeEach(() => {
      cy.visit(companies.referrals.send(company.withContacts.id))
    })

    context('When you search advisors', () => {
      it('should return inactive advisers with text indicating they are inactive next to their name', () => {
        cy.get(sendReferral.adviserField).within(() => {
          cy.intercept('/api-proxy/adviser/?*').as('adviserResults')
          cy.get('input').clear().type('John Doe')
          cy.wait('@adviserResults')
          cy.get('[data-test="typeahead-menu-option"]')
            .first()
            .should(
              'contain',
              'John Doe - INACTIVE, Heart of the South West LEP'
            )
        })
      })

      it('should return active advisers without an inactive text next to their name', () => {
        cy.get(sendReferral.adviserField).within(() => {
          cy.intercept('/api-proxy/adviser/?*').as('adviserResults')
          cy.get('input').clear().type('Shawn Cohen')
          cy.wait('@adviserResults')
          cy.get('[data-test="typeahead-menu-option"]')
            .first()
            .should('contain', 'Shawn Cohen, Charles Gilbert')
        })
      })
    })
  })

  context(
    'when "Continue" button is clicked after all fields filled in',
    () => {
      it('should display the confirmation component with the values just input', () => {
        cy.visit(companies.referrals.send(company.withContacts.id))
        enterAdviserDefault()
        enterSubjectDefault()
        enterNotesDefault()
        enterContactDefault()

        cy.contains('button', 'Continue').click()

        assertSummaryTable({
          dataTest: 'referral-confirmation-table',
          content: {
            'Refer this company to': 'Shawn Cohen, Charles Gilbert',
            Subject: 'Example subject',
            Notes: 'Example notes',
            'Company contact': 'Johnny Cakeman',
          },
        })

        cy.contains('Check referral details').should('be.visible')
        cy.contains('What happens next').should('be.visible')
        cy.contains(
          "You won't be able to edit the referral after this point"
        ).should('be.visible')
        cy.contains(
          "A link to the referral will appear on the company record, your homepage and the recipient's homepage"
        ).should('be.visible')
        cy.contains('The referral might take 24 hours to appear').should(
          'be.visible'
        )
      })
    }
  )

  context(
    'when "Continue" then "Edit" button is clicked after all fields filled in',
    () => {
      it('the input data should appear in the form when "Edit Referral" is clicked', () => {
        cy.visit(companies.referrals.send(company.withContacts.id))
        enterAdviserDefault()
        enterSubjectDefault()
        enterNotesDefault()
        enterContactDefault()

        cy.contains('button', 'Continue').click()
        cy.contains('Edit Referral').click()

        cy.get(sendReferral.adviserField)
          .find('input')
          .should('have.attr', 'value', 'Shawn Cohen, Charles Gilbert')
        cy.get(sendReferral.subjectFieldInput).should(
          'have.attr',
          'value',
          'Example subject'
        )
        cy.get(sendReferral.notesField).should('contain', 'Example notes')
        cy.get(sendReferral.contactField)
          .find('input')
          .should('have.attr', 'value', 'Johnny Cakeman')
      })
    }
  )

  context(
    'When the "Cancel" link is clicked from the confirmation component',
    () => {
      it('should return to the company page', () => {
        cy.visit(companies.referrals.send(company.withContacts.id))
        enterAdviserDefault()
        enterSubjectDefault()
        enterNotesDefault()
        enterContactDefault()
        cy.contains('Cancel').click()
        cy.url().should(
          'contain',
          companies.overview.index(company.withContacts.id)
        )
      })
    }
  )

  context(
    'When the "Send referral" button is clicked from the confirmation component',
    () => {
      before(() => {
        cy.visit(companies.referrals.send(company.withContacts.id))
      })
      it('should take user to the company page, display flash message and link to the homepage', () => {
        enterAdviserDefault()
        enterSubjectDefault()
        enterNotesDefault()
        enterContactDefault()
        cy.contains('button', 'Continue').click()
        cy.contains('button', 'Send referral').click()
        cy.url().should(
          'contain',
          companies.overview.index(company.withContacts.id)
        )
        assertFlashMessage('Referral sent')
        cy.contains('You can see all of your referrals on your Homepage.')
          .contains('see all of your referrals on your Homepage')
          .should('have.attr', 'href', companies.referrals.list())
      })
    }
  )
})

describe('Contact loop', () => {
  context('when a contact does not exist and user wants to add one', () => {
    beforeEach(() => {
      cy.visit(companies.referrals.send(company.withContacts.id))
    })

    after(() => {
      window.sessionStorage.clear()
    })

    it('should redirect the user back to the interaction form and add the contact after the contact is added', () => {
      cy.get(sendReferral.subjectField)
        .click()
        .type('Test if values are restored')

      cy.contains('a', 'add a new contact').click()

      cy.contains('a', 'Cancel').should(
        'have.attr',
        'href',
        companies.referrals.send(company.withContacts.id)
      )

      cy.contains('div', 'First name').find('input').type('John')
      cy.contains('div', 'Last name').find('input').type('Doe')
      cy.contains('div', 'Job title').find('input').type('Full-stack dev')
      cy.checkRadioGroup('Is this person a primary contact?', 'Yes')
      cy.contains('div', 'Phone number').find('input').type('123 567 789')
      cy.contains('div', 'Email').find('input').type('john@new.com')
      cy.checkRadioGroup(
        'Is this contact’s work address the same as the company address?',
        'Yes'
      )
      cy.getSubmitButtonByLabel('Add contact').click()

      cy.url().should(
        'include',
        companies.referrals.send(company.withContacts.id)
      )

      // We are not expecting John Doe here, because the mocked sandbox response
      // returns Json Russel
      cy.contains(`You have successfully added a new contact Json Russel`)

      cy.get(sendReferral.subjectFieldInput).should(
        'have.attr',
        'value',
        'Test if values are restored'
      )

      cy.get(sendReferral.contactField)
        .find('input')
        .should('have.attr', 'value', 'Json Russel')
    })
  })
})
