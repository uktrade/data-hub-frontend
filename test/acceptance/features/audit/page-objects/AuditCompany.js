module.exports = {
  url: process.env.QA_HOST,
  elements: {
    editCompanyDetailsButton: 'a[href*="/companies"][href*="/edit"]',
    description: '#field-description',
    website: '#field-website',
  },

  commands: [
    {
      editCompanyRecords (description, website, number) {
        this
          .waitForElementVisible('@editCompanyDetailsButton')
          .click('@editCompanyDetailsButton')

        if (number > 1) {
          this
            .waitForElementVisible('@website')
            .clearValue('@website')
            .setValue('@website', website)
        }

        this
          .waitForElementVisible('@description')
          .clearValue('@description')
          .setValue('@description', description)

        return this
      },
    },
  ],
}
