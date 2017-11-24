const { assign } = require('lodash')

const minimalCompany = require('~/test/unit/data/companies/minimal-company.json')
const { transformCompanyToExportDetailsView } = require('~/src/apps/companies/transformers')

describe('transformCompanyToExportDetailsView', () => {
  context('when the company is exporting to one country', () => {
    beforeEach(() => {
      const company = assign({}, minimalCompany, {
        export_to_countries: [{
          id: '1234',
          name: 'France',
        }],
        future_interest_countries: [{
          id: '4321',
          name: 'Germany',
        }],
      })

      this.viewRecord = transformCompanyToExportDetailsView(company)
    })

    it('Should show the country currently exporting to', () => {
      expect(this.viewRecord).to.have.property('Currently exporting to', 'France')
    })
  })

  context('when the company is exporting to multiple countries', () => {
    beforeEach(() => {
      const company = assign({}, minimalCompany, {
        export_to_countries: [{
          id: '1234',
          name: 'France',
        }, {
          id: '5511',
          name: 'Spain',
        }],
        future_interest_countries: [{
          id: '4321',
          name: 'Germany',
        }],
      })

      this.viewRecord = transformCompanyToExportDetailsView(company)
    })

    it('Should show the countries currently exporting to', () => {
      expect(this.viewRecord).to.have.property('Currently exporting to', 'France, Spain')
    })
  })

  context('when the company wants to export to one country', () => {
    beforeEach(() => {
      const company = assign({}, minimalCompany, {
        export_to_countries: [{
          id: '1234',
          name: 'France',
        }],
        future_interest_countries: [{
          id: '4321',
          name: 'Germany',
        }],
      })

      this.viewRecord = transformCompanyToExportDetailsView(company)
    })

    it('Should show the country the company wants to export to', () => {
      expect(this.viewRecord).to.have.property('Future countries of interest', 'Germany')
    })
  })

  context('when the company wants to export to multiple countries', () => {
    beforeEach(() => {
      const company = assign({}, minimalCompany, {
        export_to_countries: [{
          id: '1234',
          name: 'France',
        }],
        future_interest_countries: [{
          id: '4321',
          name: 'Germany',
        }, {
          id: '4123',
          name: 'Sweden',
        }],
      })

      this.viewRecord = transformCompanyToExportDetailsView(company)
    })

    it('Should show the coiuntries the company wants to export to', () => {
      expect(this.viewRecord).to.have.property('Future countries of interest', 'Germany, Sweden')
    })
  })
})
