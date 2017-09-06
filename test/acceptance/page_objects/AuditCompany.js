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
      editCompanyRecords (description, website, number) {
        this.click('@editCompanyDetailsButton')
        this.clearValue('@description')
        this.setValue('@description', description)
        if (number > 1) {
          this.clearValue('@website')
          this.setValue('@website', website)
        }
        this.submitForm('form')
        this.assert.containsText('@flashInfo', 'Company record updated')
        return this
      },
    },
  ],
}
