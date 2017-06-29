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
    contactsTab: {
      selector: "//nav/a[contains(@href, 'contacts')]",
      locateStrategy: 'xpath',
    },
    firstCompanyFromList: {
      selector: ".//*[@id='main-content']/div/article/ol/li[1]/h3/a",
      locateStrategy: 'xpath',
    },
    addContactButton: '#add-contact-link',
    noContactWarning: '#no-contact-warning',
    contactFirstname: '#first_name',
    contactLastname: '#last_name',
    contactJobTitle: '#job_title',
    contactPrimaryContactYes: {
      selector: ".//*[@id='primary-wrapper']/label[1]/input",
      locateStrategy: 'xpath',
    },
    contactPrimaryContactNo: {
      selector: ".//*[@id='primary-wrapper']/label[2]/input",
      locateStrategy: 'xpath',
    },
    contactTelephoneCountryCode: '#telephone_countrycode',
    contactTelephoneNumber: '#telephone_number',
    contactEmailAddress: '#email',
    contactSameAddressYes: '#address-same-radio',
    contactSameAddressNo: {
      selector: ".//*[@id='address_same_as_company-wrapper']/label[2]",
      locateStrategy: 'xpath',
    },
    contactCountry: '#address_country',
    contactAlternatePhonenumber: '#telephone_alternative',
    contactAlternativeEmail: '#email_alternative',
    contactNotes: '#notes',
    contactCancelButton: {
      selector: '//a[contains(@class, "button-cancel")]',
      locateStrategy: 'xpath',
    },
    contactUnderSearchPage: {
      selector: ".//*[@id='contacts-list']/li[1]",
      locateStrategy: 'xpath',
    },
    contactFullname: {
      selector: "//ul[@id='contact-list']/li[1]/div/a/span[2]",
      locateStrategy: 'xpath',
    },
    submitButton: {
      selector: "//button[@type='submit']",
      locateStrategy: 'xpath',
    },
    ukPostcode: {
      selector: ".//*[@id='address-wrapper']/div[2]/input",
      locateStrategy: 'xpath',
    },
    findUkAddressButton: {
      selector: ".//*[@id='address-wrapper']/div[2]/button",
      locateStrategy: 'xpath',
    },
    selectUkAddressDropdown: {
      selector: ".//*[@id='address-wrapper']/div[3]/select",
      locateStrategy: 'xpath',
    },
    selectAnUkAddressFromList: '#address-wrapper div:nth-child(3) select option:nth-child(3)',
  },

  commands: [
    {
      clickOnFirstCompanyFromList () {
        return this
          .click('@firstCompanyFromList')
      },

      navigateToContactsPage () {
        return this
          .clickOnFirstCompanyFromList()
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
          .click('@contactPrimaryContactYes')
          .setValue('@contactTelephoneCountryCode', faker.random.number())
          .setValue('@contactTelephoneNumber', faker.phone.phoneNumberFormat())
          .setValue('@contactEmailAddress', generateEmail(firstName, lastName))
          .setValue('@contactAlternatePhonenumber', '666555444')
          .setValue('@contactAlternativeEmail', generateEmail(firstName, lastName, true))
          .setValue('@contactNotes', `${faker.name.jobDescriptor()}${firstName}`)
          .submitForm('form')
      },

      createNewPrimaryContactWithNewCompanyAddress (firstName, lastName) {
        return this
          .click('@addContactButton')
          .setValue('@contactFirstname', firstName)
          .setValue('@contactLastname', lastName)
          .setValue('@contactJobTitle', faker.name.jobTitle())
          .click('@contactPrimaryContactNo')
          .setValue('@contactTelephoneCountryCode', faker.random.number())
          .setValue('@contactTelephoneNumber', faker.phone.phoneNumberFormat())
          .setValue('@contactEmailAddress', generateEmail(firstName, lastName))
          .click('@contactSameAddressNo')
          .setValue('@ukPostcode', 'EC2Y 9AE')
          .click('@findUkAddressButton')
          .click('@selectUkAddressDropdown')
          .waitForElementPresent('@selectAnUkAddressFromList', 5000)
          .click('@selectAnUkAddressFromList')
          .setValue('@contactAlternatePhonenumber', '666555444')
          .setValue('@contactAlternativeEmail', generateEmail(firstName, lastName, true))
          .setValue('@contactNotes', `${faker.name.jobDescriptor() + firstName}`)
          .submitForm('form')
      },
    },
  ],
}
