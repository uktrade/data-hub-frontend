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

describe('Company controller, getEdit', function () {
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
        ],
        countryOptions: [
          { id: '9999', name: 'United Kingdom' },
          { id: '12344', name: 'France' }
        ]
      },
      '../repositorys/companyrepository': fakeCompanyRepository
    })
  })

  describe('pick edit form', function () {
    it('should render the uk ltd form for records with companies house data', function (done) {
      const req = { session: {} }
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
        },
        session: {}
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
      const req = { session: {} }
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
        },
        session: {}
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
      const req = { session: {} }
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
      const req = { session: {} }
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
      const req = { session: {} }
      const res = {
        locals: { company },
        render: function (url, options) {
          const allOptions = mergeLocals(res, options)
          expect(allOptions).to.have.property('companyDetailsLabels')
          expect(allOptions).to.have.property('hqLabels')
          done()
        }
      }
      companyController.editDetails(req, res)
    })
    it('should include formatted CH data if CH data is present', function (done) {
      const req = { session: {} }
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
    it('should include the business type and uk based indicator', function (done) {
      const req = { session: {} }
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
      const req = { session: {} }
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
      const req = { session: {} }
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
      const req = { session: {} }
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
    it('should include the id for the united kingdom when editing a uk none ltd', function (done) {
      const req = {
        query: {
          business_type: 'Charity',
          country: 'uk'
        },
        session: {}
      }
      const res = {
        locals: {},
        render: function (url, options) {
          const allOptions = mergeLocals(res, options)
          expect(allOptions.unitedKingdom).to.eq('9999')
          expect(allOptions.uk_based).to.equal(true)
          done()
        }
      }
      companyController.editDetails(req, res)
    })
  })
  describe('edit ltd company markup', function () {
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
        chDetails: {
          name: 'fred',
          company_number: '1234',
          registered_address: '10 the street',
          business_type: 'Ltd',
          company_status: 'Active',
          sic_code: '1234 - Thing'
        },
        chDetailsDisplayOrder: ['name', 'company_number', 'registered_address', 'business_type', 'company_status', 'sic_code'],
        chDetailsLabels: {
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
      expect(document.querySelector('[type=hidden][name=company_number]').value).to.equal('1234')
      expect(document.querySelector('[type=hidden][name=business_type]').value).to.equal('1111')
      expect(document.querySelector('[type=hidden][name=uk_based]').value).to.equal('true')
      expect(document.querySelector('[type=hidden][name=name]').value).to.equal('Freds test company')
      expect(document.querySelector('[type=hidden][name=registered_address_1]').value).to.equal('address1')
      expect(document.querySelector('[type=hidden][name=registered_address_2]').value).to.equal('address2')
      expect(document.querySelector('[type=hidden][name=registered_address_3]').value).to.equal('address3')
      expect(document.querySelector('[type=hidden][name=registered_address_4]').value).to.equal('address4')
      expect(document.querySelector('[type=hidden][name=registered_address_town]').value).to.equal('addresstown')
      expect(document.querySelector('[type=hidden][name=registered_address_county]').value).to.equal('addresscounty')
      expect(document.querySelector('[type=hidden][name=registered_address_postcode]').value).to.equal('addresspostcode')
      expect(document.querySelector('[type=hidden][name=registered_address_country]').value).to.equal('4444')
    })
    it('should include all the fields from the design (hidden and visible) for a ltd company', function () {
      expect(document.querySelector('[type=text][name=alias]')).to.not.be.null
      expect(document.querySelector('[type=text][name=trading_address_1]')).to.not.be.null
      expect(document.querySelector('[type=text][name=trading_address_2]')).to.not.be.null
      expect(document.querySelector('[type=text][name=trading_address_town]')).to.not.be.null
      expect(document.querySelector('[type=text][name=trading_address_county]')).to.not.be.null
      expect(document.querySelector('[type=text][name=trading_address_postcode]')).to.not.be.null
      expect(document.querySelector('[name=trading_address_country]')).to.not.be.null
      expect(document.querySelector('select[name=uk_region]')).to.not.be.null
      expect(document.querySelector('[type=radio][name=headquarters]')).to.not.be.null
      expect(document.querySelector('select[name=sector]')).to.not.be.null
      expect(document.querySelector('[type=text][name=website]')).to.not.be.null
      expect(document.querySelector('textarea[name=description]')).to.not.be.null
      expect(document.querySelector('select[name=employee_range]')).to.not.be.null
      expect(document.querySelector('select[name=turnover_range]')).to.not.be.null
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
        chDetails: {
          name: 'fred',
          company_number: '1234',
          registered_address: '10 the street',
          business_type: 'Ltd',
          company_status: 'Active',
          sic_code: '1234 - Thing'
        },
        chDetailsDisplayOrder: ['name', 'company_number', 'registered_address', 'business_type', 'company_status', 'sic_code'],
        chDetailsLabels: {
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
  describe('edit none ltd company markup', function () {
    let document
    let markup

    beforeEach(function (done) {
      markup = nunjucks.render('../../src/views/company/edit-ukother.html', {
        business_type: { id: '1111', name: 'Government dept' },
        company: {
          countryOptions: [{id: 1, name: 'country'}],
          company_number: null,
          companies_house_data: null
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

    it('should include all the fields from the design (hidden and visible) for a ltd company', function () {
      expect(document.querySelector('[type=text][name=company_number]')).to.be.null
      expect(document.querySelector('[type=hidden][name=business_type]')).to.not.be.null
      expect(document.querySelector('[type=hidden][name=uk_based]')).to.not.be.null
      expect(document.querySelector('[type=text][name=name]')).to.not.be.null
      expect(document.querySelector('[type=text][name=registered_address_1]')).to.not.be.null
      expect(document.querySelector('[type=text][name=registered_address_2]')).to.not.be.null
      expect(document.querySelector('[type=text][name=registered_address_town]')).to.not.be.null
      expect(document.querySelector('[type=text][name=registered_address_county]')).to.not.be.null
      expect(document.querySelector('[type=text][name=registered_address_postcode]')).to.not.be.null
      expect(document.querySelector('[type=hidden][name=registered_address_country]')).to.not.be.null
      expect(document.querySelector('[type=text][name=alias]')).to.not.be.null
      expect(document.querySelector('[type=text][name=trading_address_1]')).to.not.be.null
      expect(document.querySelector('[type=text][name=trading_address_2]')).to.not.be.null
      expect(document.querySelector('[type=text][name=trading_address_town]')).to.not.be.null
      expect(document.querySelector('[type=text][name=trading_address_county]')).to.not.be.null
      expect(document.querySelector('[type=text][name=trading_address_postcode]')).to.not.be.null
      expect(document.querySelector('[type=hidden][name=trading_address_country]')).to.not.be.null
      expect(document.querySelector('select[name=uk_region]')).to.not.be.null
      expect(document.querySelector('[type=radio][name=headquarters]')).to.not.be.null
      expect(document.querySelector('select[name=sector]')).to.not.be.null
      expect(document.querySelector('[type=text][name=website]')).to.not.be.null
      expect(document.querySelector('textarea[name=description]')).to.not.be.null
      expect(document.querySelector('select[name=employee_range]')).to.not.be.null
      expect(document.querySelector('select[name=turnover_range]')).to.not.be.null
    })
    it('should not display the companies house data above the form', function () {
      expect(document.querySelector('#ch-details')).to.be.null
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
        chDetails: {
          name: 'fred',
          company_number: '1234',
          registered_address: '10 the street',
          business_type: 'Ltd',
          company_status: 'Active',
          sic_code: '1234 - Thing'
        },
        chDetailsDisplayOrder: ['name', 'company_number', 'registered_address', 'business_type', 'company_status', 'sic_code'],
        chDetailsLabels: {
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

function mergeLocals (res, options) {
  return Object.assign({}, res.locals, options)
}
