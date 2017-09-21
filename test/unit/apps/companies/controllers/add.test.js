const companiesHouseAndLtdCompanies = require('~/test/unit/data/search/companiesHouseAndLtdCompanies')
const companiesHouseCompany = require('~/test/unit/data/companies/companiesHouseCompany')
const displayHouseCompany = require('~/test/unit/data/companies/displayCompaniesHouse')

const next = function (error) {
  throw Error(error)
}

describe('Company add controller', function () {
  let searchLimitedCompaniesStub
  let getDisplayCHStub
  let getCHCompanyStub
  let companyAddController

  beforeEach(function () {
    searchLimitedCompaniesStub = sinon.stub().resolves(companiesHouseAndLtdCompanies)
    getDisplayCHStub = sinon.stub().resolves(displayHouseCompany)
    getCHCompanyStub = sinon.stub().resolves(companiesHouseCompany)

    companyAddController = proxyquire('~/src/apps/companies/controllers/add', {
      '../../search/services': {
        searchLimitedCompanies: searchLimitedCompaniesStub,
      },
      '../repos': {
        getCHCompany: getCHCompanyStub,
      },
      '../services/formatting': {
        getDisplayCH: getDisplayCHStub,
      },
    })
  })

  describe('Get step 1', function () {
    it('should return options for company types', function (done) {
      const req = { session: {} }
      const expected = [
        { label: 'Charity', value: 'Charity' },
        { label: 'Government department', value: 'Government department' },
        { label: 'Intermediary', value: 'Intermediary' },
        { label: 'Limited partnership', value: 'Limited partnership' },
        { label: 'Partnership', value: 'Partnership' },
        { label: 'Sole trader', value: 'Sole trader' },
      ]
      const expectedForeign = [{ value: 'Company', label: 'Company' }, ...expected]
      const res = {
        locals: {},
        render: function (template, options) {
          const allOptions = mergeLocals(res, options)
          expect(allOptions.ukOtherCompanyOptions).to.deep.equal(expected)
          expect(allOptions.foreignOtherCompanyOptions).to.deep.equal(expectedForeign)
          done()
        },
      }

      companyAddController.getAddStepOne(req, res, next)
    })
    it('should return labels for the types and error messages', function (done) {
      const req = { session: {} }
      const res = {
        locals: {},
        render: function (template, options) {
          const allOptions = mergeLocals(res, options)
          expect(allOptions.companyTypeOptions).to.deep.equal({
            ltd: 'UK private or public limited company',
            ltdchild: 'Child of a UK private or public limited company',
            ukother: 'Other type of UK organisation',
            foreign: 'Foreign organisation',
          })
          expect(allOptions.companyDetailsLabels.business_type).to.equal('Business type')
          done()
        },
      }

      companyAddController.getAddStepOne(req, res, next)
    })
    it('should pass through the request body to show previosuly selected options', function (done) {
      const body = { business_type: '1231231231232' }
      const req = { body, session: {} }
      const res = {
        locals: {},
        render: function (template, options) {
          const allOptions = mergeLocals(res, options)
          expect(allOptions.companyTypeOptions).to.deep.equal({
            ltd: 'UK private or public limited company',
            ltdchild: 'Child of a UK private or public limited company',
            ukother: 'Other type of UK organisation',
            foreign: 'Foreign organisation',
          })
          expect(allOptions.company).to.deep.equal(body)
          done()
        },
      }

      companyAddController.getAddStepOne(req, res, next)
    })
  })
  describe('Post step 1', function () {
    describe('forward to next page', function () {
      it('should forward the user to step 2 when adding a uk ltd.', function (done) {
        const req = {
          body: {
            business_type: 'ltd',
          },
          session: {},
        }
        const res = {
          locals: {},
          redirect: function (url) {
            expect(url).to.equal('/companies/add-step-2/?business_type=ltd&country=uk')
            done()
          },
        }
        companyAddController.postAddStepOne(req, res, next)
      })
      it('should forward the user to add screen when adding uk other', function (done) {
        const req = {
          body: {
            business_type: 'ukother',
            business_type_uk_other: 'Charity',
          },
          session: {},
        }
        const res = {
          locals: {},
          redirect: function (url) {
            expect(url).to.equal('/companies/add/ukother?business_type=Charity&country=uk')
            done()
          },
        }
        companyAddController.postAddStepOne(req, res, next)
      })
      it('should forward the user to add screen when adding a foreign company', function (done) {
        const req = {
          body: {
            business_type: 'foreign',
            business_type_for_other: 'Charity',
          },
          session: {},
        }
        const res = {
          locals: {},
          redirect: function (url) {
            expect(url).to.equal('/companies/add/foreign?business_type=Charity&country=non-uk')
            done()
          },
        }
        companyAddController.postAddStepOne(req, res, next)
      })
    })
    describe('errors', function () {
      it('should show an error when no option selected', function (done) {
        const req = {
          body: {},
          session: {},
        }
        const res = {
          locals: {},
          render: function (template, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions.errors.messages).to.have.property('business_type')
            done()
          },
        }
        companyAddController.postAddStepOne(req, res, next)
      })
      it('should show an error if other uk selected but no option selected from the list', function (done) {
        const req = {
          body: {
            business_type: 'ukother',
          },
          session: {},
        }
        const res = {
          locals: {},
          render: function (template, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions.errors.messages).to.have.property('business_type_uk_other')
            done()
          },
        }
        companyAddController.postAddStepOne(req, res, next)
      })
      it('should show an error if foreign selected but no option selected from the list', function (done) {
        const req = {
          body: {
            business_type: 'foreign',
          },
          session: {},
        }
        const res = {
          locals: {},
          render: function (template, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions.errors.messages).to.have.property('business_type_for_other')
            done()
          },
        }
        companyAddController.postAddStepOne(req, res, next)
      })
    })
  })
  describe('Get step 2', function () {
    describe('show initial page', function () {
      it('should render the correct page', function (done) {
        const req = {
          query: {
            business_type: 'ltd',
          },
          session: {},
        }
        const res = {
          locals: {},
          render: function (template, options) {
            expect(template).to.equal('companies/views/add-step-2.njk')
            done()
          },
        }
        companyAddController.getAddStepTwo(req, res, next)
      })
      it('should pass the company type labels', function (done) {
        const req = {
          query: {
            business_type: 'ltd',
          },
          session: {},
        }
        const res = {
          locals: {},
          render: function (template, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions.companyTypeOptions).to.deep.equal({
              ltd: 'UK private or public limited company',
              ltdchild: 'Child of a UK private or public limited company',
              ukother: 'Other type of UK organisation',
              foreign: 'Foreign organisation',
            })
            done()
          },
        }
        companyAddController.getAddStepTwo(req, res, next)
      })
      it('should pass through the query variables', function (done) {
        const req = {
          query: {
            business_type: 'ltd',
          },
          session: {},
        }
        const res = {
          locals: {},
          render: function (template, options) {
            const allOptions = mergeLocals(res, options)
            expect(allOptions.businessType).to.equal('ltd')
            done()
          },
        }
        companyAddController.getAddStepTwo(req, res, next)
      })
    })
    describe('show when search term entered', function () {
      it('should search for the company name entered', function (done) {
        const req = {
          session: {
            token: '1234',
          },
          query: {
            business_type: 'ltd',
            term: 'test',
          },
        }
        const res = {
          locals: {},
          render: function (template, options) {
            expect(searchLimitedCompaniesStub).to.be.calledWith({ searchTerm: 'test', token: '1234' })
            done()
          },
        }
        companyAddController.getAddStepTwo(req, res, next)
      })
      it('should include parsed search results in page', function (done) {
        const req = {
          session: {
            token: '1234',
          },
          query: {
            business_type: 'ltd',
            term: 'test',
          },
        }
        const res = {
          locals: {},
          render: function (template, options) {
            try {
              const allOptions = mergeLocals(res, options)
              const company = allOptions.results.items[0]
              expect(company.name).to.equal('ACHME LIMITED')
              done()
            } catch (error) {
              done(error)
            }
          },
        }
        companyAddController.getAddStepTwo(req, res, next)
      })
      it('should include business information after search in page when selected is blank', function (done) {
        const req = {
          session: {
            token: '1234',
          },
          query: {
            business_type: 'ltd',
            term: 'test',
            selected: '',
          },
        }
        const res = {
          locals: {},
          render: function (template, options) {
            try {
              const allOptions = mergeLocals(res, options)
              expect(allOptions.businessType).to.equal('ltd')
              expect(allOptions.searchTerm).to.equal('test')
              done()
            } catch (error) {
              done(error)
            }
          },
        }
        companyAddController.getAddStepTwo(req, res, next)
      })
      it('should include business information after search in page when selected has a value', function (done) {
        const req = {
          session: {
            token: '1234',
          },
          query: {
            business_type: 'ltd',
            term: 'test',
            selected: '9999',
          },
        }
        const res = {
          locals: {},
          render: function (template, options) {
            try {
              const allOptions = mergeLocals(res, options)
              expect(allOptions.businessType).to.equal('ltd')
              expect(allOptions.searchTerm).to.equal('test')
              done()
            } catch (error) {
              done(error)
            }
          },
        }
        companyAddController.getAddStepTwo(req, res, next)
      })
    })
    describe('show when a company is selected', function () {
      it('should fetch the ch company', function (done) {
        const req = {
          session: {
            token: '1234',
          },
          query: {
            business_type: 'ltd',
            term: 'test',
            selected: '08311441',
          },
        }
        const res = {
          locals: {},
          render: function (template, options) {
            expect(getCHCompanyStub).to.be.calledWith('1234', '08311441')
            done()
          },
        }
        companyAddController.getAddStepTwo(req, res, next)
      })
    })
  })
})

function mergeLocals (res, options) {
  return Object.assign({}, res.locals, options)
}
