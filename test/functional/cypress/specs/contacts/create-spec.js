import {
  assertFieldCheckbox,
  assertFieldHidden,
  assertFieldInput,
  assertFieldRadiosWithLegend,
  assertFieldTextarea,
} from '../../support/assertions'

const ZBONCAK_COMPANY_ID = '4cd4128b-1bad-4f1e-9146-5d4678c6a018'
const NEW_CONTACT_ID = '14890695-ce54-4419-88d3-9224754ecbc0'

describe('Contact Create Form', () => {
  beforeEach(() => {
    cy.visit(`/contacts/create?company=${ZBONCAK_COMPANY_ID}`)
      .get('form')
      .as('contactCreateForm')
      .get('[data-test="return-link"]')
      .as('returnLink')
      .get('[data-test="submit"]')
      .as('submitButton')
  })

  context('get the create contact page', () => {
    it('should render a blank form with company details', () => {
      const expectedFields = [
        {
          identifier: '[data-test="field-company"]',
          name: 'company',
          value: ZBONCAK_COMPANY_ID,
          assert: assertFieldHidden,
        },
        {
          identifier: '[data-test="group-field-first_name"]',
          label: 'First name',
          value: '',
          assert: assertFieldInput,
        },
        {
          identifier: '[data-test="group-field-last_name"]',
          label: 'Last name',
          value: '',
          assert: assertFieldInput,
        },
        {
          identifier: '[data-test="group-field-job_title"]',
          label: 'Job title',
          value: '',
          assert: assertFieldInput,
        },
        {
          identifier: '[data-test="group-field-primary"]',
          legend: 'Is this person a primary contact?',
          value: '',
          type: 'radio',
          optionsCount: 2,
          assert: assertFieldRadiosWithLegend,
        },
        {
          identifier: '[data-test="group-field-telephone_countrycode"]',
          label: 'Telephone country code',
          value: '',
          assert: assertFieldInput,
        },
        {
          identifier: '[data-test="group-field-telephone_number"]',
          label: 'Telephone number',
          value: '',
          assert: assertFieldInput,
        },
        {
          identifier: '[data-test="group-field-email"]',
          label: 'Email',
          value: '',
          assert: assertFieldInput,
        },
        {
          identifier: '[data-test="group-field-accepts_dit_email_marketing"]',
          label: 'The company contact does accept email marketing ',
          value: 'accepts_dit_email_marketing',
          checked: false,
          assert: assertFieldCheckbox,
        },
        {
          identifier: '[data-test="group-field-address_same_as_company"]',
          legend: 'Is the contact’s address the same as the company address?',
          value: '',
          type: 'radio',
          optionsCount: 2,
          assert: assertFieldRadiosWithLegend,
        },
        {
          identifier: '[data-test="group-field-telephone_alternative"]',
          label: 'Alternative telephone number (optional)',
          value: '',
          assert: assertFieldInput,
        },
        {
          identifier: '[data-test="group-field-email_alternative"]',
          label: 'Alternative email (optional)',
          value: '',
          assert: assertFieldInput,
        },
        {
          identifier: '[data-test="group-field-notes"]',
          label: 'Notes (optional)',
          value: '',
          assert: assertFieldTextarea,
        },
      ]

      expectedFields.forEach(({ identifier, assert, ...rest }) => {
        cy.get(identifier).then((element) => assert({ element, ...rest }))
      })
    })

    it('should provide a backlink to the company contacts page', () => {
      cy.get('@returnLink')
        .should(
          'have.attr',
          'href',
          `/companies/${ZBONCAK_COMPANY_ID}/contacts`
        )
        .should('have.text', 'Cancel')
    })
  })

  context('create a contact', () => {
    it('should show errors when the form does not validate', () => {
      const fields = [
        {
          fieldIdentifier: '[data-test="group-field-first_name"]',
          alertIdentifier: '[data-test=form-alert-field-error-first_name]',
        },
        {
          fieldIdentifier: '[data-test="group-field-last_name"]',
          alertIdentifier: '[data-test=form-alert-field-error-first_name]',
        },
        {
          fieldIdentifier: '[data-test="group-field-job_title"]',
          alertIdentifier: '[data-test=form-alert-field-error-first_name]',
        },
        {
          fieldIdentifier: '[data-test="group-field-telephone_countrycode"]',
          alertIdentifier: '[data-test=form-alert-field-error-first_name]',
        },
        {
          fieldIdentifier: '[data-test="group-field-telephone_number"]',
          alertIdentifier: '[data-test=form-alert-field-error-first_name]',
        },
        {
          fieldIdentifier: '[data-test="group-field-email"]',
          alertIdentifier: '[data-test=form-alert-field-error-first_name]',
        },
      ]

      cy.get('@submitButton').click()

      cy.location().should((loc) => {
        expect(loc.pathname).to.eq('/contacts/create')
      })

      cy.get('[data-test="form-alert"]').as('formAlert')
      cy.get('@formAlert')
        .find('[data-test="form-alert-heading"]')
        .should('have.text', 'There was a problem submitting this form')

      fields.forEach(({ fieldIdentifier, alertIdentifier }) => {
        cy.get('@formAlert')
          .find(alertIdentifier)
          .should('have.text', 'This field may not be null.')

        cy.get(fieldIdentifier)
          .should('have.class', 'has-error')
          .find('[data-test="field-error"]')
          .should('have.text', 'This field may not be null.')

        cy.get(fieldIdentifier)
          .find('input')
          .should('have.class', 'has-error')
          .should('have.value', '')
      })
    })

    it('should persist the value of inputs', () => {
      const newJobTitle = 'Lion Tamer'
      cy.get('[data-test="group-field-job_title"]')
        .find('input')
        .as('jobTitleInput')
        .clear()
        .type(newJobTitle)

      cy.get('@submitButton').click()

      cy.location().should((loc) => {
        expect(loc.pathname).to.eq('/contacts/create')
      })
      cy.get('@jobTitleInput').should('have.value', newJobTitle)
    })

    it('should submit and go to contact details page when valid', () => {
      const fieldInputs = [
        {
          fieldIdentifier: '[data-test="group-field-first_name"]',
          value: 'Indiana',
        },
        {
          fieldIdentifier: '[data-test="group-field-last_name"]',
          value: 'Jones',
        },
        {
          fieldIdentifier: '[data-test="group-field-job_title"]',
          value: 'Archaeologist',
        },
        {
          fieldIdentifier: '[data-test="group-field-telephone_countrycode"]',
          value: '+00',
        },
        {
          fieldIdentifier: '[data-test="group-field-telephone_number"]',
          value: '123456789',
        },
        {
          fieldIdentifier: '[data-test="group-field-email"]',
          value: 'indy@example.com',
        },
      ]
      fieldInputs.forEach(({ fieldIdentifier, value }) => {
        cy.get(fieldIdentifier).find('input').clear().type(value)
      })

      cy.get('@submitButton').click()

      cy.location().should((loc) => {
        expect(loc.pathname).to.eq(`/contacts/${NEW_CONTACT_ID}/details`)
      })
      cy.get('[data-test="flash"]').should('contain.text', 'Added new contact')
    })
  })
})
