const faker = require('faker')
const { merge } = require('lodash')

const { getButtonWithText } = require('../../../helpers/selectors')

module.exports = {
  url: process.env.QA_HOST,
  elements: {
    editContactDetailsButton: getButtonWithText('Edit contact details'),
    saveButton: getButtonWithText('Save'),
    auditHistoryTab: 'a[href*="/audit"]',
    telephone: '#field-telephone_number',
    telephoneCountryCode: '#field-telephone_countrycode',
    archiveReason: 'label[for=field-archived_reason-1]',
    unarchiveAnContactButton: 'a[href*="/unarchive"]',
    userName: 'a[href*="/profile"]',
  },

  commands: [
    {
      editContactDetails (details = {}, number, callback) {
        const contact = merge({}, {
          countryCode: faker.random.number(),
          telephone: faker.phone.phoneNumber(),
        }, details)

        this
          .waitForElementVisible('@editContactDetailsButton')
          .click('@editContactDetailsButton')

        if (number > 1) {
          this
            .waitForElementVisible('@telephoneCountryCode')
            .clearValue('@telephoneCountryCode')
            .setValue('@telephoneCountryCode', contact.countryCode)
        }

        this
          .waitForElementVisible('@telephone')
          .clearValue('@telephone')
          .setValue('@telephone', contact.telephone)

        this
          .click('@saveButton')

        callback(contact)

        return this
      },
    },
  ],
}
