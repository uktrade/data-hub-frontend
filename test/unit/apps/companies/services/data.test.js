const companyService = require('data.js')

describe('Company data service', () => {
  describe('get header address', () => {
    it('should return the CDMS trading address if there is one', () => {
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
          'name': 'United Kingdom',
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

      const address = companyService.getHeadingAddress(company)

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
        'registered_address_town': 'London',
        'registered_address_country': {
          'id': '80756b9a-5d95-e211-a939-e4115bead28a',
          'name': 'United Kingdom',
        },
        'registered_address_county': 'Greater London',
        'registered_address_postcode': 'SW1H 0ET',
        'trading_address_1': null,
        'trading_address_2': null,
        'trading_address_town': null,
        'trading_address_county': null,
        'trading_address_postcode': null,
        'trading_address_country': null,
      }
      const address = companyService.getHeadingAddress(company)
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
          },
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
        'trading_address_1': null,
        'trading_address_2': null,
        'trading_address_town': null,
        'trading_address_county': null,
        'trading_address_postcode': null,
        'trading_address_country': null,
      }
      const address = companyService.getHeadingAddress(company)
      expect(address).to.equal('52a High Street, Sheffield, S20 1ED, United Kingdom')
    })
  })

  describe('buildCompanyUrl', () => {
    it('should return expected url for non uk based company', () => {
      const urlPath = companyService.buildCompanyUrl({
        uk_based: false,
        id: 'mockId',
      })

      expect(urlPath).to.equal('/company/view/foreign/mockId')
    })
    it('should return expected url for private ltd company', () => {
      const urlPath = companyService.buildCompanyUrl({
        uk_based: true,
        business_type: {
          name: 'private limited company',
        },
        id: 'mockId',
      })

      expect(urlPath).to.equal('/company/view/ltd/mockId')
    })
    it('should return expected url for public ltd company', () => {
      const urlPath = companyService.buildCompanyUrl({
        uk_based: true,
        business_type: {
          name: 'public limited company',
        },
        id: 'mockId',
      })

      expect(urlPath).to.equal('/company/view/ltd/mockId')
    })
    it('should return expected url for public ltd company with caps case', () => {
      const urlPath = companyService.buildCompanyUrl({
        uk_based: true,
        business_type: {
          name: 'PUBLIC LIMITED COMPANY',
        },
        id: 'mockId',
      })

      expect(urlPath).to.equal('/company/view/ltd/mockId')
    })
    it('should return expected url uk non public, private ltd', () => {
      const urlPath = companyService.buildCompanyUrl({
        uk_based: true,
        business_type: {
          name: 'a different company type',
        },
        id: 'mockId',
      })

      expect(urlPath).to.equal('/company/view/ukother/mockId')
    })
  })
})
