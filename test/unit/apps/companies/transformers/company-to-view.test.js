const { assign } = require('lodash')
const datahubOnlyCompany = require('~/test/unit/data/companies/datahub-only-company.json')
const minimalCompany = require('~/test/unit/data/companies/minimal-company.json')
const companiesHouseCompany = require('~/test/unit/data/companies/companies-house-company.json')

const transformCompanyToView = require('~/src/apps/companies/transformers/company-to-view')

describe('transformCompanyToView', () => {
  context('when called with a fully populated datahub only company', () => {
    beforeEach(() => {
      this.viewRecord = transformCompanyToView(datahubOnlyCompany)
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
      expect(this.viewRecord['Primary address']).to.equal('5TH FLOOR, PROFILE WEST, 950 GREAT WEST ROAD, BRENTFORD, MIDDLESEX, TW8 9ES, United Kingdom')
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
      this.viewRecord = transformCompanyToView(minimalCompany)
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
      expect(this.viewRecord['Primary address']).to.equal('5TH FLOOR, PROFILE WEST, BRENTFORD, MIDDLESEX, TW8 9ES, United Kingdom')
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
      this.viewRecord = transformCompanyToView(companiesHouseCompany)
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

      this.viewRecord = transformCompanyToView(foreignCompany)
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
      expect(this.viewRecord['Primary address']).to.equal('5TH FLOOR, PROFILE WEST, BRENTFORD, MIDDLESEX, TW8 9ES, France')
    })

    it('should supply the country', () => {
      expect(this.viewRecord['Country']).to.equal('France')
    })

    it('should supply sector', () => {
      expect(this.viewRecord['Sector']).to.equal('Aerospace')
    })
  })
})
