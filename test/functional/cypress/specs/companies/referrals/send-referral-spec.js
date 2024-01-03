const urls = require('../../../../../../src/lib/urls')
const fixtures = require('../../../fixtures')
const selectors = require('../../../../../selectors')
const { assertFlashMessage } = require('../../../support/assertions')

const selectTypeahead = (field, input) =>
  cy.get(field).within(() => {
    cy.intercept('/api-proxy/adviser/?*').as('adviserResults')
    cy.get('input').clear().type(input)
    cy.wait('@adviserResults')
    cy.get('[data-test="typeahead-menu-option"]').first().click()
  })

const enterAdviserDefault = () =>
  selectTypeahead(selectors.sendReferral.adviserField, 'shawn')

const enterSubjectDefault = () =>
  cy.get(selectors.sendReferral.subjectField).click().type('Example subject')

const enterNotesDefault = () =>
  cy.get(selectors.sendReferral.notesField).click().type('Example notes')

const enterContactDefault = () =>
  selectTypeahead(selectors.sendReferral.contactField, 'johnny')

describe('Send a referral form', () => {
  before(() => {
    cy.visit(urls.companies.referrals.send(fixtures.company.withContacts.id))
  })

  describe('All but successful completion', () => {
    beforeEach(() => {
      cy.visit(urls.companies.referrals.send(fixtures.company.withContacts.id))
    })

    context(
      'when "Continue" button is clicked without specifying a subject',
      () => {
        it('should display error message', () => {
          enterAdviserDefault()
          enterNotesDefault()
          cy.contains('button', 'Continue').click()
          cy.get('form').should(
            'contain',
            'Enter a subject for the referral (Max 255 characters)'
          )
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
          cy.get('form').should('contain', 'Enter notes for the referral')
        })
      }
    )
  })

  describe('Advisor input fields', () => {
    beforeEach(() => {
      cy.visit(urls.companies.referrals.send(fixtures.company.withContacts.id))
    })

    context('When you search advisors', () => {
      it('should return inactive advisers with text indicating they are inactive next to their name', () => {
        cy.get(selectors.sendReferral.adviserField).within(() => {
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
        cy.get(selectors.sendReferral.adviserField).within(() => {
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
        cy.visit(
          urls.companies.referrals.send(fixtures.company.withContacts.id)
        )
        enterAdviserDefault()
        enterSubjectDefault()
        enterNotesDefault()
        enterContactDefault()
        cy.contains('button', 'Continue').click()
        cy.contains('Check referral details').should('be.visible')
        cy.get('table')
          .should('contain', 'Shawn Cohen')
          .and('contain', 'Example subject')
          .and('contain', 'Example notes')
          .and('contain', 'Johnny Cakeman')
          .parents()
          .find('button')
          .should('contain', 'Edit Referral')
          .next()
          .should('contain', 'What happens next')
          .next()
          .find('li')
          .eq(0)
          .should(
            'contain',
            "You won't be able to edit the referral after this point"
          )
          .next()
          .should(
            'contain',
            "A link to the referral will appear on the company record, your homepage and the recipient's homepage"
          )
          .next()
          .should('contain', 'The referral might take 24 hours to appear')
          .parents()
          .next()
          .find('button')
          .should('contain', 'Send referral')
          .next()
          .should('contain', 'Cancel')
      })
    }
  )

  context(
    'when "Continue" button is clicked after all fields filled in',
    () => {
      it('the input data should appear in the form when "Edit Referral" is clicked', () => {
        cy.visit(
          urls.companies.referrals.send(fixtures.company.withContacts.id)
        )
        enterAdviserDefault()
        enterSubjectDefault()
        enterNotesDefault()
        enterContactDefault()
        cy.contains('button', 'Continue').click()
        cy.contains('Edit Referral').click()
        cy.get(selectors.sendReferral.adviserField)
          .find('input')
          .should('have.attr', 'value', 'Shawn Cohen, Charles Gilbert')
        cy.get(selectors.sendReferral.subjectFieldInput).should(
          'have.attr',
          'value',
          'Example subject'
        )
        cy.get(selectors.sendReferral.notesField).should(
          'contain',
          'Example notes'
        )
        cy.get(selectors.sendReferral.contactField)
          .find('input')
          .should('have.attr', 'value', 'Johnny Cakeman')
      })
    }
  )

  context(
    'When the "Cancel" link is clicked from the confirmation component',
    () => {
      it('should return to the company page', () => {
        enterAdviserDefault()
        enterSubjectDefault()
        enterNotesDefault()
        enterContactDefault()
        cy.contains('Cancel').click()
        cy.url().should(
          'contain',
          urls.companies.overview.index(fixtures.company.withContacts.id)
        )
      })
    }
  )

  context(
    'When the "Send referral" button is clicked from the confirmation component',
    () => {
      before(() => {
        cy.visit(
          urls.companies.referrals.send(fixtures.company.withContacts.id)
        )
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
          urls.companies.overview.index(fixtures.company.withContacts.id)
        )
        assertFlashMessage('Referral sent')
        cy.contains('You can see all of your referrals on your Homepage.')
          .contains('see all of your referrals on your Homepage')
          .should('have.attr', 'href', urls.companies.referrals.list())
      })
    }
  )
})

describe('Contact loop', () => {
  context('when a contact does not exist and user wants to add one', () => {
    beforeEach(() => {
      cy.visit(urls.companies.referrals.send(fixtures.company.withContacts.id))
    })

    after(() => {
      window.sessionStorage.clear()
    })

    it('should redirect the user back to the interaction form and add the contact after the contact is added', () => {
      cy.get(selectors.sendReferral.subjectField)
        .click()
        .type('Test if values are restored')

      cy.contains('a', 'add a new contact').click()

      cy.contains('a', 'Cancel').should(
        'have.attr',
        'href',
        urls.companies.referrals.send(fixtures.company.withContacts.id)
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
        urls.companies.referrals.send(fixtures.company.withContacts.id)
      )

      // We are not expecting John Doe here, because the mocked sandbox response
      // returns Json Russel
      cy.contains(`You have successfully added a new contact Json Russel`)

      cy.get(selectors.sendReferral.subjectFieldInput).should(
        'have.attr',
        'value',
        'Test if values are restored'
      )

      cy.get(selectors.sendReferral.contactField)
        .find('input')
        .should('have.attr', 'value', 'Json Russel')
    })
  })
})
