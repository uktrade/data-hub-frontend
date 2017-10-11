const faker = require('faker')

function generateEmail (firstName, lastName, isAlternative) {
  const suffix = '@example.com'
  let emailParts = [firstName, lastName]
  if (isAlternative) {
    return emailParts.reverse().join('.') + suffix
  }
  return emailParts.join('.') + suffix
}

module.exports = {
  url: process.env.QA_HOST,
  props: {},
  elements: {
    interactions: {
      selector: '//*[contains(@class,"c-local-nav__link") and contains(text(),"Interactions")]',
      locateStrategy: 'xpath',
    },
    contactsTab: 'a[href*="/contacts"]',
    firstContactFromList: '.c-entity-list li:first-child h3 a',
    addContactButton: '#add-contact-link',
    noContactWarning: '#no-contact-warning',
    contactFirstname: '#field-first_name',
    contactLastname: '#field-last_name',
    contactJobTitle: '#field-job_title',
    contactPrimaryContactYes: '[for="field-primary-1"]',
    contactPrimaryContactNo: '[for="field-primary-2"]',
    contactTelephoneCountryCode: '#field-telephone_countrycode',
    contactTelephoneNumber: '#field-telephone_number',
    contactEmailAddress: '#field-email',
    contactSameAddressYes: '[for="field-address_same_as_company-1"]',
    contactSameAddressNo: '[for="field-address_same_as_company-2"]',
    contactCountry: '#field-address_country',
    contactAlternatePhonenumber: '#field-telephone_alternative',
    contactAlternativeEmail: '#field-email_alternative',
    contactNotes: '#field-notes',
    contactUnderSearchPage: '#contacts-list li:first-child',
    contactFullname: '#contact-list .c-entity-list li:first-child .c-entity__title > a',
    ukPostcode: '#field-postcode-lookup',
    findUkAddressButton: '.postcode-lookup-button',
    selectUkAddressDropdown: '#field-postcode-address-suggestions',
    selectAnUkAddressFromList: '#field-postcode-address-suggestions option:nth-child(3)',
  },

  commands: [
    {
      clickOnFirstContactFromList () {
        return this
          .click('@firstContactFromList')
      },

      navigateToContactsPage () {
        return this
          .click('@contactsTab')
      },

      createNewPrimaryContact (firstName, lastName) {
        return this
          .click('@addContactButton')
          .setValue('@contactFirstname', firstName)
          .setValue('@contactLastname', lastName)
          .setValue('@contactJobTitle', faker.name.jobTitle())
          .click('@contactPrimaryContactNo')
          .setValue('@contactTelephoneCountryCode', faker.random.number())
          .setValue('@contactTelephoneNumber', faker.phone.phoneNumberFormat())
          .setValue('@contactEmailAddress', generateEmail(firstName, lastName))
          .click('@contactSameAddressYes')
          .setValue('@contactAlternatePhonenumber', '666555444')
          .setValue('@contactAlternativeEmail', generateEmail(firstName, lastName, true))
          .setValue('@contactNotes', `${faker.name.jobDescriptor() + firstName}`)
          .submitForm('form')
      },

      createNewNonPrimaryContact (firstName, lastName) {
        return this
          .click('@addContactButton')
          .setValue('@contactFirstname', firstName)
          .setValue('@contactLastname', lastName)
          .setValue('@contactJobTitle', faker.name.jobTitle())
          .click('@contactPrimaryContactNo')
          .setValue('@contactTelephoneCountryCode', faker.random.number())
          .setValue('@contactTelephoneNumber', faker.phone.phoneNumberFormat())
          .setValue('@contactEmailAddress', generateEmail(firstName, lastName))
          .click('@contactSameAddressYes')
          .setValue('@contactAlternatePhonenumber', '666555444')
          .setValue('@contactAlternativeEmail', generateEmail(firstName, lastName, true))
          .setValue('@contactNotes', `${faker.name.jobDescriptor()}${firstName}`)
          .submitForm('form')
      },

      clickOnContactInteractions () {
        return this
          .click('@interactions')
      },

      createNewPrimaryContactWithNewCompanyAddress (firstName, lastName) {
        this.firstname = firstName
        this.lastname = lastName
        return this
          .click('@addContactButton')
          .setValue('@contactFirstname', firstName)
          .setValue('@contactLastname', lastName)
          .setValue('@contactJobTitle', faker.name.jobTitle())
          .click('@contactPrimaryContactYes')
          .setValue('@contactTelephoneCountryCode', faker.random.number())
          .setValue('@contactTelephoneNumber', faker.phone.phoneNumberFormat())
          .setValue('@contactEmailAddress', generateEmail(firstName, lastName))
          .click('@contactSameAddressNo')
          .setValue('@ukPostcode', 'EC2Y 9AE')
          .click('@findUkAddressButton')
          .click('@selectUkAddressDropdown')
          .waitForElementPresent('@selectAnUkAddressFromList')
          .click('@selectAnUkAddressFromList')
          .setValue('@contactAlternatePhonenumber', '666555444')
          .setValue('@contactAlternativeEmail', generateEmail(firstName, lastName, true))
          .setValue('@contactNotes', `${faker.name.jobDescriptor() + firstName}`)
          .submitForm('form')
      },
    },
  ],
}
