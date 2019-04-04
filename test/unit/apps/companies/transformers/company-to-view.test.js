const datahubOnlyCompany = require('~/test/unit/data/companies/datahub-only-company.json')
const minimalCompany = require('~/test/unit/data/companies/minimal-company.json')

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
        'Trading names',
        'Trading address',
        'UK region',
        'Headquarter type',
        'Sector',
        'Website',
        'Business description',
        'VAT number',
        'CDMS reference',
        'Global HQ',
      ])
    })

    it('should supply the business type', () => {
      expect(this.viewRecord['Business type']).to.equal('Private limited company')
    })

    it('should supply the primary address', () => {
      expect(this.viewRecord['Primary address']).to.deep.equal({
        type: 'address',
        address: {
          line_1: '5TH FLOOR, PROFILE WEST',
          line_2: '950 GREAT WEST ROAD',
          town: 'BRENTFORD',
          county: 'MIDDLESEX',
          postcode: 'TW8 9ES',
          country: {
            id: '80756b9a-5d95-e211-a939-e4115bead28a',
            name: 'United Kingdom',
          },
        },
      })
    })

    it('should supply the trading name', () => {
      expect(this.viewRecord['Trading names'][0]).to.equal('Fred')
    })

    it('should supply the trading address', () => {
      expect(this.viewRecord['Primary address']).to.deep.equal({
        type: 'address',
        address: {
          line_1: '5TH FLOOR, PROFILE WEST',
          line_2: '950 GREAT WEST ROAD',
          town: 'BRENTFORD',
          county: 'MIDDLESEX',
          postcode: 'TW8 9ES',
          country: {
            id: '80756b9a-5d95-e211-a939-e4115bead28a',
            name: 'United Kingdom',
          },
        },
      })
    })

    it('should supply the uk region', () => {
      expect(this.viewRecord['UK region']).to.equal('North East')
    })

    it('should supply the headquarters', () => {
      expect(this.viewRecord['Headquarter type']).to.equal('European HQ')
    })

    it('should supply sector', () => {
      expect(this.viewRecord.Sector).to.equal('Aerospace')
    })

    it('should convert website to link', () => {
      expect(this.viewRecord.Website).to.deep.equal({
        name: 'http://www.test.com',
        url: 'http://www.test.com',
      })
    })

    it('should supply description', () => {
      expect(this.viewRecord['Business description']).to.equal('description')
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
        'Headquarter type',
        'Global HQ',
      ])
    })

    it('should supply the primary address', () => {
      expect(this.viewRecord['Primary address']).to.deep.equal({
        type: 'address',
        address: {
          line_1: '5TH FLOOR, PROFILE WEST',
          line_2: '',
          town: 'BRENTFORD',
          county: 'MIDDLESEX',
          postcode: 'TW8 9ES',
          country: {
            id: '80756b9a-5d95-e211-a939-e4115bead28a',
            name: 'United Kingdom',
          },
        },
      })
    })

    it('should supply the uk region', () => {
      expect(this.viewRecord['UK region']).to.equal('North East')
    })

    it('should supply sector', () => {
      expect(this.viewRecord.Sector).to.equal('Aerospace')
    })
  })

  context('has a foreign datahub company', () => {
    beforeEach(() => {
      const foreignCompany = {
        ...minimalCompany,
        uk_based: false,
        registered_address_country: {
          id: '1234',
          name: 'France',
        },
        uk_region: null,
      }

      this.viewRecord = transformCompanyToView(foreignCompany)
    })

    it('should contain just the fields expected', () => {
      expect(this.viewRecord).to.have.ordered.keys([
        'Primary address',
        'Country',
        'Sector',
        'Headquarter type',
        'Global HQ',
      ])
    })

    it('should supply the primary address', () => {
      expect(this.viewRecord['Primary address']).to.deep.equal({
        type: 'address',
        address: {
          line_1: '5TH FLOOR, PROFILE WEST',
          line_2: '',
          town: 'BRENTFORD',
          county: 'MIDDLESEX',
          postcode: 'TW8 9ES',
          country: {
            id: '1234',
            name: 'France',
          },
        },
      })
    })

    it('should supply the country', () => {
      expect(this.viewRecord.Country).to.equal('France')
    })

    it('should supply sector', () => {
      expect(this.viewRecord.Sector).to.equal('Aerospace')
    })
  })
})
