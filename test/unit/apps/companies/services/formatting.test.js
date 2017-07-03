const companyFormattingService = require('~/src/apps/companies/services/formatting')

describe('Company formatting service', () => {
  describe('get display company company contains CDMS data', () => {
    it('should show company data, even empty values', () => {
      const company = {
        'id': '3a4b36c6-a950-43c5-ba41-82cf6bffaa91',
        'name': 'Fresh Flowers',
        'trading_name': null,
        'companies_house_data': null,
        'interactions': [],
        'contacts': [],
        'export_to_countries': [],
        'future_interest_countries': [
          {
            'id': '300be5c4-5d95-e211-a939-e4115bead28a',
            'name': 'Sweden',
          },
        ],
        'uk_based': true,
        'account_manager': {
          'id': 'e4caa015-6838-e611-8d53-e4115bed50dc',
          'name': 'Yvonne Ahern',
          'password': '39555a234604421bb7d5acf32098efca',
          'last_login': null,
          'is_superuser': false,
          'first_name': 'Yvonne',
          'last_name': 'Ahern',
          'email': 'yvonne.ahern@mobile.ukti.gov.uk',
          'dit_team': {
            'id': '3a48318c-9698-e211-a939-e4115bead28a',
            'name': 'ITFG - E-Business Operational Support Team',
          },
          'groups': [],
          'user_permissions': [],
        },
        'registered_address_1': 'Business Innovation & Skills',
        'registered_address_2': '1 Victoria Street',
        'registered_address_town': 'London',
        'registered_address_country': {
          'id': '80756b9a-5d95-e211-a939-e4115bead28a',
          'name': 'United Kingdom',
        },
        'registered_address_county': 'Greater London',
        'registered_address_postcode': 'SW1H 0ET',
        'archived': false,
        'archived_on': null,
        'archived_reason': null,
        'created_on': '2017-01-17T15:09:56.228305',
        'modified_on': '2017-01-17T15:09:56.228311',
        'company_number': null,
        'alias': 'Fred',
        'description': 'description',
        'website': 'http://www.test.com',
        'trading_address_1': 'Business Innovation & Skills',
        'trading_address_2': '2 Victoria Street',
        'trading_address_town': 'London',
        'trading_address_country': {
          'id': '80756b9a-5d95-e211-a939-e4115bead28a',
          'name': 'United Kingdom',
        },
        'trading_address_county': 'Greater London',
        'trading_address_postcode': 'SW1H 0ET',
        'archived_by': null,
        'business_type': {
          'id': '98d14e94-5d95-e211-a939-e4115bead28a',
          'name': 'Company',
        },
        'headquarter_type': {
          'id': 'eb59eaeb-eeb8-4f54-9506-a5e08773046b',
          'name': 'ehq',
        },
        'sector': {
          'id': 'a638cecc-5f95-e211-a939-e4115bead28a',
          'name': 'Giftware, Jewellery and Tableware',
        },
        'employee_range': null,
        'turnover_range': null,
        'uk_region': {
          'id': '874cd12a-6095-e211-a939-e4115bead28a',
          'name': 'London',
        },
      }
      const expected = {
        business_type: 'Company',
        name: 'Fresh Flowers',
        registered_address: 'Business Innovation & Skills, 1 Victoria Street, London, Greater London, SW1H 0ET, United Kingdom',
        alias: 'Fred',
        trading_address: 'Business Innovation & Skills, 2 Victoria Street, London, Greater London, SW1H 0ET, United Kingdom',
        uk_region: 'London',
        headquarter_type: 'European headquarters (EHQ)',
        sector: 'Giftware, Jewellery and Tableware',
        website: '<a href="http://www.test.com">http://www.test.com</a>',
        description: 'description',
        employee_range: null,
        turnover_range: null,
        account_manager: 'Yvonne Ahern',
        country: 'United Kingdom',
      }
      const actual = companyFormattingService.getDisplayCompany(company)
      expect(actual).to.deep.equal(expected)
    })
    it('should convert website to link', () => {
      const company = {
        'id': '1234',
        'website': 'http:/www.test.com',
      }

      const actual = companyFormattingService.getDisplayCompany(company)
      expect(actual.website).to.equal('<a href="http:/www.test.com">http:/www.test.com</a>')
    })
    it('should return the country if this is a none uk company', () => {
      const company = {
        'id': '3a4b36c6-a950-43c5-ba41-82cf6bffaa91',
        'name': 'Fresh Flowers',
        'trading_name': null,
        'companies_house_data': null,
        'registered_address_1': 'Business Innovation & Skills',
        'registered_address_2': '1 Victoria Street',
        'registered_address_town': 'London',
        'registered_address_country': {
          'id': '80756b9a-5d95-e211-a939-e4115bead28a',
          'name': 'Spain',
        },
        'registered_address_county': 'Greater London',
        'registered_address_postcode': 'SW1H 0ET',
        'trading_address_1': 'Trading address',
        'trading_address_2': '2 Victoria Street',
        'trading_address_town': 'Trading town',
        'trading_address_county': 'Trading county',
        'trading_address_postcode': 'WC1 1AA',
        'trading_address_country': {
          'id': '80756b9a-5d95-e211-a939-e4115bead28a',
          'name': 'United Kingdom',
        },
      }

      const actual = companyFormattingService.getDisplayCompany(company)
      expect(actual.country).to.equal('Spain')
    })
    it('should return the primary sector and not the sub sector data', () => {
      const company = {
        'id': '3a4b36c6-a950-43c5-ba41-82cf6bffaa91',
        'name': 'Fresh Flowers',
        'trading_name': null,
        'companies_house_data': null,
        'registered_address_1': 'Business Innovation & Skills',
        'registered_address_2': '1 Victoria Street',
        'registered_address_town': 'London',
        'registered_address_country': {
          'id': '80756b9a-5d95-e211-a939-e4115bead28a',
          'name': 'Spain',
        },
        'registered_address_county': 'Greater London',
        'registered_address_postcode': 'SW1H 0ET',
        'trading_address_1': 'Trading address',
        'trading_address_2': '2 Victoria Street',
        'trading_address_town': 'Trading town',
        'trading_address_county': 'Trading county',
        'trading_address_postcode': 'WC1 1AA',
        'trading_address_country': {
          'id': '80756b9a-5d95-e211-a939-e4115bead28a',
          'name': 'United Kingdom',
        },
        'sector': {
          'id': 'a638cecc-5f95-e211-a939-e4115bead28a',
          'name': 'Computers : Tech',
        },
      }

      const actual = companyFormattingService.getDisplayCompany(company)
      expect(actual.sector).to.equal('Computers')
    })
  })
  describe('get display company company contains CDMS dataand no CH data', () => {
    const company = {
      'id': '3a4b36c6-a950-43c5-ba41-82cf6bffaa91',
      'name': 'Fresh Flowers',
      'trading_name': null,
      'companies_house_data': null,
      'interactions': [],
      'contacts': [],
      'export_to_countries': [],
      'future_interest_countries': [
        {
          'id': '300be5c4-5d95-e211-a939-e4115bead28a',
          'name': 'Sweden',
        },
      ],
      'uk_based': true,
      'account_manager': {
        'id': 'e4caa015-6838-e611-8d53-e4115bed50dc',
        'name': 'Yvonne Ahern',
        'password': '39555a234604421bb7d5acf32098efca',
        'last_login': null,
        'is_superuser': false,
        'first_name': 'Yvonne',
        'last_name': 'Ahern',
        'email': 'yvonne.ahern@mobile.ukti.gov.uk',
        'dit_team': {
          'id': '3a48318c-9698-e211-a939-e4115bead28a',
          'name': 'ITFG - E-Business Operational Support Team',
        },
        'groups': [],
        'user_permissions': [],
      },
      'registered_address_1': 'Business Innovation & Skills',
      'registered_address_2': '1 Victoria Street',
      'registered_address_town': 'London',
      'registered_address_country': {
        'id': '80756b9a-5d95-e211-a939-e4115bead28a',
        'name': 'United Kingdom',
      },
      'registered_address_county': 'Greater London',
      'registered_address_postcode': 'SW1H 0ET',
      'archived': false,
      'archived_on': null,
      'archived_reason': null,
      'created_on': '2017-01-17T15:09:56.228305',
      'modified_on': '2017-01-17T15:09:56.228311',
      'company_number': null,
      'alias': null,
      'description': null,
      'website': null,
      'trading_address_1': null,
      'trading_address_2': null,
      'trading_address_town': null,
      'trading_address_county': null,
      'trading_address_postcode': null,
      'archived_by': null,
      'business_type': {
        'id': '98d14e94-5d95-e211-a939-e4115bead28a',
        'name': 'Company',
      },
      'sector': {
        'id': 'a638cecc-5f95-e211-a939-e4115bead28a',
        'name': 'Giftware, Jewellery and Tableware',
      },
      'employee_range': null,
      'turnover_range': null,
      'uk_region': {
        'id': '874cd12a-6095-e211-a939-e4115bead28a',
        'name': 'London',
      },
      'trading_address_country': null,
    }
    it('and show the CDMS company type', () => {
      const actual = companyFormattingService.getDisplayCompany(company)
      expect(actual.business_type).to.equal('Company')
    })
  })
})
