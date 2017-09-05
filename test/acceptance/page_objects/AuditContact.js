module.exports = {
  url: process.env.QA_HOST,
  elements: {
    editContactDetailsButton: 'a[href*="/edit"]',
    auditHistoryTab: 'a[href*="/audit"]',
    telephone: '#field-telephone_number',
    telephoneCountryCode: '#field-telephone_countrycode',
    flashInfo: '.c-messages__item--success',
    advisorNameFromList: '.c-entity-list__item:nth-child(1) .c-entity__content span:nth-child(2)',
    createdDateFromFirstList: '.c-entity-list__item:nth-child(1) .c-entity__title',
    fieldNameFromList: '.c-entity-list__item:nth-child(1) .c-entity__content .c-meta-list__item:nth-child(2) span:nth-child(2)',
    changedItemsCount: '.c-entity-list__item:nth-child(1) .c-entity__badges span:nth-child(2)',
    lastContactFromList: '.c-entity-list li:last-child h3 a',
    archiveReason: 'label[for=field-archived_reason-1]',
    unarchiveAnContactButton: 'a[href*="/unarchive"]',
  },

  commands: [
    {
      editContactWithTelephone (telephone) {
        return this
          .click('@editContactDetailsButton')
          .clearValue('@telephone')
          .setValue('@telephone', telephone)
          .submitForm('form')
          .assert.containsText('@flashInfo', 'Contact record updated')
      },

      editContactWithTelephoneAndCountryCode (telephone, countryCode) {
        return this
          .click('@editContactDetailsButton')
          .clearValue('@telephoneCountryCode')
          .setValue('@telephoneCountryCode', countryCode)
          .clearValue('@telephone')
          .setValue('@telephone', telephone)
          .submitForm('form')
          .assert.containsText('@flashInfo', 'Contact record updated')
      },
    },
  ],
}
