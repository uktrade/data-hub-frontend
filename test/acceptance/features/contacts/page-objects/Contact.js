const faker = require('faker')
const { assign } = require('lodash')

const { getSelectorForElementWithText, getButtonWithText } = require('../../../helpers/selectors')
const { appendUid } = require('../../../helpers/uuid')

function generateEmail (firstName, lastName, isAlternative) {
  const suffix = '@example.com'
  let emailParts = [firstName, lastName]
  if (isAlternative) {
    return emailParts.reverse().join('.') + suffix
  }
  return emailParts.join('.') + suffix
}

const getDetailsTabSelector = (text) =>
  getSelectorForElementWithText(
    text,
    {
      el: '//a',
      className: 'c-local-nav__link',
    }
  )

const getMetaListItemValueSelector = (text) => getSelectorForElementWithText(
  text,
  {
    el: '//span',
    className: 'c-meta-list__item-label',
    child: '/following-sibling::span',
  }
)

module.exports = {
  url: process.env.QA_HOST,
  props: {},
  elements: {
    addContactButton: getButtonWithText('Add contact'),
    saveButton: getButtonWithText('Save'),
    addInteractionButton: getButtonWithText('Add interaction'),
    contactsTab: 'a[href*="/contacts"][href*="/companies"]',
    firstCompanyFromList: '.c-entity-list li:first-child h3 a',
    noContactWarning: '#no-contact-warning',
    firstName: '#field-first_name',
    lastName: '#field-last_name',
    jobTitle: '#field-job_title',
    primaryContactYes: '[for="field-primary-1"]',
    primaryContactNo: '[for="field-primary-2"]',
    telephoneCountryCode: '#field-telephone_countrycode',
    telephoneNumber: '#field-telephone_number',
    emailAddress: '#field-email',
    sameAddressYes: '[for="field-address_same_as_company-1"]',
    sameAddressNo: '[for="field-address_same_as_company-2"]',
    alternativePhoneNumber: '#field-telephone_alternative',
    alternativeEmail: '#field-email_alternative',
    notes: '#field-notes',
    contactUnderSearchPage: '#contacts-list li:first-child',
    contactFullname: '#contact-list .c-entity-list li:first-child .c-entity__title > a',
    ukPostcode: '#field-postcode-lookup',
    findUkAddressButton: '.postcode-lookup-button',
    selectUkAddressDropdown: '#field-postcode-address-suggestions',
    selectAnUkAddressFromList: '#field-postcode-address-suggestions option:nth-child(3)',
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

      createNewPrimaryContact ({ details = {}, callback }) {
        const firstName = faker.name.firstName()
        const lastName = appendUid(faker.name.lastName())

        const contact = assign({}, {
          firstName,
          lastName,
          jobTitle: faker.name.jobTitle(),
          telephoneCountryCode: faker.random.number(),
          telephoneNumber: faker.phone.phoneNumberFormat(),
          emailAddress: generateEmail(firstName, lastName),
          alternativePhoneNumber: '666555444',
          alternativeEmail: generateEmail(firstName, lastName, true),
          notes: `${faker.name.jobDescriptor() + firstName}`,
        }, details)

        this
          .click('@addContactButton')
          .api.perform((done) => {
            this.click('@primaryContactYes')
            this.click('@sameAddressYes')

            for (const key in contact) {
              if (contact[key]) {
                this.setValue(`@${key}`, contact[key])
              }
            }

            this
              .waitForElementPresent('@saveButton')
              .click('@saveButton')
            done()
          })

        callback(contact)
        return this
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
  sections: {
    detailsTabs: {
      selector: '.c-local-nav',
      elements: {
        details: getDetailsTabSelector('Details'),
        interactions: getDetailsTabSelector('Interactions'),
        auditHistory: getDetailsTabSelector('Audit history'),
      },
    },
    firstContactSearchResult: {
      selector: '.c-entity-list li:first-child',
      elements: {
        header: {
          selector: 'a',
        },
        company: getMetaListItemValueSelector('Company'),
        sector: getMetaListItemValueSelector('Sector'),
        updated: getMetaListItemValueSelector('Updated'),
      },
    },
  },
}
