const faker = require('faker')
const { assign } = require('lodash')

const {
  getSelectorForElementWithText,
  getKeyValueTableRowValueCell,
  getMetaListItemValueSelector,
} = require('../../helpers/selectors')
const { appendUid, getUid } = require('../../helpers/uuid')
const { getAddress } = require('../../helpers/address')

const getCheckBoxLabel = (text) =>
  getSelectorForElementWithText(text, {
    el: '//span',
    className: 'c-multiple-choice__label-text',
  })

module.exports = {
  url: process.env.QA_HOST,
  props: {},
  elements: {
    firstCompanyFromList: '.c-entity-list li:first-child h3 a',
    firstName: '#field-first_name',
    firstNameError: 'label[for=field-first_name] span:nth-child(2)',
    lastName: '#field-last_name',
    lastNameError: 'label[for=field-last_name] span:nth-child(2)',
    jobTitle: '#field-job_title',
    primaryContactYes: '[for="field-primary-1"]',
    primaryContactNo: '[for="field-primary-2"]',
    primaryContactError: '#group-field-primary > .c-form-group__error-message',
    telephoneCountryCode: '#field-telephone_countrycode',
    telephoneCountryCodeError:
      'label[for=field-telephone_countrycode] span:nth-child(2)',
    telephoneNumber: '#field-telephone_number',
    emailAddress: '#field-email',
    emailAddressError: 'label[for=field-email] span:nth-child(2)',
    acceptsEmailMarketingFromDit: getCheckBoxLabel(
      'Does not accept email marketing'
    ),
    sameAddressAsCompanyYes: '[for="field-address_same_as_company-1"]',
    sameAddressAsCompanyNo: '[for="field-address_same_as_company-2"]',
    alternativePhoneNumber: '#field-telephone_alternative',
    alternativeEmail: '#field-email_alternative',
    notes: '#field-notes',
  },

  commands: [
    {
      clickOnFirstCompanyFromList() {
        return this.click('@firstCompanyFromList')
      },

      createNewContact(details = {}, isPrimary, callback) {
        const firstName = faker.name.firstName()
        const lastName = appendUid(faker.name.lastName())

        const contact = assign(
          {},
          {
            firstName,
            lastName,
            jobTitle: faker.name.jobTitle(),
            telephoneCountryCode: faker.random.number(),
            telephoneNumber: faker.phone.phoneNumberFormat(),
            emailAddress: faker.internet.email(firstName, lastName),
            alternativePhoneNumber: '666555444',
            alternativeEmail: faker.internet.email(lastName, firstName),
            notes: `${faker.name.jobDescriptor() + firstName}`,
          },
          details
        )

        return this.waitForElementPresent('@primaryContactYes')
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
          .perform(() => {
            this.click('@sameAddressAsCompanyYes')

            callback(
              assign({}, contact, {
                acceptsEmailMarketingFromDit: 'Can be marketed to',
                primaryPhoneNumber: `(${contact.telephoneCountryCode}) ${contact.telephoneNumber}`,
                uniqueSearchTerm: getUid(contact.lastName),
              })
            )
          })
      },

      createNewPrimaryContactWithNewCompanyAddress(details = {}, callback) {
        const firstName = faker.name.firstName()
        const lastName = appendUid(faker.name.lastName())
        const contact = assign(
          {},
          {
            firstName,
            lastName,
            jobTitle: faker.name.jobTitle(),
            telephoneCountryCode: faker.random.number(),
            telephoneNumber: faker.phone.phoneNumberFormat(),
            emailAddress: faker.internet.email(firstName, lastName),
            alternativePhoneNumber: '666555444',
            alternativeEmail: faker.internet.email(lastName, firstName),
            notes: `${faker.name.jobDescriptor() + firstName}`,
          },
          details
        )
        const postcodeLookup = {
          address1: 'postCodeLookupAddress1',
          address2: 'postCodeLookupAddress2',
          town: 'postCodeLookupTown',
          county: 'postCodeLookupCounty',
          country: 'postCodeLookupCountry',
          postcode: 'postCode',
        }

        this.api.page
          .location()
          .section.localHeader.waitForElementPresent('@header')

        // setup form to use the postCode lookup functionality
        this.click('@primaryContactYes')
          .click('@sameAddressAsCompanyNo')
          .api.perform((done) => {
            for (const key in contact) {
              if (contact[key]) {
                this.setValue(`@${key}`, contact[key])
              }
            }
            done()
          })

        return this.api.perform((done) => {
          this.api.page
            .address()
            .getAddressInputValues(
              'EC2Y 9AE',
              postcodeLookup,
              '@postCodeLookupSuggestions',
              (addressInputValues) => {
                callback(
                  assign(
                    {},
                    {
                      acceptsEmailMarketingFromDit: 'Can be marketed to',
                      type: 'Primary',
                      primaryPhoneNumber: `(${contact.telephoneCountryCode}) ${contact.telephoneNumber}`,
                      address: getAddress(addressInputValues),
                      uniqueSearchTerm: getUid(contact.lastName),
                    },
                    addressInputValues,
                    contact
                  )
                )
                done()
              }
            )
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
      },
    },
    contactDetails: {
      selector: '.table--key-value',
      elements: {
        jobTitle: getKeyValueTableRowValueCell('Job title'),
        phoneNumber: getKeyValueTableRowValueCell('Phone number'),
        email: getKeyValueTableRowValueCell('Email'),
        emailMarketing: getKeyValueTableRowValueCell('Email marketing'),
        address: getKeyValueTableRowValueCell('Address'),
        alternativeTelephone: getKeyValueTableRowValueCell(
          'Alternative telephone'
        ),
        alternativeEmail: getKeyValueTableRowValueCell('Alternative email'),
        notes: getKeyValueTableRowValueCell('Notes'),
      },
    },
  },
}
