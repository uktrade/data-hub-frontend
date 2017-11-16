const { some } = require('lodash')
const companiesHouseSearchResults = require('~/test/unit/data/companies/companiesHouseSearch.json')

const {
  transformCompanyToListItem,
  transformCompaniesHouseCompanyToListItem,
} = require('~/src/apps/companies/transformers')

describe('Company transformers', function () {
  describe('#transformCompanyToListItem', () => {
    const companyData = require('~/test/unit/data/company')

    it('should return undefined if there is no companies house data or datahub data', () => {
      expect(transformCompanyToListItem()).to.be.undefined
      expect(transformCompanyToListItem({ a: 'b' })).to.be.undefined
      expect(transformCompanyToListItem({ first_name: 'Peter', last_name: 'Great' })).to.be.undefined
    })

    it('should return undefined if companies house is incomplete', () => {
      expect(transformCompanyToListItem({ companies_house_data: {} })).to.be.undefined
    })

    it('should return an object with data for company list item', () => {
      const actual = transformCompanyToListItem(companyData)

      expect(actual).to.have.property('id').to.be.a('string')
      expect(actual).to.have.property('type').to.equal('company')
      expect(actual).to.have.property('name').to.be.a('string')
      expect(actual).to.have.property('url').to.be.equal(`/companies/${companyData.id}`)
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
        id: null,
        companies_house_data: {
          company_number: 10203040,
        },
      }))

      expect(actual).to.have.property('url', '/companies/view/ch/10203040')
    })

    it('should return correct URL for company with both datahub and companies house data', () => {
      const actual = transformCompanyToListItem(Object.assign({}, companyData, {
        companies_house_data: {
          company_number: 10203040,
        },
      }))

      expect(actual).to.have.property('url').to.be.equal(`/companies/${companyData.id}`)
    })
  })

  describe('#transformCompaniesHouseCompanyTolistItem', () => {
    beforeEach(() => {
      this.transformed = transformCompaniesHouseCompanyToListItem(companiesHouseSearchResults.results[0])
    })

    it('should include the company number as an id', () => {
      expect(this.transformed.id).to.equal('01234567896')
    })

    it('should format the company name', () => {
      expect(this.transformed.name).to.equal('Fred consultants limited')
    })

    it('should include the company status as a badge', () => {
      expect(this.transformed.meta[0]).to.deep.equal({
        label: 'Status',
        value: 'Active',
        type: 'badge',
      })
    })

    it('should include the company number as meta data', () => {
      expect(this.transformed.meta[1]).to.deep.equal({
        label: 'Company number',
        value: '01234567896',
      })
    })

    it('should include the type of company as meta data', () => {
      expect(this.transformed.meta[2]).to.deep.equal({
        label: 'Type',
        value: 'Private Limited Company',
      })
    })

    it('should join sic codes and return as meta data', () => {
      expect(this.transformed.meta[3]).to.deep.equal({
        label: 'Nature of business (SIC)',
        value: '62020 - Information technology consultancy activities, 9999 - Animal trainer',
      })
    })

    it('should include the incorporation date', () => {
      expect(this.transformed.meta[4]).to.deep.equal({
        label: 'Incorporated on',
        type: 'date',
        value: '2002-01-07',
      })
    })

    it('should format the address and return as meta data', () => {
      expect(this.transformed.meta[5]).to.deep.equal({
        label: 'Address',
        value: 'Fred Cottage Smith Lane, Winkfield, Windsor, Berkshire, SL9 9RE, United Kingdom',
      })
    })
  })
})
