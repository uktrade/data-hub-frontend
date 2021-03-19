const { transformCompanyToForm } = require('../transformers')

const companyMock = require('../../../../../../test/unit/data/companies/company-v4')

describe('Company edit details transformer test', () => {
  describe('It correctly transforms the company segment details to the form', () => {
    it('has a duns number', () => {
      const company = {
        ...companyMock,
      }

      const actual = transformCompanyToForm(company)

      expect(actual.export_segment).to.equal('hep')
      expect(actual.export_sub_segment).to.equal('sustain_nurture_and_grow')
    })

    it('does not have a duns number', () => {
      const company = {
        ...companyMock,
        duns_number: '25565',
      }

      const actual = transformCompanyToForm(company)

      expect(actual.export_segment).to.equal('hep')
      expect(actual.export_sub_segment).to.equal('sustain_nurture_and_grow')
    })
  })
})
