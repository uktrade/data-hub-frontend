const faker = require('faker')
const { assign } = require('lodash')

const {
  getSelectorForElementWithText,
  getButtonWithText,
  getDetailsTableRowValue,
  getMetaListItemValueSelector,
} = require('../../../helpers/selectors')
const { appendUid } = require('../../../helpers/uuid')

const getCheckBoxLabel = (text) => getSelectorForElementWithText(
  text,
  {
    el: '//span',
    className: 'c-multiple-choice__label-text',
  }
)

module.exports = {
  url: process.env.QA_HOST,
  props: {},
  elements: {
    saveButton: getButtonWithText('Save'),
    addInteractionButton: getButtonWithText('Add interaction'),
    contactsTab: 'a[href*="/contacts"][href*="/companies"]',
    firstCompanyFromList: '.c-entity-list li:first-child h3 a',
    firstName: '#field-first_name',
    firstNameError: 'label[for=field-first_name] span:nth-child(2)',
    lastName: '#field-last_name',
    lastNameError: 'label[for=field-last_name] span:nth-child(2)',
    jobTitle: '#field-job_title',
    primaryContactYes: '[for="field-primary-1"]',
    primaryContactNo: '[for="field-primary-2"]',
    primaryContactError: '#group-field-primary legend span:nth-child(2)',
    telephoneCountryCode: '#field-telephone_countrycode',
    telephoneCountryCodeError: 'label[for=field-telephone_countrycode] span:nth-child(2)',
    telephoneNumber: '#field-telephone_number',
    telephoneNumberError: 'label[for=field-telephone_number] span:nth-child(2)',
    emailAddress: '#field-email',
    emailAddressError: 'label[for=field-email] span:nth-child(2)',
    acceptsEmailMarketingFromDit: getCheckBoxLabel('Accepts email marketing from DIT'),
    sameAddressAsCompanyYes: '[for="field-address_same_as_company-1"]',
    sameAddressAsCompanyNo: '[for="field-address_same_as_company-2"]',
    alternativePhoneNumber: '#field-telephone_alternative',
    alternativeEmail: '#field-email_alternative',
    notes: '#field-notes',
    headingCompanyLink: '.c-local-header__heading-before a', // TODO move this work to Location feature
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

      createNewContact (details = {}, isPrimary, callback) {
        const firstName = faker.name.firstName()
        const lastName = appendUid(faker.name.lastName())

        const contact = assign({}, {
          firstName,
          lastName,
          jobTitle: faker.name.jobTitle(),
          telephoneCountryCode: faker.random.number(),
          telephoneNumber: faker.phone.phoneNumberFormat(),
          emailAddress: faker.internet.email(firstName, lastName),
          alternativePhoneNumber: '666555444',
          alternativeEmail: faker.internet.email(lastName, firstName),
          notes: `${faker.name.jobDescriptor() + firstName}`,
        }, details)

        return this
          .waitForElementPresent('@primaryContactYes')
          .api.perform((done) => {
            this.click(`@primaryContact${isPrimary ? 'Yes' : 'No'}`)

            for (const key in contact) {
              if (contact[key]) {
                this.setValue(`@${key}`, contact[key])
              }
            }

            contact.heading = `${contact.firstName} ${contact.lastName}`

            done()
          })
          .perform((done) => {
            contact.acceptsEmailMarketingFromDit = 'Yes'
            this
              .click('@acceptsEmailMarketingFromDit')
              .click('@sameAddressAsCompanyYes')

            callback(contact)
            done()
          })
      },

      createNewPrimaryContactWithNewCompanyAddress (details = {}, callback) {
        const firstName = faker.name.firstName()
        const lastName = appendUid(faker.name.lastName())
        const contact = assign({}, {
          firstName,
          lastName,
          jobTitle: faker.name.jobTitle(),
          telephoneCountryCode: faker.random.number(),
          telephoneNumber: faker.phone.phoneNumberFormat(),
          emailAddress: faker.internet.email(firstName, lastName),
          alternativePhoneNumber: '666555444',
          alternativeEmail: faker.internet.email(lastName, firstName),
          notes: `${faker.name.jobDescriptor() + firstName}`,
        }, details)
        const postcodeLookup = {
          address1: 'postCodeLookupAddress1',
          address2: 'postCodeLookupAddress2',
          town: 'postCodeLookupTown',
          county: 'postCodeLookupCounty',
          country: 'postCodeLookupCountry',
          postcode: 'postCode',
        }

        this.api.page.Location().section.localHeader
          .waitForElementPresent('@header')

        // setup form to use the postCode lookup functionality
        this
          .click('@primaryContactYes')
          .click('@sameAddressAsCompanyNo')
          .api.perform((done) => {
            for (const key in contact) {
              if (contact[key]) {
                this.setValue(`@${key}`, contact[key])
              }
            }
            done()
          })

        return this.api
          .perform((done) => {
            this.api
              .page.Address()
              .getAddressInputValues('EC2Y 9AE', postcodeLookup, '@postCodeLookupSuggestions', (addressInputValues) => {
                callback(assign(
                  {},
                  {
                    acceptsEmailMarketingFromDit: 'No',
                    type: 'Primary',
                  },
                  addressInputValues,
                  contact
                ))
                done()
              })
          })
      },
    },
  ],
  sections: {
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
    contactDetails: {
      selector: '.table--key-value',
      elements: {
        jobTitle: getDetailsTableRowValue('Job title'),
        phoneNumber: getDetailsTableRowValue('Phone number'),
        email: getDetailsTableRowValue('Email'),
        emailMarketing: getDetailsTableRowValue('Email marketing'),
        address: getDetailsTableRowValue('Address'),
        alternativeTelephone: getDetailsTableRowValue('Alternative telephone'),
        alternativeEmail: getDetailsTableRowValue('Alternative email'),
        notes: getDetailsTableRowValue('Notes'),
      },
    },
  },
}
