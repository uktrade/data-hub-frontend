const datahubOnlyCompany = require('~/test/unit/data/companies/datahub-only-company.json')
const minimalCompany = require('~/test/unit/data/companies/minimal-company.json')
const companiesHouseCompany = require('~/test/unit/data/companies/companies-house.json')

const transformCompanyToForm = require('~/src/apps/companies/transformers/company-to-form')

describe('transformCompanyToForm', () => {
  context('when called with a fully populated datahub only company', () => {
    it('should return transformed values', () => {
      const actual = transformCompanyToForm(datahubOnlyCompany)
      const expected = {
        business_type: '6f75408b-03e7-e611-bca1-e4115bead28a',
        company_number: null,
        description: 'description',
        employee_range: undefined,
        global_headquarters: undefined,
        headquarter_type: '11322',
        name: 'SAMSUNG BIOEPIS UK LIMITED',
        reference_code: 'ORG-12345678',
        sector: 'b622c9d2-5f95-e211-a939-e4115bead28a',
        address_1: 'Business Innovation & Skills',
        address_2: '1 Victoria Street',
        address_town: 'London',
        address_county: 'Greater London',
        address_postcode: 'SW1H 0ET',
        address_country: '80756b9a-5d95-e211-a939-e4115bead28a',
        registered_address_1: '5TH FLOOR, PROFILE WEST',
        registered_address_2: '950 GREAT WEST ROAD',
        registered_address_country: '80756b9a-5d95-e211-a939-e4115bead28a',
        registered_address_county: 'MIDDLESEX',
        registered_address_postcode: 'TW8 9ES',
        registered_address_town: 'BRENTFORD',
        trading_names: 'Fred',
        turnover_range: undefined,
        uk_based: true,
        uk_region: '814cd12a-6095-e211-a939-e4115bead28a',
        vat_number: '123412341234',
        website: 'http://www.test.com',
      }

      expect(actual).to.deep.equal(expected)
    })
  })

  context('when called with a minimally populated company', () => {
    it('should return transformed values', () => {
      const actual = transformCompanyToForm(minimalCompany)
      const expected = {
        business_type: undefined,
        company_number: null,
        description: null,
        employee_range: undefined,
        global_headquarters: undefined,
        headquarter_type: 'not_headquarters',
        name: 'SAMSUNG BIOEPIS UK LIMITED',
        reference_code: '',
        sector: 'b622c9d2-5f95-e211-a939-e4115bead28a',
        address_1: '5TH FLOOR, PROFILE WEST',
        address_2: '',
        address_town: 'BRENTFORD',
        address_county: 'MIDDLESEX',
        address_postcode: 'TW8 9ES',
        address_country: '80756b9a-5d95-e211-a939-e4115bead28a',
        registered_address_1: undefined,
        registered_address_2: undefined,
        registered_address_town: undefined,
        registered_address_county: undefined,
        registered_address_postcode: undefined,
        registered_address_country: undefined,
        trading_names: null,
        turnover_range: undefined,
        uk_based: true,
        uk_region: '814cd12a-6095-e211-a939-e4115bead28a',
        vat_number: '',
        website: null,
      }

      expect(actual).to.deep.equal(expected)
    })
  })

  context('when called with a Companies House company', () => {
    it('should return transformed values', () => {
      const actual = transformCompanyToForm(companiesHouseCompany)
      const expected = {
        business_type: '6f75408b-03e7-e611-bca1-e4115bead28a',
        company_number: '99919',
        description: undefined,
        employee_range: undefined,
        global_headquarters: undefined,
        headquarter_type: 'not_headquarters',
        name: 'Mercury Trading Ltd',
        reference_code: undefined,
        sector: undefined,
        address_1: undefined,
        address_2: undefined,
        address_town: undefined,
        address_county: undefined,
        address_postcode: undefined,
        address_country: undefined,
        registered_address_1: '64 Ermin Street',
        registered_address_2: '',
        registered_address_town: 'Y Ffor',
        registered_address_county: '',
        registered_address_postcode: 'LL53 5RN',
        registered_address_country: '80756b9a-5d95-e211-a939-e4115bead28a',
        trading_names: null,
        turnover_range: undefined,
        uk_based: undefined,
        uk_region: undefined,
        vat_number: undefined,
        website: undefined,
      }

      expect(actual).to.deep.equal(expected)
    })
  })
})
