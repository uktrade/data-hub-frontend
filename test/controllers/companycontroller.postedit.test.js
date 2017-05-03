/* globals expect: true, describe: true, it: true, beforeEach: true */
/* eslint prefer-promise-reject-errors: 0 */
const proxyquire = require('proxyquire')

describe('Company controller, postEdit', function () {
  describe('handle bad data', function () {
    let companyController
    let fakeCompany
    let body

    beforeEach(function () {
      body = {
        company_number: '1234',
        business_type: '11111',
        uk_based: true,
        name: 'freds',
        registered_address_1: '1 the street',
        registered_address_2: '',
        registered_address_3: '',
        registered_address_4: '',
        registered_address_town: '',
        registered_address_county: '',
        registered_address_postcode: '',
        registered_address_country: '22222'
      }
      fakeCompany = {
        id: '1234',
        company_number: '1111',
        companies_house_data: {
          name: 'freds',
          company_number: '1234',
          company_category: 'Charity',
          registered_address_1: '10 the street',
          incorporation_date: '2012-02-06',
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
        '../services/companyservice': {
          getCompanyForSource: function (token, id, source) {
            return new Promise((resolve) => {
              resolve(fakeCompany)
            })
          }
        },
        '../repositorys/companyrepository': {
          saveCompany: function (token, company) {
            return new Promise((resolve, reject) => {
              reject({
                errors: [{thing: ['error']}]
              })
            })
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
        }
      })
    })

    it('should convert a form back to a company object if there are errors', function (done) {
      const req = {
        get: function () {
          return 'localhost'
        },
        flash: function (type, message) {
          console.log(`${type} : ${message}`)
        },
        query: {},
        baseUrl: '/company/company_company/123123/',
        params: {
          sourceId: '1234',
          source: 'company_companieshousecompany'
        },
        session: {
          token: '1234'
        },
        body
      }
      const res = {
        render: function (req, options) {
          const allOptions = mergeLocals(res, options)
          expect(allOptions.company).to.have.property('companies_house_data')
          expect(allOptions.company.companies_house_data.company_number).to.equal('1234')
          done()
        },
        locals: {}
      }

      companyController.postDetails(req, res)
    })
    it('should include errors in the form when posting bad data', function (done) {
      const req = {
        get: function () {
          return 'localhost'
        },
        query: {},
        baseUrl: '/company/company_company/123123/',
        params: {
          sourceId: '1234',
          source: 'company_companieshousecompany'
        },
        session: {
          token: '1234'
        },
        body
      }
      const res = {
        locals: {},
        render: function (url, options) {
          const allOptions = mergeLocals(res, options)
          expect(allOptions).to.have.property('errors')
          done()
        }
      }
      companyController.postDetails(req, res)
    })
  })
})

function mergeLocals (res, options) {
  return Object.assign({}, res.locals, options)
}
