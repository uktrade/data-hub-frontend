module.exports = {
  url: process.env.QA_HOST,
  elements: {
    editContactDetailsButton: 'a[href*="/edit"]',
    auditHistoryTab: 'a[href*="/audit"]',
    telephone: '#field-telephone_number',
    telephoneCountryCode: '#field-telephone_countrycode',
    archiveReason: 'label[for=field-archived_reason-1]',
    unarchiveAnContactButton: 'a[href*="/unarchive"]',
    userName: 'a[href*="/profile"]',
  },

  commands: [
    {
      editContactDetails (telephone, countryCode, number) {
        this
          .click('@editContactDetailsButton')
          .waitForElementVisible('@telephoneCountryCode')
          .waitForElementVisible('@telephone')

        if (number > 1) {
          this
            .clearValue('@telephoneCountryCode')
            .setValue('@telephoneCountryCode', countryCode)
        }

        this
          .clearValue('@telephone')
          .setValue('@telephone', telephone)

        return this
      },
    },
  ],
}
