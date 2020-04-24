const urls = require('../../../../../../src/lib/urls')
const fixtures = require('../../../fixtures')
const selectors = require('../../../../../selectors')
const {
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../../support/assertions')

const selectTypeahead = (fieldName, input) =>
  cy.contains(fieldName).within(() => {
    cy.server()
    cy.route('/api-proxy/adviser/?*').as('adviserResults')
    cy.get('div')
      .eq(0)
      .type(input)
    cy.wait('@adviserResults')
    cy.get('[class*="menu"] > div').click()
  })

describe('Send a referral form', () => {
  before(() => {
    cy.visit(urls.companies.referrals.send(fixtures.company.withContacts.id))
  })

  describe('All but successful completion', () => {
    beforeEach(() => {
      cy.visit(urls.companies.referrals.send(fixtures.company.withContacts.id))
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
        cy.contains('Who do you want to refer this company to?').should(
          'be.visible'
        )
        cy.contains('label', 'Adviser')
          .should('be.visible')
          .and(
            'contain',
            "This can be an adviser at post, a sector specialist or an international trade advisor. If you're not sure, you can find the right team and person on Digital Workspace (opens in a new window or tab)."
          )
        cy.contains('Referral notes').should('be.visible')
        cy.contains('label', 'Subject').should('be.visible')
        cy.contains('label', 'Notes')
          .should('be.visible')
          .and(
            'contain',
            "Include reasons you're referring this company and any specific opportunities."
          )
        cy.contains('label', 'Company contact (optional)')
          .should('be.visible')
          .and('contain', 'Who should the recipient of the referral talk to?')
      })

      it('should display "Continue" button', () => {
        cy.contains('button', 'Continue').should('be.visible')
      })

      it('should display "Cancel" link', () => {
        cy.contains('a', 'Cancel').should('be.visible')
      })
    })

    context('When the "Cancel" link is clicked', () => {
      it('should return to the company page', () => {
        cy.contains('a', 'Cancel').click()
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
          cy.contains('button', 'Continue').click()
          cy.get('form')
            .should('contain', 'Select an adviser for the referral')
            .and('contain', 'Enter a subject for the referral')
            .and('contain', 'Enter notes for the referral')
        })
      }
    )

    context(
      'when "Continue" button is clicked without chosing an adviser',
      () => {
        it('should display error message', () => {
          cy.contains('label', 'Subject')
            .find('input')
            .click()
            .type('Example subject')
          cy.contains('label', 'Notes')
            .find('textarea')
            .click()
            .type('Example notes')
          cy.contains('button', 'Continue').click()
          cy.get('form').should('contain', 'Select an adviser for the referral')
        })
      }
    )

    context(
      'when "Continue" button is clicked without specifying a subject',
      () => {
        it('should display error message', () => {
          selectTypeahead('Adviser', 'shawn')
          cy.contains('label', 'Notes')
            .find('textarea')
            .click()
            .type('Example notes')
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
          selectTypeahead('Adviser', 'shawn')
          cy.contains('label', 'Subject')
            .find('input')
            .click()
            .type('Example subject')
          cy.contains('button', 'Continue').click()
          cy.get('form').should('contain', 'Enter notes for the referral')
        })
      }
    )

    context(
      'when more than 255 characters are entered in the subject field',
      () => {
        it('should display error message', () => {
          cy.contains('label', 'Subject')
            .find('input')
            .click()
            .type(
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nec interdum velit. Nulla facilisi. In ultricies sed ex at malesuada. Proin quis faucibus felis, iaculis malesuada sem. Maecenas semper elit magna, tincidunt consectetur risus volutpat at. Sed'
            )
          cy.contains('button', 'Continue').click()
          cy.get('form').should(
            'contain',
            'Enter a subject for the referral (Max 255 characters)'
          )
        })
      }
    )
  })

  context(
    'when "Continue" button is clicked with just mandatory fields filled in',
    () => {
      it('should display confirmation component', () => {
        selectTypeahead('Adviser', 'shawn')
        cy.contains('label', 'Subject')
          .find('input')
          .click()
          .clear()
          .type('Example subject')
        cy.contains('label', 'Notes')
          .find('textarea')
          .click()
          .type('Example notes')
        cy.contains('button', 'Continue').click()
        cy.contains('Check referral details').should('be.visible')
      })
    }
  )

  context(
    'when "Continue" button is clicked after all fields filled in',
    () => {
      it('should display the confirmation component with the values just input', () => {
        cy.visit(
          urls.companies.referrals.send(fixtures.company.withContacts.id)
        )
        selectTypeahead('Adviser', 'shawn')
        cy.contains('label', 'Subject')
          .find('input')
          .click()
          .type('Example subject')
        cy.contains('label', 'Notes')
          .find('textarea')
          .click()
          .type('Example notes')
        selectTypeahead('Company contact', 'johnny')
        cy.contains('button', 'Continue').click()
        cy.contains('Check referral details').should('be.visible')
        cy.get('table')
          .should('contain', 'Shawn Cohen')
          .and('contain', 'Example subject')
          .and('contain', 'Example notes')
          .and('contain', 'Johnny Cakeman')
          .parents()
          .find('button')
          .should('contain', 'Edit referral')
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
      it('the input data should appear in the form when "Edit referral" is clicked', () => {
        cy.visit(
          urls.companies.referrals.send(fixtures.company.withContacts.id)
        )
        selectTypeahead('Adviser', 'shawn')
        cy.contains('label', 'Subject')
          .find('input')
          .click()
          .type('Example subject')
        cy.contains('label', 'Notes')
          .find('textarea')
          .click()
          .type('Example notes')
        selectTypeahead('Company contact', 'johnny')
        cy.contains('button', 'Continue').click()
        cy.contains('Edit referral').click()
        cy.contains('label', 'Adviser').should('contain', 'Shawn Cohen')
        cy.contains('label', 'Subject')
          .find('input')
          .should('have.attr', 'value', 'Example subject')
        cy.contains('label', 'Notes').should('contain', 'Example notes')
        cy.contains('label', 'Company contact (optional)').should(
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
        cy.contains('label', 'Subject')
          .find('input')
          .click()
          .type('Example subject')
        cy.contains('label', 'Notes')
          .find('textarea')
          .click()
          .type('Example notes')
        selectTypeahead('Company contact', 'johnny')
        cy.contains('button', 'Continue').click()
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
        cy.visit(
          urls.companies.referrals.send(fixtures.company.withContacts.id)
        )
      })
      it('should take user to the company page, display flash message and link to the homepage', () => {
        selectTypeahead('Adviser', 'shawn')
        cy.contains('label', 'Subject')
          .find('input')
          .click()
          .type('Example subject')
        cy.contains('label', 'Notes')
          .find('textarea')
          .click()
          .type('Example notes')
        selectTypeahead('Company contact', 'johnny')
        cy.contains('button', 'Continue').click()
        cy.contains('button', 'Send referral').click()
        cy.url().should(
          'contain',
          urls.companies.activity.index(fixtures.company.withContacts.id)
        )
        cy.get(selectors.companyLocalHeader().flash).contains('Referral sent')
        cy.contains('You can see all of your referrals on your Homepage.')
          .contains('see all of your referrals on your Homepage')
          .should('have.attr', 'href', urls.companies.referrals.list())
      })
    }
  )
})
