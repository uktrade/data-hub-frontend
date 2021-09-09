/// <reference types="Cypress" />

const { assertBreadcrumbs } = require('../../support/assertions')

const ZBONCAK_COMPANY_ID = '4cd4128b-1bad-4f1e-9146-5d4678c6a018'
const assertErrorSummary = (...errors) =>
  cy
    .contains('There is a problem')
    .parent()
    .within(() =>
      cy
        .get('ul')
        .within(() =>
          errors.forEach((message, i) =>
            cy.get('li').eq(i).should('have.text', message)
          )
        )
    )

const assertError = (label, error) =>
  cy.contains(label).parent().contains(error)

const assertErrors = (errors) => {
  assertErrorSummary(...Object.values(errors))
  Object.entries(errors).forEach(([k, v]) => assertError(k, v))
}

const assertInputValueByLabel = (label, value) =>
  cy.contains(label).parent().find('input').should('have.value', value)

const assertInputValuesByLabels = (labelValueMap) =>
  Object.entries(labelValueMap).forEach(([label, value]) =>
    assertInputValueByLabel(label, value)
  )

const assertRadioGroup = (label, option) =>
  cy
    .contains(label)
    .parent()
    .find(`[aria-label="${option}"]`)
    .should('be.checked')

const assertRadioGroupNoOptionChecked = (label) =>
  cy.contains(label).parent().find('input').should('not.be.checked')

const assertNoMarketingConsent = () =>
  cy
    .contains('The company contact does accept email marketing')
    .parent()
    .find('input')
    .should('not.be.checked')

describe('Create contact form', () => {
  const NEW_CONTACT_ID = '14890695-ce54-4419-88d3-9224754ecbc0'

  beforeEach(() => {
    cy.visit(`/contacts/create?company=${ZBONCAK_COMPANY_ID}`)

    assertBreadcrumbs({
      Home: '/',
      Contacts: '/contacts/',
      'Add contact at Zboncak Group|271eb29e-425b-4cd8-b386-3208c3a5f978': null,
    })

    assertNoMarketingConsent()

    assertRadioGroupNoOptionChecked('Is this person a primary contact?')
    assertRadioGroupNoOptionChecked(
      'Is the contact’s address the same as the company address?'
    )

    assertInputValuesByLabels({
      'First name': '',
      'Last name': '',
      'Job title': '',
      'Telephone country code': '',
      'Telephone number': '',
      Email: '',
      'Alternative telephone number (optional)': '',
      'Alternative email (optional)': '',
    })
  })

  it('Should show errors when submitted pristine', () => {
    cy.clickSubmitButton('Add contact')

    assertErrors({
      'First name': 'This field may not be null.',
      'Last name': 'This field may not be null.',
      'Job title': 'This field may not be null.',
      'Is this person a primary contact?': 'This field is required.',
      'Telephone country code': 'This field may not be null.',
      'Telephone number': 'This field may not be null.',
      Email: 'This field may not be null.',
      'Is the contact’s address the same as the company address?':
        'This field is required.',
    })
  })

  it('Should show errors when only the same as company address is checked', () => {
    cy.checkRadioGroup(
      'Is the contact’s address the same as the company address?',
      'No'
    )

    cy.clickSubmitButton('Add contact')

    assertErrors({
      'First name': 'This field may not be null.',
      'Last name': 'This field may not be null.',
      'Job title': 'This field may not be null.',
      'Is this person a primary contact?': 'This field is required.',
      'Telephone country code': 'This field may not be null.',
      'Telephone number': 'This field may not be null.',
      Email: 'This field may not be null.',
      'Address line 1': 'Enter an address line 1',
      'Town or city': 'Enter a town or city',
    })
  })

  describe('country specific address fields', () => {
    beforeEach(() => {
      cy.checkRadioGroup(
        'Is the contact’s address the same as the company address?',
        'No'
      )
    })

    it('should only show the find postcode button when UK is selected', () => {
      cy.contains('Country').parent().find('select').select('United Kingdom')
      cy.contains('Find UK address').should('be.visible')
    })

    it('should only show the state field when US is selected', () => {
      cy.contains('Country').parent().find('select').select('United States')
      cy.get('#field-area').should('contain.text', 'State')
      cy.get('#postcode-search').should('not.exist')
    })

    it('should only show the province field when Canada is selected', () => {
      cy.contains('Country').parent().find('select').select('Canada')
      cy.get('#field-area').should('contain.text', 'Province')
      cy.get('#postcode-search').should('not.exist')
    })
  })

  it('Should show errors for invalid field values', () => {
    cy.checkRadioGroup(
      'Is the contact’s address the same as the company address?',
      'Yes'
    )
    cy.checkRadioGroup('Is this person a primary contact?', 'Yes')

    cy.typeIntoInputs({
      'First name': 'Andy',
      'Last name': 'Pipkin',
      'Job title': 'On dole',
      'Telephone country code': '12345',
      'Telephone number': '12345',
      Email: 'foo',
    })

    cy.clickSubmitButton('Add contact')

    assertErrors({
      'Telephone country code':
        'Country code should consist of one to four numbers',
      Email: 'Enter a valid email address',
    })
  })

  it('Should redirect to the new contact page when required fields are filled out', () => {
    cy.checkRadioGroup('Is this person a primary contact?', 'Yes')
    cy.checkRadioGroup(
      'Is the contact’s address the same as the company address?',
      'Yes'
    )

    cy.typeIntoInputs({
      'First name': 'Andy',
      'Last name': 'Pipkin',
      'Job title': 'On dole',
      'Telephone country code': '1234',
      'Telephone number': '456789',
      Email: 'andy@new.email',
    })

    cy.clickSubmitButton('Add contact')

    cy.location('pathname').should('eq', `/contacts/${NEW_CONTACT_ID}/details`)
  })
})

describe('Edit contact', () => {
  const EDIT_CONTACT_ID = '5e75d636-1d24-416a-aaf0-3fb220d594ce'

  describe('country specific address fields', () => {
    it('should prepopulate the state', () => {
      cy.visit(`/contacts/${EDIT_CONTACT_ID}/edit`)
      cy.get('#area')
        .find('option:selected')
        .should('have.text', 'Massachusetts')
    })

    describe('when changing countries', () => {
      describe('when changing a Canadian contact country to UK', () => {
        it('should clear the province value', () => {
          cy.intercept('PATCH', `/api-proxy/v4/contact/${EDIT_CONTACT_ID}`).as(
            'editContactResponse'
          )
          cy.log(`/api-proxy/v4/contact/${EDIT_CONTACT_ID}`)

          cy.visit(`/contacts/${EDIT_CONTACT_ID}/edit`)
          cy.get('#country').select('United Kingdom')
          cy.get('#address1').type('Address first line')
          cy.get('#city').type('Address city')
          cy.get('#postcode').type('NE16 386')
          cy.get('[data-test="submit"]').click()

          cy.wait('@editContactResponse').then((xhr) => {
            expect(xhr.request.body.address_area).to.equal(null)
          })
        })
      })

      describe('when a US contact has a US state and changes to Canada', () => {
        it('should clear the province value', () => {
          cy.log(`/api-proxy/v4/contact/${EDIT_CONTACT_ID}`)

          cy.visit(`/contacts/${EDIT_CONTACT_ID}/edit`)
          cy.get('#country').select('United States')
          cy.get('#area').select('Massachusetts')
          cy.get('#country').select('Canada')
          cy.get('#address1').type('Address first line')
          cy.get('#city').type('Address city')
          cy.get('#postcode').type('NE16 386')
          cy.get('[data-test="submit"]').click()

          cy.contains('Select a province')
        })
      })

      describe('when a UK contact is switched to US', () => {
        it('the state should be empty', () => {
          cy.log(`/api-proxy/v4/contact/${EDIT_CONTACT_ID}`)

          cy.visit(`/contacts/${EDIT_CONTACT_ID}/edit`)
          cy.get('#country').select('United Kingdom')
          cy.get('#country').select('United States')
          cy.get('#address1').type('Address first line')
          cy.get('#city').type('Address city')
          cy.get('#postcode').type('NE16 386')
          cy.get('[data-test="submit"]').click()

          cy.contains('Select a state')
        })
      })
    })
  })

  it('Should render the form with the contact values', () => {
    cy.visit(`/contacts/${EDIT_CONTACT_ID}/edit`)

    assertBreadcrumbs({
      Home: '/',
      Contacts: '/contacts/',
      'Joseph Woof': null,
      Edit: null,
    })

    cy.contains('Zboncak Group|271eb29e-425b-4cd8-b386-3208c3a5f978').should(
      'have.attr',
      'href',
      `/companies/${ZBONCAK_COMPANY_ID}`
    )

    assertNoMarketingConsent()

    assertRadioGroup('Is this person a primary contact?', 'Yes')
    assertRadioGroup(
      'Is the contact’s address the same as the company address?',
      'No'
    )

    assertInputValuesByLabels({
      'First name': 'Joseph',
      'Last name': 'Woof',
      'Job title': 'Dog master',
      'Telephone country code': '222',
      'Telephone number': '3453454',
      Email: 'contact@bob.com',
      'Alternative telephone number (optional)': '',
      'Alternative email (optional)': '',
    })
  })
})
