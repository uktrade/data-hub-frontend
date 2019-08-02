const datahubOnlyCompany = require('test/unit/data/companies/datahub-only-company.json')

const transformCompanyToView = require('src/apps/companies/transformers/company-to-view')

describe('transformCompanyToView', () => {
  context('when called with a fully populated datahub only company', () => {
    beforeEach(() => {
      this.viewRecord = transformCompanyToView(datahubOnlyCompany)
    })

    it('should contain just the fields expected', () => {
      expect(this.viewRecord).to.have.ordered.keys([
        'Headquarter type',
        'Sector',
      ])
    })

    it('should supply the headquarters', () => {
      expect(this.viewRecord['Headquarter type']).to.equal('European HQ')
    })

    it('should supply sector', () => {
      expect(this.viewRecord.Sector).to.equal('Aerospace')
    })
  })
})
