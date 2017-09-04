module.exports = {
  url: process.env.QA_HOST,
  elements: {
    companyTab: 'a[href*="/search/companies"]',
    companyNameFromFirstList: '.c-entity-list li:first-child span',
    sectorFromFirstList: 'a',
    regionFromFirstList: 'a',
  },

  commands: [
    {
      clickOnCompanyTab () {
        return this
          .click('@companyTab')
      },
    },
  ],
}
