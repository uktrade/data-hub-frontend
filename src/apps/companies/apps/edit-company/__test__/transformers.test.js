const {
  transformCompanyToForm,
  transformFormToCompany,
} = require('../transformers')

const datahubOnlyCompany = require('../../../../../../test/unit/data/companies/datahub-only-company.json')
const minimalCompany = require('../../../../../../test/unit/data/companies/minimal-company.json')
const companiesHouseCompany = require('../../../../../../test/unit/data/companies/companies-house.json')

describe('Edit company form transformers', () => {
  describe('#transformCompanyToForm', () => {
    context('when called with a fully populated datahub only company', () => {
      it('should return transformed values', () => {
        const actual = transformCompanyToForm(datahubOnlyCompany)
        const expected = {
          id: '72fda78f-bdc3-44dc-9c22-c8ac82f7bda4',
          company_number: null,
          trading_names: 'Fred',
          vat_number: '123412341234',
          website: 'http://www.test.com',
          description: 'description',
          registered_address: {
            line_1: '5TH FLOOR, PROFILE WEST',
            line_2: '950 GREAT WEST ROAD',
            town: 'BRENTFORD',
            county: 'MIDDLESEX',
            postcode: 'TW8 9ES',
            country: {
              name: 'United Kingdom',
              id: '80756b9a-5d95-e211-a939-e4115bead28a',
            },
          },
          one_list_group_tier: null,
          uk_based: true,
          address1: 'Business Innovation & Skills',
          address2: '1 Victoria Street',
          city: 'London',
          county: 'Greater London',
          postcode: 'SW1H 0ET',
          country: {
            name: 'United Kingdom',
            id: '80756b9a-5d95-e211-a939-e4115bead28a',
          },
          business_type: 'Private limited company',
          headquarter_type: '11322',
          uk_region: '814cd12a-6095-e211-a939-e4115bead28a',
          sector: 'b622c9d2-5f95-e211-a939-e4115bead28a',
        }

        expect(actual).to.deep.equal(expected)
      })
    })

    context('when called with a minimally populated company', () => {
      it('should return transformed values', () => {
        const actual = transformCompanyToForm(minimalCompany)
        const expected = {
          id: '72fda78f-bdc3-44dc-9c22-c8ac82f7bda4',
          company_number: null,
          vat_number: '',
          website: null,
          description: null,
          registered_address: null,
          one_list_group_tier: null,
          uk_based: true,
          address1: '5TH FLOOR, PROFILE WEST',
          address2: '',
          city: 'BRENTFORD',
          county: 'MIDDLESEX',
          postcode: 'TW8 9ES',
          country: {
            name: 'United Kingdom',
            id: '80756b9a-5d95-e211-a939-e4115bead28a',
          },
          headquarter_type: 'not_headquarters',
          uk_region: '814cd12a-6095-e211-a939-e4115bead28a',
          sector: 'b622c9d2-5f95-e211-a939-e4115bead28a',
        }

        expect(actual).to.deep.equal(expected)
      })
    })

    context('when called with a Companies House company', () => {
      it('should return transformed values', () => {
        const actual = transformCompanyToForm(companiesHouseCompany)
        const expected = {
          id: 15387806,
          one_list_group_tier: null,
          company_number: '99919',
          registered_address: {
            line_1: '64 Ermin Street',
            line_2: '',
            town: 'Y Ffor',
            county: '',
            postcode: 'LL53 5RN',
            country: {
              name: 'United Kingdom',
              id: '80756b9a-5d95-e211-a939-e4115bead28a',
            },
          },
          business_type: 'Private limited company',
          headquarter_type: 'not_headquarters',
        }

        expect(actual).to.deep.equal(expected)
      })
    })
  })

  describe('transformFormToCompany', () => {
    context('when called with all fields', () => {
      it('should return transformed values', () => {
        const actual = transformFormToCompany({
          vat_number: 'v1',
          turnover_range: 't1',
          employee_range: 'e1',
          website: 'http://example.com',
          description: 'test description',
          uk_region: 'r1',
          sector: 's1',
          trading_names: 'test company',
          headquarter_type: 'ht1',
          address1: '5TH FLOOR, PROFILE WEST',
          address2: '',
          city: 'BRENTFORD',
          county: 'MIDDLESEX',
          postcode: 'TW8 9ES',
          country: {
            name: 'United Kingdom',
            id: '80756b9a-5d95-e211-a939-e4115bead28a',
          },
        })
        const expected = {
          vat_number: 'v1',
          turnover_range: 't1',
          employee_range: 'e1',
          website: 'http://example.com',
          description: 'test description',
          uk_region: 'r1',
          sector: 's1',
          headquarter_type: 'ht1',
          trading_names: ['test company'],
          address: {
            line_1: '5TH FLOOR, PROFILE WEST',
            line_2: '',
            town: 'BRENTFORD',
            county: 'MIDDLESEX',
            postcode: 'TW8 9ES',
          },
        }

        expect(actual).to.deep.equal(expected)
      })
    })

    context('when "trading_names" is not set', () => {
      it('should transform "trading_names" to empty array', () => {
        const actual = transformFormToCompany({})
        const expected = []

        expect(actual.trading_names).to.deep.equal(expected)
      })
    })

    context('when "headquarter_type" is set as "not_headquarters', () => {
      it('should transform "headquarter_type" to empty string', () => {
        const actual = transformFormToCompany({
          headquarter_type: 'not_headquarters',
        })
        const expected = ''

        expect(actual.headquarter_type).to.deep.equal(expected)
      })
    })
  })
})
