const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')
const selectors = require('../../../../selectors')
const {
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')

const selectTypeahead = (fieldName, input, spanNumber) =>
  cy.contains(fieldName).within(() => {
    cy.get('div')
      .eq(0)
      .type(input)
      .within(() => {
        cy.get('span')
          .eq(spanNumber)
          .click()
      })
  })

describe('Send a referral form', () => {
  before(() => {
    cy.visit(urls.companies.sendReferral(fixtures.company.withContacts.id))
  })

  describe('All but successful completion', () => {
    beforeEach(() => {
      cy.visit(urls.companies.sendReferral(fixtures.company.withContacts.id))
    })

    context('when viewing the "send referral" form', () => {
      it('should display breadcrumbs', () => {
        assertBreadcrumbs({
          Home: urls.dashboard(),
          Companies: urls.companies.index(),
          'Venus Ltd': urls.companies.detail(fixtures.company.withContacts.id),
          'Send a referral': null,
        })
      })

      it('should display the header', () => {
        assertLocalHeader('Send a referral')
      })

      it('should display the headings and four fields', () => {
        cy.get(selectors.companySendReferral.form)
          .should('contain', 'Adviser')
          .and('contain', 'Subject')
          .and('contain', 'Notes')
          .and('contain', 'Company contact (optional')
        cy.get(selectors.companySendReferral.adviserField).should('be.visible')
        cy.get(selectors.companySendReferral.subjectField).should('be.visible')
        cy.get(selectors.companySendReferral.notesField).should('be.visible')
        cy.get(selectors.companySendReferral.contactField).should('be.visible')
      })

      it('should display "Continue" button', () => {
        cy.get(selectors.companySendReferral.continueButton).should(
          'be.visible'
        )
      })

      it('should display "Cancel" link', () => {
        cy.get(selectors.companySendReferral.cancelLink).should('be.visible')
      })
    })

    context('When the "Cancel" link is clicked', () => {
      it('should return to the company page', () => {
        cy.get(selectors.companySendReferral.cancelLink).click()
        cy.url().should(
          'contain',
          urls.companies.activity.index(fixtures.company.withContacts.id)
        )
      })
    })

    context(
      'when "Continue" button is clicked without filling in mandatory fields',
      () => {
        it('should display two error messages', () => {
          cy.get(selectors.companySendReferral.continueButton).click()
          cy.get(selectors.companySendReferral.form)
            .should('contain', 'Select an adviser for the referral')
            .and('contain', 'Enter a subject for the referral')
        })
      }
    )

    context(
      'when "Continue" button is clicked without chosing an adviser',
      () => {
        it('should display error message', () => {
          cy.get(selectors.companySendReferral.subjectField)
            .click()
            .type('Example subject')
          cy.get(selectors.companySendReferral.continueButton).click()
          cy.get(selectors.companySendReferral.form).contains(
            'Select an adviser for the referral'
          )
        })
      }
    )

    context(
      'when "Continue" button is clicked without specifying a subject',
      () => {
        it('should display error message', () => {
          selectTypeahead('Adviser', 'S', 3)
          cy.get(selectors.companySendReferral.continueButton).click()
          cy.get(selectors.companySendReferral.form).contains(
            'Enter a subject for the referral'
          )
        })
      }
    )

    context(
      'when more than 255 characters are entered in the subject field',
      () => {
        it('should display error message', () => {
          cy.get(selectors.companySendReferral.subjectField)
            .click()
            .type(
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nec interdum velit. Nulla facilisi. In ultricies sed ex at malesuada. Proin quis faucibus felis, iaculis malesuada sem. Maecenas semper elit magna, tincidunt consectetur risus volutpat at. Sed'
            )
          cy.get(selectors.companySendReferral.form).contains(
            'Subject must be 255 characters or less'
          )
        })
      }
    )

    context('when the text in the subject field is removed', () => {
      it('should display error message', () => {
        cy.get(selectors.companySendReferral.subjectField)
          .click()
          .type('example subject')
        cy.get(selectors.companySendReferral.subjectField).clear()
        cy.get(selectors.companySendReferral.form).contains(
          'Enter a subject for the referral'
        )
      })
    }),
      context(
        'when "Continue" button is clicked with just mandatory fields filled in',
        () => {
          it('should display confirmation component', () => {
            selectTypeahead('Adviser', 'S', 3)
            cy.get(selectors.companySendReferral.subjectField)
              .click()
              .type('Example subject')
              .get(selectors.companySendReferral.continueButton)
              .click()
            cy.get(selectors.companySendReferral.confirmationComponent).should(
              'contain.text',
              'Confirmation Page'
            )
          })
        }
      )

    context(
      'when "Continue" button is clicked after all fields filled in',
      () => {
        it('should display confirmation component and persist the form values', () => {
          cy.visit(
            urls.companies.sendReferral(fixtures.company.withContacts.id)
          )
          selectTypeahead('Adviser', 'S', 3)
          cy.get(selectors.companySendReferral.subjectField)
            .click()
            .type('Example subject')
            .get(selectors.companySendReferral.notesField)
            .click()
            .type('Example notes')
          selectTypeahead('Company contact', 'J', 2)
            .get(selectors.companySendReferral.continueButton)
            .click()
          cy.get(selectors.companySendReferral.confirmationComponent).should(
            'contain.text',
            'Confirmation Page'
          )
          cy.get(selectors.companySendReferral.backButton).click()
          cy.get(selectors.companySendReferral.adviserField).should(
            'contain',
            'Shawn Cohen'
          )
          cy.get(selectors.companySendReferral.subjectField).should(
            'have.attr',
            'value',
            'Example subject'
          )
          cy.get(selectors.companySendReferral.notesField).should(
            'have.text',
            'Example notes'
          )
          cy.get(selectors.companySendReferral.contactField).should(
            'contain',
            'Johnny Cakeman'
          )
        })
      }
    )
  })
})
