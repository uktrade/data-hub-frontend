/// <reference types="Cypress" />

const { assertBreadcrumbs } = require('../../support/assertions')
const urls = require('../../../../../src/lib/urls')

const ZBONCAK_COMPANY_ID = '4cd4128b-1bad-4f1e-9146-5d4678c6a018'
const MANY_CONTACTS_ID = '57c41268-26be-4335-a873-557e8b0deb29'
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
  cy.contains(label).parent().parent().contains(error)

const assertErrors = (errors) => {
  assertErrorSummary(...Object.values(errors))
  Object.entries(errors).forEach(([k, v]) => assertError(k, v))
}

const assertInputValueByLabel = (label, value) =>
  cy.contains(label).parent().parent().find('input').should('have.value', value)

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

const NEW_CONTACT_ID = '14890695-ce54-4419-88d3-9224754ecbc0'
describe('Create contact form', () => {
  beforeEach(() => {
    cy.visit(`/contacts/create?company=${ZBONCAK_COMPANY_ID}`)

    assertBreadcrumbs({
      Home: '/',
      Contacts: '/contacts/',
      'Add contact at Zboncak Group|271eb29e-425b-4cd8-b386-3208c3a5f978': null,
    })

    assertRadioGroupNoOptionChecked('Is this person a primary contact?')
    assertRadioGroupNoOptionChecked(
      'Is this contact’s work address the same as the company address?'
    )

    assertInputValuesByLabels({
      'First name': '',
      'Last name': '',
      'Job title': '',
      'Phone number': '',
      'Email address': '',
    })
  })

  it('Should show errors when submitted pristine', () => {
    cy.clickSubmitButton('Add contact')

    assertErrors({
      'First name': 'Enter a first name',
      'Last name': 'Enter a last name',
      'Job title': 'Enter a job title',
      'Email address': 'Enter an email address',
      'Is this contact’s work address the same as the company address?':
        "Select yes if the contact's work address is the same as the company address",
      'Is this person a primary contact?':
        "Select yes if this person is the company's primary contact",
    })
  })

  it('Should show errors when only the same as company address is checked', () => {
    cy.checkRadioGroup(
      'Is this contact’s work address the same as the company address?',
      'No'
    )

    cy.clickSubmitButton('Add contact')

    assertErrors({
      'First name': 'Enter a first name',
      'Last name': 'Enter a last name',
      'Job title': 'Enter a job title',
      'Email address': 'Enter an email address',
      'Is this person a primary contact?':
        "Select yes if this person is the company's primary contact",
    })

    cy.contains('Country').parent().parent().find('select').select('Brazil')
    cy.clickSubmitButton('Add contact')

    assertErrors({
      'First name': 'Enter a first name',
      'Last name': 'Enter a last name',
      'Job title': 'Enter a job title',
      'Email address': 'Enter an email address',
      'Is this person a primary contact?':
        "Select yes if this person is the company's primary contact",
      'Address line 1': 'Enter an address',
      'Town or city': 'Enter a town or city',
    })
  })

  describe('country specific address fields', () => {
    beforeEach(() => {
      cy.checkRadioGroup(
        'Is this contact’s work address the same as the company address?',
        'No'
      )
    })

    it('should only show the find postcode button when UK is selected', () => {
      cy.contains('Country')
        .parent()
        .parent()
        .find('select')
        .select('United Kingdom')
      cy.contains('Find UK address').should('be.visible')
    })

    it('should only show the state field when US is selected', () => {
      cy.contains('Country')
        .parent()
        .parent()
        .find('select')
        .select('United States')
      cy.get('#field-area').should('contain.text', 'State')
      cy.get('#postcode-search').should('not.exist')
    })

    it('should only show the province field when Canada is selected', () => {
      cy.contains('Country').parent().parent().find('select').select('Canada')
      cy.get('#field-areaCanada').should('contain.text', 'Province')
      cy.get('#postcode-search').should('not.exist')
    })
  })

  it('Should show errors for invalid field values', () => {
    cy.checkRadioGroup(
      'Is this contact’s work address the same as the company address?',
      'Yes'
    )
    cy.checkRadioGroup('Is this person a primary contact?', 'Yes')

    cy.typeIntoInputs({
      'First name': 'Andy',
      'Last name': 'Pipkin',
      'Job title': 'On dole',
      'Phone number': '12345',
      'Email address': 'foo',
    })

    cy.clickSubmitButton('Add contact')

    assertErrors({
      'Email address':
        'Enter an email address in the correct format, like name@example.com',
    })
  })

  it('Should redirect to the new contact page when required fields are filled out', () => {
    create_contact('Yes')
    cy.location('pathname').should('eq', `/contacts/${NEW_CONTACT_ID}/details`)
  })

  describe('When a company has many contacts', () => {
    const LARGE_COMPANY_NEW_CONTACT = '9d9dcf7b-77b5-4326-b3df-ed1409adeb6f'
    beforeEach(() => {
      cy.visit(`/contacts/create?company=${MANY_CONTACTS_ID}`)
    })
    it('should be possible to add another contact', () => {
      cy.checkRadioGroup('Is this person a primary contact?', 'Yes')
      cy.checkRadioGroup(
        'Is this contact’s work address the same as the company address?',
        'Yes'
      )

      cy.typeIntoInputs({
        'First name': 'Andy',
        'Last name': 'Pipkin',
        'Job title': 'On dole',
        'Phone number': '456789',
        'Email address': 'andy@new.email',
      })

      cy.clickSubmitButton('Add contact')

      cy.location('pathname').should(
        'eq',
        `/contacts/${LARGE_COMPANY_NEW_CONTACT}/details`
      )
    })
  })
})

describe('Edit contact', () => {
  const EDIT_US_CONTACT_ID = '5e75d636-1d24-416a-aaf0-3fb220d594ce'
  const EDIT_UK_CONTACT_ID = 'f3d19ea7-d4cf-43e0-8e97-755c57cae313'

  describe('country specific address fields', () => {
    it('should prepopulate the state', () => {
      cy.visit(`/contacts/${EDIT_US_CONTACT_ID}/edit`)
      cy.get('#area')
        .find('option:selected')
        .should('have.text', 'Massachusetts')
    })

    describe('when a UK company is submitted', () => {
      it('should explicitly submit area as null', () => {
        cy.intercept('PATCH', `/api-proxy/v4/contact/${EDIT_UK_CONTACT_ID}`).as(
          'editContactResponse'
        )

        cy.visit(`/contacts/${EDIT_UK_CONTACT_ID}/edit`)
        cy.get('#address1').type('Address first line')
        cy.get('#city').type('Address city')
        cy.get('#postcode').type('NE16 386')
        cy.clickSubmitButton('Save and return')

        cy.wait('@editContactResponse').then((xhr) => {
          expect(xhr.request.body.address_area).to.equal(null)
        })
      })
    })

    describe('when changing countries', () => {
      describe('when changing a Canadian contact country to UK', () => {
        it('should clear the province value', () => {
          cy.intercept(
            'PATCH',
            `/api-proxy/v4/contact/${EDIT_US_CONTACT_ID}`
          ).as('editContactResponse')

          cy.visit(`/contacts/${EDIT_US_CONTACT_ID}/edit`)
          cy.get('#country').select('United Kingdom')
          cy.get('#address1').type('Address first line')
          cy.get('#city').type('Address city')
          cy.get('#postcode').type('NE16 386')
          cy.clickSubmitButton('Save and return')

          cy.wait('@editContactResponse').then((xhr) => {
            expect(xhr.request.body.address_area).to.equal(null)
          })
        })
      })

      describe('when a US contact has a US state and changes to Canada', () => {
        it('should clear the province value', () => {
          cy.visit(`/contacts/${EDIT_US_CONTACT_ID}/edit`)
          cy.get('#country').select('United States')
          cy.get('#area').select('Massachusetts')
          cy.get('#country').select('Canada')
          cy.get('#address1').type('Address first line')
          cy.get('#city').type('Address city')
          cy.get('#postcode').type('NE16 386')
          cy.clickSubmitButton('Save and return')

          cy.contains('Select a province')
        })
      })

      describe('when a UK contact is switched to US', () => {
        it('the state should be empty', () => {
          cy.visit(`/contacts/${EDIT_UK_CONTACT_ID}/edit`)
          cy.get('#country').select('United Kingdom')
          cy.get('#country').select('United States')
          cy.get('#address1').type('Address first line')
          cy.get('#city').type('Address city')
          cy.get('#postcode').type('NE16 386')
          cy.clickSubmitButton('Save and return')

          cy.contains('Select a state')
        })
      })
    })
  })

  it('Should render the form with the contact values', () => {
    cy.visit(`/contacts/${EDIT_US_CONTACT_ID}/edit`)

    assertBreadcrumbs({
      Home: '/',
      Contacts: '/contacts/',
      'Joseph Woof': urls.contacts.details(EDIT_US_CONTACT_ID),
      Edit: null,
    })

    cy.contains('Zboncak Group|271eb29e-425b-4cd8-b386-3208c3a5f978').should(
      'have.attr',
      'href',
      `/companies/${ZBONCAK_COMPANY_ID}`
    )

    assertRadioGroup('Is this person a primary contact?', 'Yes')
    assertRadioGroup(
      'Is this contact’s work address the same as the company address?',
      'No'
    )

    assertInputValuesByLabels({
      'First name': 'Joseph',
      'Last name': 'Woof',
      'Job title': 'Dog master',
      'Phone number': '222 3453454',
      'Email address': 'contact@bob.com',
    })
  })
})

describe('Contact form routing', () => {
  context('When an origin url is provided without any query strings', () => {
    beforeEach(() => {
      cy.visit(
        `/contacts/create?company=${ZBONCAK_COMPANY_ID}&origin_url=companies/${ZBONCAK_COMPANY_ID}/overview`
      )
    })
    it('should redirect to the origin url after adding a contact', () => {
      create_contact()

      cy.location('pathname').should(
        'eq',
        `/companies/${ZBONCAK_COMPANY_ID}/overview`
      )
      cy.location('search').should(
        'eq',
        `?new-contact-id=${NEW_CONTACT_ID}&new-contact-name=Json+Russel`
      )
    })
  })

  context('When an origin url is provided with query strings', () => {
    beforeEach(() => {
      cy.visit(
        `/contacts/create?company=${ZBONCAK_COMPANY_ID}&origin_url=companies/${ZBONCAK_COMPANY_ID}/overview&origin_search=${btoa(
          '?a=1&b=2&c=3'
        )}`
      )
    })
    it('should redirect to the origin url with existing query strings preserved after adding a contact', () => {
      create_contact()

      cy.location('pathname').should(
        'eq',
        `/companies/${ZBONCAK_COMPANY_ID}/overview`
      )
      cy.location('search').should(
        'eq',
        `?a=1&b=2&c=3&new-contact-id=${NEW_CONTACT_ID}&new-contact-name=Json+Russel`
      )
    })
  })
})

function create_contact(primaryContact = 'No') {
  cy.checkRadioGroup('Is this person a primary contact?', primaryContact)
  cy.checkRadioGroup(
    'Is this contact’s work address the same as the company address?',
    'Yes'
  )

  cy.typeIntoInputs({
    'First name': 'Andy',
    'Last name': 'Pipkin',
    'Job title': 'On dole',
    'Phone number': '456789',
    'Email address': 'AndY@nEw.emAIl',
  })

  cy.clickSubmitButton('Add contact')
}
