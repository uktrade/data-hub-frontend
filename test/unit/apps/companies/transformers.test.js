const { some, assign } = require('lodash')
const companiesHouseSearchResults = require('~/test/unit/data/companies/companies-house-search.json')
const datahubOnlyCompany = require('~/test/unit/data/companies/datahub-only-company.json')
const minimalCompany = require('~/test/unit/data/companies/minimal-company.json')
const companiesHouseCompany = require('~/test/unit/data/companies/companies-house-company.json')

const {
  transformCompanyToListItem,
  transformCompaniesHouseCompanyToListItem,
  transformCompanyResponseToViewRecord,
  transformCompaniesHouseResponseToViewRecord,
  transformCompanyResponseToOneListViewRecord,
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

  describe('#transformCompanyResponseToViewRecord', () => {
    context('when called with a fully populated datahub only company', () => {
      beforeEach(() => {
        this.viewRecord = transformCompanyResponseToViewRecord(datahubOnlyCompany)
      })

      it('should contain just the fields expected', () => {
        expect(this.viewRecord).to.have.ordered.keys([
          'Business type',
          'Primary address',
          'Trading name',
          'Trading address',
          'UK region',
          'Headquarters',
          'Sector',
          'Website',
          'Business description',
          'Account manager',
          'VAT number',
          'CDMS reference',
        ])
      })

      it('should supply the business type', () => {
        expect(this.viewRecord['Business type']).to.equal('Private limited company')
      })

      it('should supply the primary address', () => {
        expect(this.viewRecord['Primary address']).to.equal('5th Floor, Profile West, 950 Great West Road, Brentford, Middlesex, TW8 9ES, United Kingdom')
      })

      it('should supply the trading name', () => {
        expect(this.viewRecord['Trading name']).to.equal('Fred')
      })

      it('should supply the trading address', () => {
        expect(this.viewRecord['Trading address']).to.equal('Business Innovation & Skills, 1 Victoria Street, London, Greater London, SW1H 0ET, United Kingdom')
      })

      it('should supply the uk region', () => {
        expect(this.viewRecord['UK region']).to.equal('North East')
      })

      it('should supply the headquarters', () => {
        expect(this.viewRecord['Headquarters']).to.equal('European headquarters (EHQ)')
      })

      it('should supply sector', () => {
        expect(this.viewRecord['Sector']).to.equal('Aerospace')
      })

      it('should convert website to link', () => {
        expect(this.viewRecord['Website']).to.deep.equal({
          name: 'http://www.test.com',
          url: 'http://www.test.com',
        })
      })

      it('should supply description', () => {
        expect(this.viewRecord['Business description']).to.equal('description')
      })

      it('should supply account manager', () => {
        expect(this.viewRecord['Account manager']).to.equal('Yvonne Ahern')
      })

      it('should supply vat number', () => {
        expect(this.viewRecord['VAT number']).to.equal('123412341234')
      })

      it('should supply the CDMS reference', () => {
        expect(this.viewRecord['CDMS reference']).to.equal('ORG-12345678')
      })
    })

    context('when called with a minimally populated company', () => {
      beforeEach(() => {
        this.viewRecord = transformCompanyResponseToViewRecord(minimalCompany)
      })

      it('should contain just the fields expected', () => {
        expect(this.viewRecord).to.have.ordered.keys([
          'Primary address',
          'UK region',
          'Sector',
          'Headquarters',
        ])
      })

      it('should supply the primary address', () => {
        expect(this.viewRecord['Primary address']).to.equal('5th Floor, Profile West, Brentford, Middlesex, TW8 9ES, United Kingdom')
      })

      it('should supply the uk region', () => {
        expect(this.viewRecord['UK region']).to.equal('North East')
      })

      it('should supply sector', () => {
        expect(this.viewRecord['Sector']).to.equal('Aerospace')
      })
    })

    context('called with a datahub company with companies house data', () => {
      beforeEach(() => {
        this.viewRecord = transformCompanyResponseToViewRecord(companiesHouseCompany)
      })

      it('should not include the business type', () => {
        expect(this.viewRecord).to.have.ordered.keys([
          'Primary address',
          'Trading name',
          'Trading address',
          'UK region',
          'Headquarters',
          'Sector',
          'Website',
          'Business description',
          'Account manager',
          'VAT number',
          'CDMS reference',
        ])
      })
    })

    context('has a foreign datahub company', () => {
      beforeEach(() => {
        const foreignCompany = assign({}, minimalCompany, {
          uk_based: false,
          registered_address_country: {
            id: '1234',
            name: 'France',
          },
          uk_region: null,
        })

        this.viewRecord = transformCompanyResponseToViewRecord(foreignCompany)
      })

      it('should contain just the fields expected', () => {
        expect(this.viewRecord).to.have.ordered.keys([
          'Primary address',
          'Country',
          'Sector',
          'Headquarters',
        ])
      })

      it('should supply the primary address', () => {
        expect(this.viewRecord['Primary address']).to.equal('5th Floor, Profile West, Brentford, Middlesex, TW8 9ES, France')
      })

      it('should supply the country', () => {
        expect(this.viewRecord['Country']).to.equal('France')
      })

      it('should supply sector', () => {
        expect(this.viewRecord['Sector']).to.equal('Aerospace')
      })
    })
  })

  describe('#transformCompaniesHouseResponseToViewRecord', () => {
    context('when companies data is provided', () => {
      beforeEach(() => {
        this.viewRecord = transformCompaniesHouseResponseToViewRecord(companiesHouseCompany.companies_house_data)
      })

      it('should return the fields expected in the correct order', () => {
        expect(this.viewRecord).to.have.ordered.keys([
          'Registered name',
          'Companies House No',
          'Company type',
          'Company status',
          'Registered office address',
          'Incorporated on',
          'Nature of business (SIC)',
        ])
      })

      it('should return the name', () => {
        expect(this.viewRecord).to.have.property('Registered name', 'Samsung Bioepis Uk Limited')
      })

      it('should return the company number', () => {
        expect(this.viewRecord).to.have.property('Companies House No', '08840722')
      })

      it('should return the business type', () => {
        expect(this.viewRecord).to.have.property('Company type', 'Private Limited Company')
      })

      it('should return the company status', () => {
        expect(this.viewRecord).to.have.property('Company status', 'Active')
      })

      it('should return the registered address', () => {
        expect(this.viewRecord).to.have.property('Registered office address', '5th Floor, Profile West, 950 Great West Road, Brentford, Middlesex, TW8 9ES, United Kingdom')
      })

      it('should return the incorporation date', () => {
        expect(this.viewRecord).to.have.property('Incorporated on', '10 January 2014')
      })

      it('should return the formatted SIC codes', () => {
        expect(this.viewRecord).to.have.property('Nature of business (SIC)', '82990 - Other business support service activities n.e.c., more stuff')
      })
    })
  })

  describe('#transformCompanyResponseToOneListViewRecord', () => {
    context('when there is one list information', () => {
      beforeEach(() => {
        const company = assign({}, minimalCompany, {
          one_list_account_owner: null,
          classification: null,
        })

        this.viewRecord = transformCompanyResponseToOneListViewRecord(company)
      })

      it('indicate there is no one list account management information', () => {
        expect(this.viewRecord).to.deep.equal({
          'One List account manager': 'None',
          'One List tier': 'None',
        })
      })
    })

    context('when there is no one list information', () => {
      beforeEach(() => {
        const company = assign({}, minimalCompany, {
          one_list_account_owner: {
            id: '1234',
            name: 'The owner',
          },
          classification: {
            id: '4321',
            name: 'The classification',
          },
        })

        this.viewRecord = transformCompanyResponseToOneListViewRecord(company)
      })

      it('indicate there is no one list account management information', () => {
        expect(this.viewRecord).to.deep.equal({
          'One List account manager': 'The owner',
          'One List tier': 'The classification',
        })
      })
    })
  })
})
