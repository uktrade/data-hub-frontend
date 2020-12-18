import {
  assertFieldCheckbox,
  assertFieldInput,
  assertFieldRadiosWithLegend,
  assertFieldTextarea,
} from '../../support/assertions'

const JOSEPH_WOOF_CONTACT_ID = '00131246-fb98-e211-a939-e4115bead28a'
const ZBONCAK_COMPANY_ID = '4cd4128b-1bad-4f1e-9146-5d4678c6a018'
const ZBONCAK_COMPANY_NAME =
  'Zboncak Group|271eb29e-425b-4cd8-b386-3208c3a5f978'

describe('Contact Edit Form Validation', () => {
  before(() => {
    cy.visit(`/contacts/${JOSEPH_WOOF_CONTACT_ID}/edit`)
      .get('[data-test="contact-company-link"]')
      .as('companyLink')
      .get('form')
      .as('contactEditForm')
  })

  it('should render a form with existing contact details', () => {
    const expectedFields = [
      {
        identifier: '#group-field-first_name',
        label: 'First name',
        value: 'Joseph',
        assert: assertFieldInput,
      },
      {
        identifier: '#group-field-last_name',
        label: 'Last name',
        value: 'Woof',
        assert: assertFieldInput,
      },
      {
        identifier: '#group-field-job_title',
        label: 'Job title',
        value: 'Dog master',
        assert: assertFieldInput,
      },
      {
        identifier: '#group-field-primary',
        legend: 'Is this person a primary contact?',
        value: 'Yes',
        type: 'radio',
        optionsCount: 2,
        assert: assertFieldRadiosWithLegend,
      },
      {
        identifier: '#group-field-telephone_countrycode',
        label: 'Telephone country code',
        value: '222',
        assert: assertFieldInput,
      },
      {
        identifier: '#group-field-telephone_number',
        label: 'Telephone number',
        value: '3453454',
        assert: assertFieldInput,
      },
      {
        identifier: '#group-field-email',
        label: 'Email',
        value: 'contact@bob.com',
        assert: assertFieldInput,
      },
      {
        identifier: '#group-field-accepts_dit_email_marketing',
        label: 'The company contact does accept email marketing ',
        value: 'accepts_dit_email_marketing',
        checked: false,
        assert: assertFieldCheckbox,
      },
      {
        identifier: '#group-field-address_same_as_company',
        legend: 'Is the contact’s address the same as the company address?',
        value: 'Yes',
        type: 'radio',
        optionsCount: 2,
        assert: assertFieldRadiosWithLegend,
      },
      {
        identifier: '#group-field-telephone_alternative',
        label: 'Alternative telephone number (optional)',
        value: '',
        assert: assertFieldInput,
      },
      {
        identifier: '#group-field-email_alternative',
        label: 'Alternative email (optional)',
        value: '',
        assert: assertFieldInput,
      },
      {
        identifier: '#group-field-notes',
        label: 'Notes (optional)',
        value: '',
        assert: assertFieldTextarea,
      },
    ]

    cy.get('@companyLink')
      .should('have.attr', 'href', `/companies/${ZBONCAK_COMPANY_ID}`)
      .should('have.text', ZBONCAK_COMPANY_NAME)

    expectedFields.map(({ identifier, assert, ...rest }) => {
      cy.get(identifier).then((element) => assert({ element, ...rest }))
    })
  })
})
