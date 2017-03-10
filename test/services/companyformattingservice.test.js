/* globals expect: true, describe: true, it: true, beforeEach: true */
const companyFormattingService = require('../../src/services/companyformattingservice')
const TODO = '<span class="status-badge status-badge--xsmall status-badge--action">TO DO</span>'

describe('Company formatting service', () => {
  describe('get display company', () => {
    it('Should not return anything when CH only data.', () => {
      const company = {
        'company_number': '07937720',
        'companies_house_data': {
          'id': 4179778,
          'name': 'AMAZON SAVERS',
          'registered_address_1': '52A HIGH STREET',
          'registered_address_2': '',
          'registered_address_3': '',
          'registered_address_4': '',
          'registered_address_town': 'SHEFFIELD',
          'registered_address_county': '',
          'registered_address_postcode': 'S20 1ED',
          'company_number': '07937720',
          'company_category': 'PRI/LBG/NSC (Private, Limited by guarantee, no share capital)',
          'company_status': 'Active',
          'sic_code_1': '82990 - Other business support service activities n.e.c.',
          'sic_code_2': '',
          'sic_code_3': '',
          'sic_code_4': '',
          'uri': 'http://business.data.gov.uk/id/company/07937720',
          'incorporation_date': '2012-02-06',
          'registered_address_country': {
            'id': '80756b9a-5d95-e211-a939-e4115bead28a',
            'name': 'United Kingdom',
            'selectable': true
          }
        },
        'contacts': [],
        'interactions': []
      }
      const actual = companyFormattingService.getDisplayCompany(company)
      expect(actual).to.be.null
    })
    describe('company contains CDMS data', () => {
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
              'selectable': true
            }
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
              'selectable': true
            },
            'groups': [],
            'user_permissions': []
          },
          'registered_address_1': 'Business Innovation & Skills',
          'registered_address_2': '1 Victoria Street',
          'registered_address_3': null,
          'registered_address_4': null,
          'registered_address_town': 'London',
          'registered_address_country': {
            'id': '80756b9a-5d95-e211-a939-e4115bead28a',
            'name': 'United Kingdom'
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
          'lead': true,
          'description': null,
          'website': null,
          'trading_address_1': null,
          'trading_address_2': null,
          'trading_address_3': null,
          'trading_address_4': null,
          'trading_address_town': null,
          'trading_address_county': null,
          'trading_address_postcode': null,
          'archived_by': null,
          'business_type': {
            'id': '98d14e94-5d95-e211-a939-e4115bead28a',
            'name': 'Company',
            'selectable': true
          },
          'sector': {
            'id': 'a638cecc-5f95-e211-a939-e4115bead28a',
            'name': 'Giftware, Jewellery and Tableware',
            'selectable': true
          },
          'employee_range': null,
          'turnover_range': null,
          'uk_region': {
            'id': '874cd12a-6095-e211-a939-e4115bead28a',
            'name': 'London',
            'selectable': true
          },
          'trading_address_country': null
        }
        const expected = {
          registered_address: 'Business Innovation & Skills, 1 Victoria Street, London, Greater London, SW1H 0ET, United Kingdom',
          business_type: 'Company',
          sector: 'Giftware, Jewellery and Tableware',
          website: TODO,
          description: TODO,
          employee_range: TODO,
          turnover_range: TODO,
          uk_region: 'London',
          account_manager: 'Yvonne Ahern',
          export_to_countries: 'No',
          future_interest_countries: 'Sweden',
          headquarters: 'Not a headquarters',
          name: 'Fresh Flowers'
        }
        const actual = companyFormattingService.getDisplayCompany(company)
        expect(actual).to.deep.equal(expected)
      })
      it('should convert website to link', () => {
        const company = {
          'id': '1234',
          'website': 'http:/www.test.com'
        }

        const actual = companyFormattingService.getDisplayCompany(company)
        expect(actual.website).to.equal('<a href="http:/www.test.com">http:/www.test.com</a>')
      })
      describe('and no CH data', () => {
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
              'selectable': true
            }
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
              'selectable': true
            },
            'groups': [],
            'user_permissions': []
          },
          'registered_address_1': 'Business Innovation & Skills',
          'registered_address_2': '1 Victoria Street',
          'registered_address_3': null,
          'registered_address_4': null,
          'registered_address_town': 'London',
          'registered_address_country': {
            'id': '80756b9a-5d95-e211-a939-e4115bead28a',
            'name': 'United Kingdom'
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
          'lead': true,
          'description': null,
          'website': null,
          'trading_address_1': null,
          'trading_address_2': null,
          'trading_address_3': null,
          'trading_address_4': null,
          'trading_address_town': null,
          'trading_address_county': null,
          'trading_address_postcode': null,
          'archived_by': null,
          'business_type': {
            'id': '98d14e94-5d95-e211-a939-e4115bead28a',
            'name': 'Company',
            'selectable': true
          },
          'sector': {
            'id': 'a638cecc-5f95-e211-a939-e4115bead28a',
            'name': 'Giftware, Jewellery and Tableware',
            'selectable': true
          },
          'employee_range': null,
          'turnover_range': null,
          'uk_region': {
            'id': '874cd12a-6095-e211-a939-e4115bead28a',
            'name': 'London',
            'selectable': true
          },
          'trading_address_country': null
        }
        it('should display CDMS registered address', () => {
          const actual = companyFormattingService.getHeadingAddress(company)
          expect(actual).to.equal('Business Innovation & Skills, 1 Victoria Street, London, Greater London, SW1H 0ET, United Kingdom')
        })
        it('and show the CDMS company type', () => {
          const actual = companyFormattingService.getDisplayCompany(company)
          expect(actual.business_type).to.equal('Company')
        })
      })
      describe('and does have CH data', () => {
        const company = {
          'id': '3a4b36c6-a950-43c5-ba41-82cf6bffaa91',
          'name': 'Fresh Flowers',
          'trading_name': null,
          'company_number': '07937720',
          'companies_house_data': {
            'id': 4179778,
            'name': 'AMAZON SAVERS',
            'registered_address_1': '52A HIGH STREET',
            'registered_address_2': '',
            'registered_address_3': '',
            'registered_address_4': '',
            'registered_address_town': 'SHEFFIELD',
            'registered_address_county': '',
            'registered_address_postcode': 'S20 1ED',
            'company_number': '07937720',
            'company_category': 'PRI/LBG/NSC (Private, Limited by guarantee, no share capital)',
            'company_status': 'Active',
            'sic_code_1': '82990 - Other business support service activities n.e.c.',
            'sic_code_2': '',
            'sic_code_3': '',
            'sic_code_4': '',
            'uri': 'http://business.data.gov.uk/id/company/07937720',
            'incorporation_date': '2012-02-06',
            'registered_address_country': {
              'id': '80756b9a-5d95-e211-a939-e4115bead28a',
              'name': 'United Kingdom',
              'selectable': true
            }
          },
          'interactions': [],
          'contacts': [],
          'export_to_countries': [],
          'future_interest_countries': [
            {
              'id': '300be5c4-5d95-e211-a939-e4115bead28a',
              'name': 'Sweden',
              'selectable': true
            }
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
              'selectable': true
            },
            'groups': [],
            'user_permissions': []
          },
          'registered_address_1': 'Business Innovation & Skills',
          'registered_address_2': '1 Victoria Street',
          'registered_address_3': null,
          'registered_address_4': null,
          'registered_address_town': 'London',
          'registered_address_country': {
            'id': '80756b9a-5d95-e211-a939-e4115bead28a',
            'name': 'United Kingdom'
          },
          'registered_address_county': 'Greater London',
          'registered_address_postcode': 'SW1H 0ET',
          'archived': false,
          'archived_on': null,
          'archived_reason': null,
          'created_on': '2017-01-17T15:09:56.228305',
          'modified_on': '2017-01-17T15:09:56.228311',
          'alias': null,
          'lead': true,
          'description': null,
          'website': null,
          'trading_address_1': null,
          'trading_address_2': null,
          'trading_address_3': null,
          'trading_address_4': null,
          'trading_address_town': null,
          'trading_address_county': null,
          'trading_address_postcode': null,
          'archived_by': null,
          'business_type': {
            'id': '98d14e94-5d95-e211-a939-e4115bead28a',
            'name': 'Company',
            'selectable': true
          },
          'sector': {
            'id': 'a638cecc-5f95-e211-a939-e4115bead28a',
            'name': 'Giftware, Jewellery and Tableware',
            'selectable': true
          },
          'employee_range': null,
          'turnover_range': null,
          'uk_region': {
            'id': '874cd12a-6095-e211-a939-e4115bead28a',
            'name': 'London',
            'selectable': true
          },
          'trading_address_country': null
        }
        it('should not show the CDMS registered address', () => {
          const actual = companyFormattingService.getHeadingAddress(company)
          expect(actual).to.not.have.property('registered_address')
        })
        it('should not show the CDMS company type', () => {
          const actual = companyFormattingService.getHeadingAddress(company)
          expect(actual).to.not.have.property('business_type')
        })
      })
    })
  })
  describe('get display CH data', () => {
    it('should return null if there is no CH data', () => {
      const company = {
        'company_number': '07937720',
        'companies_house_data': null,
        'contacts': [],
        'interactions': []
      }
      const actual = companyFormattingService.getDisplayCH(company)
      expect(actual).to.be.null
    })
    it('should return a subset of CH data to display', () => {
      const company = {
        'company_number': '02658484',
        'companies_house_data': {
          'id': 4179778,
          'name': 'AMAZON SAVERS',
          'registered_address_1': '52A HIGH STREET',
          'registered_address_2': '',
          'registered_address_3': '',
          'registered_address_4': '',
          'registered_address_town': 'SHEFFIELD',
          'registered_address_county': '',
          'registered_address_postcode': 'S20 1ED',
          'company_number': '02658484',
          'company_category': 'Private Limited Company',
          'company_status': 'Active',
          'sic_code_1': '82990 - Other business support service activities n.e.c.',
          'sic_code_2': '82991 - Other business support service activities n.e.c.',
          'sic_code_3': '',
          'sic_code_4': '',
          'uri': 'http://business.data.gov.uk/id/company/07937720',
          'incorporation_date': '2012-02-06',
          'registered_address_country': {
            'id': '80756b9a-5d95-e211-a939-e4115bead28a',
            'name': 'United Kingdom',
            'selectable': true
          }
        },
        'contacts': [],
        'interactions': []
      }
      const actual = companyFormattingService.getDisplayCH(company)
      const expected = {
        company_number: '02658484',
        registered_address: '52a High Street, Sheffield, S20 1ED, United Kingdom',
        business_type: 'Private Limited Company',
        name: 'Amazon Savers',
        company_status: 'Active',
        sic_code: ['82990 - Other business support service activities n.e.c.', '82991 - Other business support service activities n.e.c.'],
        incorporation_date: '6 Feb 2012'
      }
      expect(actual).to.deep.equal(expected)
    })
  })
  describe('get header address', () => {
    it('should return the CDMS trading address if there is one', () => {
      const company = {
        'id': '3a4b36c6-a950-43c5-ba41-82cf6bffaa91',
        'name': 'Fresh Flowers',
        'trading_name': null,
        'companies_house_data': null,
        'registered_address_1': 'Business Innovation & Skills',
        'registered_address_2': '1 Victoria Street',
        'registered_address_3': null,
        'registered_address_4': null,
        'registered_address_town': 'London',
        'registered_address_country': {
          'id': '80756b9a-5d95-e211-a939-e4115bead28a',
          'name': 'United Kingdom'
        },
        'registered_address_county': 'Greater London',
        'registered_address_postcode': 'SW1H 0ET',
        'trading_address_1': 'Trading address',
        'trading_address_2': '2 Victoria Street',
        'trading_address_3': null,
        'trading_address_4': null,
        'trading_address_town': 'Trading town',
        'trading_address_county': 'Trading county',
        'trading_address_postcode': 'WC1 1AA',
        'trading_address_country': {
          'id': '80756b9a-5d95-e211-a939-e4115bead28a',
          'name': 'United Kingdom'
        }
      }

      const address = companyFormattingService.getHeadingAddress(company)

      expect(address).to.equal('Trading Address, 2 Victoria Street, Trading Town, Trading County, WC1 1AA, United Kingdom')
    })
    it('should return the CDMS registered address if there is no trading and no CH', () => {
      const company = {
        'id': '3a4b36c6-a950-43c5-ba41-82cf6bffaa91',
        'name': 'Fresh Flowers',
        'trading_name': null,
        'companies_house_data': null,
        'registered_address_1': 'Business Innovation & Skills',
        'registered_address_2': '1 Victoria Street',
        'registered_address_3': null,
        'registered_address_4': null,
        'registered_address_town': 'London',
        'registered_address_country': {
          'id': '80756b9a-5d95-e211-a939-e4115bead28a',
          'name': 'United Kingdom'
        },
        'registered_address_county': 'Greater London',
        'registered_address_postcode': 'SW1H 0ET',
        'trading_address_1': null,
        'trading_address_2': null,
        'trading_address_3': null,
        'trading_address_4': null,
        'trading_address_town': null,
        'trading_address_county': null,
        'trading_address_postcode': null,
        'trading_address_country': null
      }
      const address = companyFormattingService.getHeadingAddress(company)
      expect(address).to.equal('Business Innovation & Skills, 1 Victoria Street, London, Greater London, SW1H 0ET, United Kingdom')
    })
    it('should return the CH registered address if there is no trading address but there is a CH', () => {
      const company = {
        'id': '3a4b36c6-a950-43c5-ba41-82cf6bffaa91',
        'name': 'Fresh Flowers',
        'trading_name': null,
        'companies_house_data': {
          'id': 4179778,
          'name': 'AMAZON SAVERS',
          'registered_address_1': '52A HIGH STREET',
          'registered_address_2': '',
          'registered_address_3': '',
          'registered_address_4': '',
          'registered_address_town': 'SHEFFIELD',
          'registered_address_county': '',
          'registered_address_postcode': 'S20 1ED',
          'company_number': '02658484',
          'company_category': 'Private Limited Company',
          'company_status': 'Active',
          'sic_code_1': '82990 - Other business support service activities n.e.c.',
          'sic_code_2': '82991 - Other business support service activities n.e.c.',
          'sic_code_3': '',
          'sic_code_4': '',
          'uri': 'http://business.data.gov.uk/id/company/07937720',
          'incorporation_date': '2012-02-06',
          'registered_address_country': {
            'id': '80756b9a-5d95-e211-a939-e4115bead28a',
            'name': 'United Kingdom',
            'selectable': true
          }
        },
        'registered_address_1': 'Business Innovation & Skills',
        'registered_address_2': '1 Victoria Street',
        'registered_address_3': null,
        'registered_address_4': null,
        'registered_address_town': 'London',
        'registered_address_country': {
          'id': '80756b9a-5d95-e211-a939-e4115bead28a',
          'name': 'United Kingdom'
        },
        'registered_address_county': 'Greater London',
        'registered_address_postcode': 'SW1H 0ET',
        'trading_address_1': null,
        'trading_address_2': null,
        'trading_address_3': null,
        'trading_address_4': null,
        'trading_address_town': null,
        'trading_address_county': null,
        'trading_address_postcode': null,
        'trading_address_country': null
      }
      const address = companyFormattingService.getHeadingAddress(company)
      expect(address).to.equal('52a High Street, Sheffield, S20 1ED, United Kingdom')
    })
  })
})
