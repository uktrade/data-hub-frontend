/* globals expect: true, describe: true, it: true, beforeEach: true */
const proxyquire = require('proxyquire')

describe('Company controller, getCommon', function () {
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
    getSource = null
    getId = null
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
          getSource = source
          getId = id
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

  it('should generate a url to archive if the company is not archived and not showing archive form', function (done) {
    fakeCompany.archived = false

    const req = {
      protocol: 'http',
      baseUrl: '/thing/thing',
      get: function () {
        return 'localhost'
      },
      params: {
        sourceId: '1234',
        sourcce: 'company_company'
      },
      query: {},
      session: {
        token: '4444'
      }
    }
    const res = {
      locals: {}
    }
    const next = function () {
      expect(res.locals).to.have.property('archiveUrl')
      done()
    }
    companyController.getCommon(req, res, next)
  })
  it('should generate a url to cancel archive if the company is not archived and showing archive form', function (done) {
    fakeCompany.archived = false

    const req = {
      protocol: 'http',
      baseUrl: '/thing/thing',
      get: function () {
        return 'localhost'
      },
      params: {
        sourceId: '1234',
        sourcce: 'company_company'
      },
      query: {
        archive: true
      },
      session: {
        token: '4444'
      }
    }
    const res = {
      locals: {}
    }
    const next = function () {
      expect(res.locals).to.not.have.property('archiveUrl')
      expect(res.locals).to.have.property('cancelArchiveUrl')
      done()
    }
    companyController.getCommon(req, res, next)
  })
  it('should not generate a url to archive a company if the comanay is marked as archived', function (done) {
    fakeCompany.archived = true

    const req = {
      protocol: 'http',
      baseUrl: '/thing/thing',
      get: function () {
        return 'localhost'
      },
      params: {
        sourceId: '1234',
        sourcce: 'company_company'
      },
      query: {
        archive: true
      },
      session: {
        token: '4444'
      }
    }
    const res = {
      locals: {}
    }
    const next = function () {
      expect(res.locals).to.not.have.property('archiveUrl')
      expect(res.locals).to.not.have.property('cancelArchiveUrl')
      done()
    }
    companyController.getCommon(req, res, next)
  })
  it('should generate a url to un-archive if the company is marked as archived', function (done) {
    fakeCompany.archived = true

    const req = {
      protocol: 'http',
      baseUrl: '/thing/thing',
      get: function () {
        return 'localhost'
      },
      params: {
        sourceId: '1234',
        sourcce: 'company_company'
      },
      query: {
        archive: true
      },
      session: {
        token: '4444'
      }
    }
    const res = {
      locals: {}
    }
    const next = function () {
      expect(res.locals).to.have.property('unarchiveUrl')

      done()
    }
    companyController.getCommon(req, res, next)
  })
})
