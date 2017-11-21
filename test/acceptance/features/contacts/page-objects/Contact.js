const faker = require('faker')
const { assign, forEach, set, pick } = require('lodash')

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

const getCheckBoxLabel = (text) => getSelectorForElementWithText(
  text,
  {
    el: '//span',
    className: 'c-multiple-choice__label-text',
  }
)

const getTableRowValue = (text) => getSelectorForElementWithText(
  text,
  {
    el: '//th',
    child: '/following-sibling::td',
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
    noContactWarning: '#no-contact-warning',
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
    contactUnderSearchPage: '#contacts-list li:first-child',
    contactFullname: '#contact-list .c-entity-list li:first-child .c-entity__title > a',
    ukPostcode: '#field-postcode-lookup',
    postCodeLookupButton: getButtonWithText('Find UK address'),
    postCodeLookupSuggestions: '#field-postcode-address-suggestions',
    postCodeLookupAddress1: '#field-address_1',
    postCodeLookupAddress2: '#field-address_2',
    postCodeLookupTown: '#field-address_town',
    postCodeLookupCounty: '#field-address_county',
    postCodeLookupCountry: '#field-address_country',
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
          emailAddress: generateEmail(firstName, lastName),
          alternativePhoneNumber: '666555444',
          alternativeEmail: generateEmail(firstName, lastName, true),
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
          emailAddress: generateEmail(firstName, lastName),
          alternativePhoneNumber: '666555444',
          alternativeEmail: generateEmail(firstName, lastName, true),
          notes: `${faker.name.jobDescriptor() + firstName}`,
          ukPostcode: 'EC2Y 9AE',
        }, details)
        const postCodeLookupDetails = {
          address1: 'postCodeLookupAddress1',
          address2: 'postCodeLookupAddress2',
          town: 'postCodeLookupTown',
          county: 'postCodeLookupCounty',
          country: 'postCodeLookupCountry',
        }
        let contactWithPostCodeDetails

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

        return this
          .click('@postCodeLookupButton')
          .wait() // wait for xhr to come back for postcode lookup
          .api.perform((done) => {
            this.getListOption('@postCodeLookupSuggestions', (addressOption) => {
              this.setValue('@postCodeLookupSuggestions', addressOption)
              done()
            })
          })
          .perform((done) => {
            const promises = []
            // record information that has come from postcode lookup
            // select elements
            forEach(pick(postCodeLookupDetails, ['country']), (value, key) => {
              promises.push(new Promise((resolve) => {
                this.getListOption(`@${value}`, (optionText) => {
                  set(postCodeLookupDetails, key, optionText)
                  resolve()
                })
              }))
            })
            // text inputs
            forEach(pick(postCodeLookupDetails, ['address1', 'address2', 'county', 'town']), (value, key) => {
              promises.push(new Promise((resolve) => {
                this.getValue(`@${value}`, (textInput) => {
                  set(postCodeLookupDetails, key, textInput.value.trim())
                  resolve()
                })
              }))
            })

            Promise.all(promises)
              .then(() => {
                contactWithPostCodeDetails = assign({}, contact, postCodeLookupDetails)
              })
              .then(() => {
                callback(contactWithPostCodeDetails)
                done()
              })
          })
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
    contactDetails: {
      selector: '.table--key-value',
      elements: {
        jobTitle: getTableRowValue('Job title'),
        phoneNumber: getTableRowValue('Phone number'),
        email: getTableRowValue('Email'),
        emailMarketing: getTableRowValue('Email marketing'),
        address: getTableRowValue('Address'),
        alternativeTelephone: getTableRowValue('Alternative telephone'),
        alternativeEmail: getTableRowValue('Alternative email'),
        notes: getTableRowValue('Notes'),
      },
    },
  },
}
