const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')
const selectors = require('../../../../selectors')
const {
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')

const selectTypeahead = (fieldName, input, spanNumber) =>
  cy.contains(fieldName).within(() => {
    cy.server()
    cy.route('/api-proxy/adviser/?*').as('adviserResults')
    cy.get('div')
      .eq(0)
      .type(input)
    cy.wait('@adviserResults')
    cy.get('[class*="MenuList"] > div > span').click()
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
          selectTypeahead('Adviser', 'shawn')
          cy.get(selectors.companySendReferral.continueButton).click()
          cy.get(selectors.companySendReferral.form).should(
            'contain',
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
          cy.get(selectors.companySendReferral.form).should(
            'contain',
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
        cy.get(selectors.companySendReferral.form).should(
          'contain',
          'Enter a subject for the referral'
        )
      })
    }),
      context(
        'when "Continue" button is clicked with just mandatory fields filled in',
        () => {
          it('should display confirmation component', () => {
            selectTypeahead('Adviser', 'shawn')
            cy.get(selectors.companySendReferral.subjectField)
              .click()
              .type('Example subject')
              .get(selectors.companySendReferral.continueButton)
              .click()
            cy.contains('Check referral details').should('be.visible')
          })
        }
      )
  })

  context(
    'when "Continue" button is clicked after all fields filled in',
    () => {
      it('should display the confirmation component with the values just input', () => {
        cy.visit(urls.companies.sendReferral(fixtures.company.withContacts.id))
        selectTypeahead('Adviser', 'shawn')
        cy.get(selectors.companySendReferral.subjectField)
          .click()
          .type('Example subject')
          .get(selectors.companySendReferral.notesField)
          .click()
          .type('Example notes')
        selectTypeahead('Company contact', 'johnny')
          .get(selectors.companySendReferral.continueButton)
          .click()
        cy.get('table')
          .should('contain', 'Shawn Cohen')
          .and('contain', 'Example subject')
          .and('contain', 'Example notes')
          .and('contain', 'Johnny Cakeman')
        cy.contains('Edit referral').should('be.visible')
        cy.get('h4').should('contain', 'What happens next')
        cy.get('p')
          .eq(2)
          .should(
            'have.text',
            'Clicking “Send referral” will show the referral in the activity of Venus Ltd, as well as in the Referrals section on both your Data Hub' +
              ' Homepage and the Homepage of the recipient.' +
              'It might take up to 24 hours for the referral to appear.' +
              'You will not be able to edit the referral after this point.'
          )
        cy.get('button')
          .eq(2)
          .should('be.visible')
        cy.contains('Cancel').should('be.visible')
      })
    }
  )

  context(
    'when "Continue" button is clicked after all fields filled in',
    () => {
      it('the input data should appear in the form when "Edit referral" is clicked', () => {
        cy.visit(urls.companies.sendReferral(fixtures.company.withContacts.id))
        selectTypeahead('Adviser', 'shawn')
        cy.get(selectors.companySendReferral.subjectField)
          .click()
          .type('Example subject')
          .get(selectors.companySendReferral.notesField)
          .click()
          .type('Example notes')
        selectTypeahead('Company contact', 'johnny')
          .get(selectors.companySendReferral.continueButton)
          .click()
        cy.contains('Edit referral').click()
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

  context(
    'When the "Cancel" link is clicked from the confirmation component',
    () => {
      it('should return to the company page', () => {
        selectTypeahead('Adviser', 'shawn')
        cy.get(selectors.companySendReferral.subjectField)
          .click()
          .type('Example subject')
          .get(selectors.companySendReferral.continueButton)
          .click()
        cy.contains('Cancel').click()
        cy.url().should(
          'contain',
          urls.companies.activity.index(fixtures.company.withContacts.id)
        )
      })
    }
  )

  context(
    'When the "Send referral" button is clicked from the confirmation component',
    () => {
      before(() => {
        cy.visit(urls.companies.sendReferral(fixtures.company.withContacts.id))
      })
      it('should take user to the company page, display flash message and link to the homepage', () => {
        selectTypeahead('Adviser', 'shawn')
        cy.get(selectors.companySendReferral.subjectField)
          .click()
          .type('Example subject')
          .get(selectors.companySendReferral.continueButton)
          .click()
        cy.get('button')
          .eq(2)
          .click() //Fix reference to send referral button
        cy.url().should(
          'contain',
          urls.companies.activity.index(fixtures.company.withContacts.id)
        )
        cy.get(selectors.localHeader().flash).should('contain', 'Referral sent')
        cy.contains('find your referrals on the Homepage').click()
        cy.url().should('contain', urls.dashboard())
      })
    }
  )
})
