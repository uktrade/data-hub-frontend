/* globals expect: true, describe: true, it: true, beforeEach: true */
const proxyquire = require('proxyquire')
const nunjucks = require('nunjucks')
const jsdom = require('jsdom')
const filters = require('@uktrade/trade_elements/dist/nunjucks/filters')

nunjucks.configure('views')
const nunenv = nunjucks.configure([`${__dirname}/../../src/views`, `${__dirname}/../../node_modules/@uktrade/trade_elements/dist/nunjucks`], {
  autoescape: true
})

Object.keys(filters).forEach((filterName) => {
  nunenv.addFilter(filterName, filters[filterName])
})

describe('Company controller', function () {
  const fakeCompanyRepository = {
    saveCompany: function (token, company) {
      return new Promise((resolve) => {
        resolve(company)
      })
    }
  }

  let fakeCompany = {
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

  const companyController = proxyquire('../../src/controllers/companycontroller', {
    '../services/searchservice': {
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

  describe('get edit screen', function () {
    describe('pick edit form', function () {
      it('should render the uk ltd form for records with companies house data', function (done) {
        const req = {}
        const res = {
          locals: {
            company: {
              id: '1234',
              company_number: '1111',
              companies_house_data: {
                company_category: 'Private Limited Company',
                name: 'Test company'
              }
            }
          },
          render: function (url, options) {
            expect(url).to.equal('company/edit-ltd')
            done()
          }
        }
        companyController.editDetails(req, res)
      })
      it('should render the uk other form for new UK Other company', function (done) {
        const req = {
          query: {
            business_type: 'Charity',
            country: 'uk'
          }
        }
        const res = {
          locals: {
            company: null
          },
          render: function (url, options) {
            expect(url).to.equal('company/edit-ukother')
            done()
          }
        }
        companyController.editDetails(req, res)
      })
      it('should render the uk other form for an existing UK company without companies house data', function (done) {
        const req = {}
        const res = {
          locals: {
            company: {
              id: '1234',
              company_number: null,
              business_type: {
                'id': '9dd14e94-5d95-e211-a939-e4115bead28a',
                'name': 'Charity'
              },
              uk_based: true
            }
          },
          render: function (url, options) {
            expect(url).to.equal('company/edit-ukother')
            done()
          }
        }
        companyController.editDetails(req, res)
      })
      it('should render the non uk form for new none uk company', function (done) {
        const req = {
          query: {
            business_type: 'Charity',
            country: 'non-uk'
          }
        }
        const res = {
          locals: {
            company: null
          },
          render: function (url, options) {
            expect(url).to.equal('company/edit-nonuk')
            done()
          }
        }
        companyController.editDetails(req, res)
      })
      it('should render the non uk form for existing none uk company', function (done) {
        const req = {}
        const res = {
          locals: {
            company: {
              id: '1234',
              company_number: null,
              business_type: {
                'id': '9dd14e94-5d95-e211-a939-e4115bead28a',
                'name': 'Charity'
              },
              uk_based: false
            }
          },
          render: function (url, options) {
            expect(url).to.equal('company/edit-nonuk')
            done()
          }
        }
        companyController.editDetails(req, res)
      })
    })
    describe('include data for edit screen', function (done) {
      const company = {
        id: '1234',
        company_number: '1111',
        companies_house_data: {
          company_category: 'Private Limited Company',
          company_number: '1111',
          name: 'Test company'
        }
      }

      it('should include option data', function (done) {
        const req = {}
        const res = {
          locals: { company },
          render: function (url, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions).to.have.property('regionOptions')
            expect(allOptions).to.have.property('sectorOptions')
            expect(allOptions).to.have.property('employeeOptions')
            expect(allOptions).to.have.property('turnoverOptions')
            expect(allOptions).to.have.property('countryOptions')
            expect(allOptions).to.have.property('headquarterOptions')
            done()
          }
        }
        companyController.editDetails(req, res)
      })
      it('should include labels', function (done) {
        const req = {}
        const res = {
          locals: { company },
          render: function (url, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions).to.have.property('companyDetailLabels')
            expect(allOptions).to.have.property('hqLabels')
            done()
          }
        }
        companyController.editDetails(req, res)
      })
      it('should include formatted CH data if CH data is present', function (done) {
        const req = {}
        const res = {
          locals: { company },
          render: function (url, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions).to.have.property('chDisplay')
            expect(allOptions).to.have.property('chDetailLabels')
            expect(allOptions).to.have.property('chDetailDisplayOrder')
            done()
          }
        }
        companyController.editDetails(req, res)
      })
      it('should include the business type and uk based indicator', function (done) {
        const req = {}
        const res = {
          locals: { company },
          render: function (url, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions).to.have.property('business_type')
            expect(allOptions).to.have.property('uk_based')
            expect(allOptions.business_type).to.deep.equal({
              id: '6f75408b-03e7-e611-bca1-e4115bead28a',
              name: 'Private limited company',
              selectable: true
            })
            done()
          }
        }
        companyController.editDetails(req, res)
      })
      it('should indicate to hide the trading address', function (done) {
        const req = {}
        const res = {
          locals: { company },
          render: function (url, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions.showTradingAddress).to.be.false
            done()
          }
        }
        companyController.editDetails(req, res)
      })
      it('should indicate theres a trading address', function (done) {
        company.trading_address_country = { id: '1234', name: 'Spain' }
        const req = {}
        const res = {
          locals: { company },
          render: function (url, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions.showTradingAddress).to.be.true
            done()
          }
        }
        companyController.editDetails(req, res)
      })
      it('should indicate there is not a trading address', function (done) {
        company.trading_address_country = null
        const req = {}
        const res = {
          locals: { company },
          render: function (url, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions.showTradingAddress).to.not.be.true
            done()
          }
        }
        companyController.editDetails(req, res)
      })
    })
    describe('edit markup', function () {
      describe('new ltd company', function () {
        let document
        let markup

        beforeEach(function (done) {
          markup = nunjucks.render('../../src/views/company/edit-ltd.html', {
            business_type: { id: '1111', name: 'Private limited company' },
            company: {
              countryOptions: [{id: 1, name: 'country'}],
              company_number: '1234',
              companies_house_data: {
                name: 'Freds test company',
                registered_address_1: 'address1',
                registered_address_2: 'address2',
                registered_address_3: 'address3',
                registered_address_4: 'address4',
                registered_address_town: 'addresstown',
                registered_address_county: 'addresscounty',
                registered_address_postcode: 'addresspostcode',
                registered_address_country: {
                  id: '4444',
                  name: 'United Kingdom'
                }
              }
            },
            chDisplay: {
              name: 'fred',
              'company_number': '1234',
              'registered_address': '10 the street',
              'business_type': 'Ltd',
              'company_status': 'Active',
              'sic_code': '1234 - Thing'
            },
            chDetailsDisplayOrder: ['name', 'company_number', 'registered_address', 'business_type', 'company_status', 'sic_code'],
            chDetailLabels: {
              name: 'Registered company name',
              company_number: 'Companies House number',
              registered_address: 'Registered office address',
              business_type: 'Company type',
              company_status: 'Company status',
              sic_code: 'Nature of business (SIC)',
              incorporation_date: 'Incorporation date'
            },
            csrfToken: '2222',
            showTradingAddress: false
          })

          jsdom.env(markup, (err, jsdomWindow) => {
            if (err) {
              throw new Error(err)  // eslint-disable-line no-new
            }

            document = jsdomWindow.document
            done()
          })
        })

        it('should include companies house data as hidden defaults in a uk ltd edit form', function () {
          expect(document.querySelector('[name=company_number]').value).to.equal('1234')
          expect(document.querySelector('[name=business_type]').value).to.equal('1111')
          expect(document.querySelector('[name=uk_based]').value).to.equal('true')
          expect(document.querySelector('[name=name]').value).to.equal('Freds test company')
          expect(document.querySelector('[name=registered_address_1]').value).to.equal('address1')
          expect(document.querySelector('[name=registered_address_2]').value).to.equal('address2')
          expect(document.querySelector('[name=registered_address_3]').value).to.equal('address3')
          expect(document.querySelector('[name=registered_address_4]').value).to.equal('address4')
          expect(document.querySelector('[name=registered_address_town]').value).to.equal('addresstown')
          expect(document.querySelector('[name=registered_address_county]').value).to.equal('addresscounty')
          expect(document.querySelector('[name=registered_address_postcode]').value).to.equal('addresspostcode')
          expect(document.querySelector('[name=registered_address_country]').value).to.equal('4444')
        })
        it('should include all the fields from the design (hidden and visible) for a ltd company', function () {
          expect(document.querySelector('[name=alias]')).to.not.be.null
          expect(document.querySelector('[name=trading_address_1]')).to.not.be.null
          expect(document.querySelector('[name=trading_address_2]')).to.not.be.null
          expect(document.querySelector('[name=trading_address_town]')).to.not.be.null
          expect(document.querySelector('[name=trading_address_county]')).to.not.be.null
          expect(document.querySelector('[name=trading_address_postcode]')).to.not.be.null
          expect(document.querySelector('[name=trading_address_country]')).to.not.be.null
          expect(document.querySelector('[name=uk_region]')).to.not.be.null
          expect(document.querySelector('[name=headquarters]')).to.not.be.null
          expect(document.querySelector('[name=sector]')).to.not.be.null
          expect(document.querySelector('[name=website]')).to.not.be.null
          expect(document.querySelector('[name=description]')).to.not.be.null
          expect(document.querySelector('[name=employee_range]')).to.not.be.null
          expect(document.querySelector('[name=turnover_range]')).to.not.be.null
        })
        it('should display the companies house data above the form', function () {
          const chDetailElement = document.querySelector('#ch-details')
          const chDetails = chDetailElement.textContent
          expect(chDetails).to.not.be.null
          expect(chDetails).to.include('fred')
          expect(chDetails).to.include('1234')
          expect(chDetails).to.include('10 the street')
          expect(chDetails).to.include('Ltd')
        })
        it('should hide the trading address section by default and include a button to show it', function () {
          expect(document.querySelector('#trading-address-wrapper').className).to.include('hidden')
          expect(document.querySelector('#add-trading-address').className).to.not.include('hidden')
          expect(document.querySelector('#remove-trading-address').className).to.include('hidden')
        })
        it('should show the trading address section and include the remove button if there is one', function (done) {
          markup = nunjucks.render('../../src/views/company/edit-ltd.html', {
            business_type: { id: '1111', name: 'Private limited company' },
            company: {
              countryOptions: [{id: 1, name: 'country'}],
              company_number: '1234',
              companies_house_data: {
                name: 'Freds test company',
                registered_address_1: 'address1',
                registered_address_2: 'address2',
                registered_address_3: 'address3',
                registered_address_4: 'address4',
                registered_address_town: 'addresstown',
                registered_address_county: 'addresscounty',
                registered_address_postcode: 'addresspostcode',
                registered_address_country: 'addresscountry'
              }
            },
            chDisplay: {
              name: 'fred',
              'company_number': '1234',
              'registered_address': '10 the street',
              'business_type': 'Ltd',
              'company_status': 'Active',
              'sic_code': '1234 - Thing'
            },
            chDetailsDisplayOrder: ['name', 'company_number', 'registered_address', 'business_type', 'company_status', 'sic_code'],
            chDetailLabels: {
              name: 'Registered company name',
              company_number: 'Companies House number',
              registered_address: 'Registered office address',
              business_type: 'Company type',
              company_status: 'Company status',
              sic_code: 'Nature of business (SIC)',
              incorporation_date: 'Incorporation date'
            },
            csrfToken: '2222',
            showTradingAddress: true
          })

          jsdom.env(markup, (err, jsdomWindow) => {
            if (err) {
              throw new Error(err)  // eslint-disable-line no-new
            }

            document = jsdomWindow.document
            expect(document.querySelector('#trading-address-wrapper').className).to.not.include('hidden')
            expect(document.querySelector('#add-trading-address').className).to.include('hidden')
            expect(document.querySelector('#remove-trading-address').className).to.not.include('hidden')
            done()
          })

          expect(document.querySelector('#trading-address-wrapper').className).to.include('hidden')
          expect(document.querySelector('#add-trading-address').className).to.not.include('hidden')
          expect(document.querySelector('#remove-trading-address').className).to.include('hidden')
        })
      })
    })
  })
  describe('post edit screen', function () {
    describe('handle bad data', function () {
      fakeCompany = {
        id: null,
        company_number: '1234',
        companies_house_data: {
          company_number: '1234',
          company_category: 'Private Limited Company',
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

      fakeCompanyRepository.saveCompany = function (token, company) {
        return new Promise((resolve, reject) => {
          reject({
            errors: [{thing: ['error']}]
          })
        })
      }

      const body = {
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

      it('should convert a form back to a company object if there are errors', function (done) {
        const req = {
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
            expect(allOptions.company).to.have.property('companies_house_data')
            expect(allOptions.company.companies_house_data.company_number).to.equal('1234')
            done()
          }
        }
        companyController.postDetails(req, res)
      })
      it('should include errors in the form when posting bad data', function (done) {
        const req = {
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
})

function mergeLocals (res, options) {
  return Object.assign({}, res.locals, options)
}
