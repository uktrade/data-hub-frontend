const { find } = require('lodash')

const { company } = require('../../fixtures')

module.exports = {
  url: function companyFixtureUrl(companyName) {
    const fixture = find(company, { name: companyName })
    const companyId = fixture ? fixture.id : company.ukLtd.id

    return `${process.env.QA_HOST}/companies/${companyId}/exports`
  },
  elements: {
    exportWinCategoryField: '#field-export_experience_category',
  },
  commands: [
    {
      updateExports(done) {
        this.getListOption('@exportWinCategoryField', (option) => {
          this.setValue('@exportWinCategoryField', option, () => {
            done({ exportWinCategory: option })
          })
        })
      },
    },
  ],
}
