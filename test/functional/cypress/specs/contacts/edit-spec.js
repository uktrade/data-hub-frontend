import {
  assertFieldCheckbox,
  assertFieldInput,
  assertFieldRadiosWithLegend,
  assertFieldTextarea,
} from '../../support/assertions'

const WOOF_CONTACT_ID = '5e75d636-1d24-416a-aaf0-3fb220d594ce'
const ZBONCAK_COMPANY_ID = '4cd4128b-1bad-4f1e-9146-5d4678c6a018'
const ZBONCAK_COMPANY_NAME =
  'Zboncak Group|271eb29e-425b-4cd8-b386-3208c3a5f978'
const UNITED_KINGDOM_COUNTRY_ID = '80756b9a-5d95-e211-a939-e4115bead28a'

describe('Contact Edit Form', () => {
  beforeEach(() => {
    cy.visit(`/contacts/${WOOF_CONTACT_ID}/edit`)
      .get('form')
      .as('contactEditForm')
      .get('[data-test="contact-company-link"]')
      .as('companyLink')
      .get('[data-test="return-link"]')
      .as('returnLink')
      .get('[data-test="submit"]')
      .as('submitButton')
  })

  context('get the edit contact page', () => {
    it('should render a form with existing contact details', () => {
      const expectedFields = [
        {
          identifier: '[data-test="group-field-first_name"]',
          label: 'First name',
          value: 'Joseph',
          assert: assertFieldInput,
        },
        {
          identifier: '[data-test="group-field-last_name"]',
          label: 'Last name',
          value: 'Woof',
          assert: assertFieldInput,
        },
        {
          identifier: '[data-test="group-field-job_title"]',
          label: 'Job title',
          value: 'Dog master',
          assert: assertFieldInput,
        },
        {
          identifier: '[data-test="group-field-primary"]',
          legend: 'Is this person a primary contact?',
          value: 'Yes',
          type: 'radio',
          optionsCount: 2,
          assert: assertFieldRadiosWithLegend,
        },
        {
          identifier: '[data-test="group-field-telephone_countrycode"]',
          label: 'Telephone country code',
          value: '222',
          assert: assertFieldInput,
        },
        {
          identifier: '[data-test="group-field-telephone_number"]',
          label: 'Telephone number',
          value: '3453454',
          assert: assertFieldInput,
        },
        {
          identifier: '[data-test="group-field-email"]',
          label: 'Email',
          value: 'contact@bob.com',
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
          value: 'Yes',
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

      cy.get('@companyLink')
        .should('have.attr', 'href', `/companies/${ZBONCAK_COMPANY_ID}`)
        .should('have.text', ZBONCAK_COMPANY_NAME)

      expectedFields.forEach(({ identifier, assert, ...rest }) => {
        cy.get(identifier).then((element) => assert({ element, ...rest }))
      })
    })

    it('should provide a backlink to the contact', () => {
      cy.get('@returnLink')
        .should('have.attr', 'href', `/contacts/${WOOF_CONTACT_ID}/details`)
        .should('have.text', 'Return without saving')
    })

    it('should provide a list of countries for the contact address', () => {
      cy.get('[data-test="group-field-address_country"]')
        .find(`option[value="${UNITED_KINGDOM_COUNTRY_ID}"]`)
        .should('have.text', 'United Kingdom')
    })
  })

  context('update a contact', () => {
    it('should show errors when the form does not validate', () => {
      const clearFields = [
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

      clearFields.forEach(({ fieldIdentifier }) =>
        cy.get(fieldIdentifier).find('input').clear()
      )
      cy.get('@submitButton').click()

      cy.location().should((loc) => {
        expect(loc.pathname).to.eq(`/contacts/${WOOF_CONTACT_ID}/edit`)
      })

      cy.get('[data-test="form-alert"]').as('formAlert')
      cy.get('@formAlert')
        .find('[data-test="form-alert-heading"]')
        .should('have.text', 'There was a problem submitting this form')

      clearFields.forEach(({ fieldIdentifier, alertIdentifier }) => {
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
      const existingFirstName = 'Joseph'
      const newJobTitle = 'Lion Tamer'
      cy.get('[data-test="group-field-first_name"]')
        .find('input')
        .as('firstNameInput')
      cy.get('[data-test="group-field-last_name"]')
        .find('input')
        .as('lastNameInput')
        .clear()
      cy.get('[data-test="group-field-job_title"]')
        .find('input')
        .as('jobTitleInput')
        .clear()
        .type(newJobTitle)

      cy.get('@submitButton').click()

      cy.location().should((loc) => {
        expect(loc.pathname).to.eq(`/contacts/${WOOF_CONTACT_ID}/edit`)
      })

      cy.get('@firstNameInput').should('have.value', existingFirstName)
      cy.get('@lastNameInput').should('have.value', '')
      cy.get('@jobTitleInput').should('have.value', newJobTitle)
    })

    it('should submit and go to contact details page when valid', () => {
      cy.get('@submitButton').click()
      cy.location().should((loc) => {
        expect(loc.pathname).to.eq(`/contacts/${WOOF_CONTACT_ID}/details`)
      })
      cy.get('[data-test="flash"]').should(
        'contain.text',
        'Contact record updated'
      )
    })

    it('should show an error when there is an API error', () => {
      cy.get('[data-test="group-field-first_name"]')
        .find('input')
        .clear()
        .type('Error')
      cy.get('@submitButton').click()

      cy.location().should((loc) => {
        expect(loc.pathname).to.eq(`/contacts/${WOOF_CONTACT_ID}/edit`)
      })

      cy.get('[data-test="form-alert"]').as('formAlert')
      cy.get('@formAlert')
        .find('[data-test="form-alert-heading"]')
        .should('have.text', 'There was a problem submitting this form')

      cy.get('@formAlert')
        .find('[data-test="form-alert-field-error-status"]')
        .should('have.text', 'Server error')
    })
  })
})
