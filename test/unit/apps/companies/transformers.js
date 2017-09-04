const { some } = require('lodash')

const { transformCompanyToListItem } = require('~/src/apps/companies/transformers')

describe('Company transformers', function () {
  describe('#transformCompanyToListItem', () => {
    const companyData = require('~/test/unit/data/company')

    it('should return undefined for unqualified result', () => {
      expect(transformCompanyToListItem()).to.be.undefined
      expect(transformCompanyToListItem({ a: 'b' })).to.be.undefined
      expect(transformCompanyToListItem({ id: 'abcd' })).to.be.undefined
      expect(transformCompanyToListItem({ first_name: 'Peter', last_name: 'Great' })).to.be.undefined
    })

    it('should return an object with data for company list item', () => {
      const actual = transformCompanyToListItem(companyData)

      expect(actual).to.have.property('id').to.be.a('string')
      expect(actual).to.have.property('type').to.equal('company')
      expect(actual).to.have.property('name').to.be.a('string')
      expect(actual).to.have.property('url').to.be.equal(`/viewcompanyresult/${companyData.id}`)
    })

    it('should return have correct meta items for Uk company', () => {
      const actual = transformCompanyToListItem(companyData)

      expect(actual).to.have.property('meta').an('array').to.have.length(4)
      expect(actual.meta[0]).to.have.property('label', 'Sector')
      expect(actual.meta[1]).to.have.property('label', 'Country')
      expect(actual.meta[2]).to.have.property('label', 'UK region')
      expect(actual.meta[3]).to.have.property('label', 'Registered address')
    })

    it('should return have correct meta items for non-UK company', () => {
      const actual = transformCompanyToListItem(Object.assign({}, companyData, {
        uk_based: false,
      }))

      expect(actual).to.have.property('meta').an('array').to.have.length(3)
      expect(some(actual.meta, { label: 'UK region' })).to.be.false
    })

    it('should return have correct meta items for company with trading address', () => {
      const actual = transformCompanyToListItem(Object.assign({}, companyData, {
        trading_address_postcode: 'W1C 2BA',
        trading_address_town: 'London',
        trading_address_1: '100 Bolton Road',
      }))

      expect(actual).to.have.property('meta').an('array').to.have.length(4)
      expect(some(actual.meta, { label: 'Registered address' })).to.be.false
      expect(some(actual.meta, { label: 'Trading address' })).to.be.true
    })

    it('should return correct URL for Companies House company', () => {
      const actual = transformCompanyToListItem(Object.assign({}, companyData, {
        companies_house_data: {
          company_number: 10203040,
        },
      }))

      expect(actual).to.have.property('url', '/companies/view/ch/10203040')
    })
  })
})
