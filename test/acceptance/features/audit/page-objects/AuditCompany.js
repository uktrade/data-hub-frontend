module.exports = {
  url: process.env.QA_HOST,
  elements: {
    editCompanyDetailsButton: 'a[href*="/companies"][href*="/edit"]',
    auditHistoryTab: 'a[href*="/audit"]',
    description: '#field-description',
    website: '#field-website',
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
        return this
      },
    },
  ],
}
