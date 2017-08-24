module.exports = {
  url: process.env.QA_HOST,
  elements: {
    contactsTab: 'a[href*="/search/contacts"]',
    companyFromFirstList: '.c-entity-list li:first-child div:nth-child(2) div:nth-child(1) div:nth-child(1) span:nth-child(2)',
    countryFromFirstList: '.c-entity-list li:first-child div:nth-child(2) div:nth-child(1) div:nth-child(2) span:nth-child(2)',
    createdDateFromFirstList: '.c-entity-list li:first-child div:nth-child(2) div:nth-child(2) div:nth-child(1) span:nth-child(2)',
    modifiedDateFromFirstList: '.c-entity-list li:first-child div:nth-child(2) div:nth-child(2) div:nth-child(2) span:nth-child(2)',
  },

  commands: [
    {
      clickOnContactsTab () {
        return this
          .click('@contactsTab')
      },
    },
  ],
}
