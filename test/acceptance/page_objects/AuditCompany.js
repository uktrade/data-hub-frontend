module.exports = {
  url: process.env.QA_HOST,
  elements: {
    editCompanyDetailsButton: 'a[href*="/companies/edit"]',
    auditHistoryTab: 'a[href*="/audit"]',
    description: '#description',
    website: '#website',
    flashInfo: '.c-messages__item--success',
  },

  commands: [
    {
      editCompany (description) {
        return this
          .click('@editCompanyDetailsButton')
          .clearValue('@description')
          .setValue('@description', description)
          .submitForm('form')
          .assert.containsText('@flashInfo', 'Company record updated')
      },

      editCompanyTwoRecords (description, website) {
        return this
          .click('@editCompanyDetailsButton')
          .clearValue('@description')
          .setValue('@description', description)
          .clearValue('@website')
          .setValue('@website', website)
          .submitForm('form')
          .assert.containsText('@flashInfo', 'Company record updated')
      },
    },
  ],
}
