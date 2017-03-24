/* globals expect: true, describe: true, it: true, beforeEach: true */
const proxyquire = require('proxyquire')

describe('Company controller, getDetails', function () {
  let fakeCompany = {}
  let companyController = {}
  let fakeCompanyRepository = {}

  beforeEach(function () {
    fakeCompanyRepository = {
      saveCompany: function (token, company) {
        return new Promise((resolve) => {
          resolve(company)
        })
      }
    }
    fakeCompany = {
      id: '1234',
      company_number: '1111',
      companies_house_data: {
        name: 'freds',
        registered_address_1: '10 the street',
        registered_address_2: null,
        registered_address_3: null,
        registered_address_4: null,
        registered_address_town: 'town',
        registered_address_county: 'county',
        registered_address_country: {
          id: '80756b9a-5d95-e211-a939-e4115bead28a',
          name: 'United Kingdom',
          selectable: true
        }
      }
    }
    companyController = proxyquire('../../src/controllers/companycontroller', {
      '../services/searchservice': {
        getCompanyForSource: function (token, id, source) {
          return new Promise((resolve) => {
            resolve(fakeCompany)
          })
        },
        searchLimited: function (token, term) {
          return new Promise((resolve) => {
            resolve([
              {
                _type: 'company_company',
                _source: {
                  id: '1234',
                  company_number: '123123',
                  name: 'freds'
                }
              }
            ])
          })
        }
      },
      '../services/companyservice': {
        getCompanyForSource: function (token, id, type) {
          return new Promise((resolve) => {
            resolve(fakeCompany)
          })
        }
      },
      '../services/companyformattingservice': {
        getDisplayCH: function () {
          return { id: 1 }
        }
      },
      '../repositorys/metadatarepository': {
        businessTypeOptions: [
          {
            'id': '9dd14e94-5d95-e211-a939-e4115bead28a',
            'name': 'Charity',
            'selectable': true
          }, {
            'id': '98d14e94-5d95-e211-a939-e4115bead28a',
            'name': 'Company',
            'selectable': true
          }, {
            'id': '9cd14e94-5d95-e211-a939-e4115bead28a',
            'name': 'Government Dept',
            'selectable': true
          }, {
            'id': '9bd14e94-5d95-e211-a939-e4115bead28a',
            'name': 'Intermediary',
            'selectable': true
          }, {
            'id': '8b6eaf7e-03e7-e611-bca1-e4115bead28a',
            'name': 'Limited partnership',
            'selectable': true
          }, {
            'id': '9ad14e94-5d95-e211-a939-e4115bead28a',
            'name': 'Partnership',
            'selectable': true
          }, {
            'id': '6f75408b-03e7-e611-bca1-e4115bead28a',
            'name': 'Private limited company',
            'selectable': true
          }, {
            'id': 'dac8c591-03e7-e611-bca1-e4115bead28a',
            'name': 'Public limited company',
            'selectable': true
          }, {
            'id': '99d14e94-5d95-e211-a939-e4115bead28a',
            'name': 'Sole Trader',
            'selectable': true
          }, {
            'id': '0167b456-0ddd-49bd-8184-e3227a0b6396',
            'name': 'Undefined',
            'selectable': true
          }
        ]
      },
      '../repositorys/companyrepository': fakeCompanyRepository
    })
  })

  it('should generate formatted companies house data for display if there is companies house data', function (done) {
    const company = {
      id: '1234',
      company_number: '1111',
      companies_house_data: {
        company_category: 'Private Limited Company',
        company_number: '1111',
        name: 'Test company'
      }
    }
    const req = {}
    const res = {
      locals: { company },
      render: function (url, options) {
        const allOptions = mergeLocals(res, options)
        expect(allOptions).to.have.property('chDetails')
        expect(allOptions).to.have.property('chDetailsLabels')
        expect(allOptions).to.have.property('chDetailsDisplayOrder')
        done()
      }
    }
    companyController.editDetails(req, res)
  })
  it('should not generate formatted companies house data if there is no companies house data', function (done) {
    const company = {
      id: '1234',
      company_number: null,
      companies_house_data: null
    }
    const req = {}
    const res = {
      locals: { company },
      render: function (url, options) {
        const allOptions = mergeLocals(res, options)
        expect(allOptions).to.not.have.property('chDetails')
        expect(allOptions).to.not.have.property('chDetailsLabels')
        expect(allOptions).to.not.have.property('chDetailsDisplayOrder')
        done()
      }
    }
    companyController.getDetails(req, res)
  })
  it('should generate appropriate formatted CDMS data if there is a CDMS record for this company and no companies house record', function (done) {
    const company = {
      id: '1234',
      company_number: null,
      companies_house_data: null,
      name: 'Shelter',
      business_type: {id: '1234', name: 'Charity'},
      registered_address_1: '88 Old Streed',
      registered_address_2: null,
      registered_address_3: null,
      registered_address_4: null,
      registered_address_town: 'London',
      registered_address_county: null,
      registered_address_postcode: 'EC1V 9HU',
      registered_address_country: {
        id: '80756b9a-5d95-e211-a939-e4115bead28a',
        name: 'United Kingdom',
        selectable: true
      },
      uk_region: {
        id: '433',
        name: 'London'
      },
      headquarter_type: {
        id: 'eb59eaeb-eeb8-4f54-9506-a5e08773046b',
        name: 'ehq',
        selectable: true
      },
      sector: { id: '1234', name: 'Retail' },
      website: 'http://www.test.org',
      description: 'test description',
      employee_range: null,
      turnover_range: null
    }
    const req = {}
    const res = {
      locals: { company },
      render: function (url, options) {
        const allOptions = mergeLocals(res, options)
        expect(allOptions).to.have.property('companyDetails')
        expect(allOptions).to.have.property('companyDetailsLabels')
        expect(allOptions.companyDetailsDisplayOrder).to.deep.equal([
          'business_type',
          'registered_address',
          'alias',
          'trading_address',
          'uk_region',
          'headquarter_type',
          'sector',
          'website',
          'description',
          'employee_range',
          'turnover_range'
        ])
        done()
      }
    }
    companyController.getDetails(req, res)
  })
  it('should generate appropriate formatted CDMS data if there is a CDMS record for this company and a companies house record', function (done) {
    const company = {
      id: '1234',
      company_number: '1234',
      companies_house_data: {
        name: 'freds',
        company_category: 'Private Limited Company',
        registered_address_1: '10 the street',
        registered_address_2: null,
        registered_address_3: null,
        registered_address_4: null,
        registered_address_town: 'town',
        registered_address_county: 'county',
        registered_address_country: {
          id: '80756b9a-5d95-e211-a939-e4115bead28a',
          name: 'United Kingdom',
          selectable: true
        }
      },
      name: 'Shelter',
      business_type: {id: '1234', name: 'Charity'},
      registered_address_1: '88 Old Streed',
      registered_address_2: null,
      registered_address_3: null,
      registered_address_4: null,
      registered_address_town: 'London',
      registered_address_county: null,
      registered_address_postcode: 'EC1V 9HU',
      registered_address_country: {
        id: '80756b9a-5d95-e211-a939-e4115bead28a',
        name: 'United Kingdom',
        selectable: true
      },
      uk_region: {
        id: '433',
        name: 'London'
      },
      headquarter_type: {
        id: 'eb59eaeb-eeb8-4f54-9506-a5e08773046b',
        name: 'ehq',
        selectable: true
      },
      sector: { id: '1234', name: 'Retail' },
      website: 'http://www.test.org',
      description: 'test description',
      employee_range: null,
      turnover_range: null
    }
    const req = {}
    const res = {
      locals: { company },
      render: function (url, options) {
        const allOptions = mergeLocals(res, options)
        expect(allOptions).to.have.property('companyDetails')
        expect(allOptions).to.have.property('companyDetailsLabels')
        expect(allOptions.companyDetailsDisplayOrder).to.deep.equal([
          'alias',
          'trading_address',
          'uk_region',
          'headquarter_type',
          'sector',
          'website',
          'description',
          'employee_range',
          'turnover_range'
        ])
        done()
      }
    }
    const next = function (error) {
      console.log(error)
      expect(false).to.equal(true)
    }
    companyController.getDetails(req, res, next)
  })
  it('should not generate company information if this is a companies house only entry', function (done) {
    const company = {
      id: null,
      company_number: '1234',
      companies_house_data: {
        name: 'freds',
        company_category: 'Private Limited Company',
        registered_address_1: '10 the street',
        registered_address_2: null,
        registered_address_3: null,
        registered_address_4: null,
        registered_address_town: 'town',
        registered_address_county: 'county',
        registered_address_country: {
          id: '80756b9a-5d95-e211-a939-e4115bead28a',
          name: 'United Kingdom',
          selectable: true
        }
      }
    }
    const req = {}
    const res = {
      locals: { company },
      render: function (url, options) {
        const allOptions = mergeLocals(res, options)
        expect(allOptions).to.not.have.property('companyDetails')
        expect(allOptions).to.not.have.property('companyDetailsDisplayOrder')
        expect(allOptions).to.not.have.property('companyDetailsLabels')
        done()
      }
    }
    companyController.getDetails(req, res)
  })
  it('should generate account management formatted data if this is a CDMS record', function (done) {
    const company = {
      id: '1234',
      company_number: null,
      companies_house_data: null,
      name: 'Shelter',
      business_type: {id: '1234', name: 'Charity'},
      registered_address_1: '88 Old Streed',
      registered_address_2: null,
      registered_address_3: null,
      registered_address_4: null,
      registered_address_town: 'London',
      registered_address_county: null,
      registered_address_postcode: 'EC1V 9HU',
      registered_address_country: {
        id: '80756b9a-5d95-e211-a939-e4115bead28a',
        name: 'United Kingdom',
        selectable: true
      },
      uk_region: {
        id: '433',
        name: 'London'
      },
      headquarter_type: {
        id: 'eb59eaeb-eeb8-4f54-9506-a5e08773046b',
        name: 'ehq',
        selectable: true
      },
      sector: { id: '1234', name: 'Retail' },
      website: 'http://www.test.org',
      description: 'test description',
      employee_range: null,
      turnover_range: null
    }
    const req = {}
    const res = {
      locals: { company },
      render: function (url, options) {
        const allOptions = mergeLocals(res, options)
        expect(allOptions.accountManagementDisplay).to.deep.equal({oneListTier: 'None', oneListAccountManager: 'None'})
        done()
      }
    }
    companyController.getDetails(req, res)
  })
})

function mergeLocals (res, options) {
  return Object.assign({}, res.locals, options)
}
