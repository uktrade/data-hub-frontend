const companiesHouseAndLtdCompanies = require('~/test/unit/data/search/companiesHouseAndLtdCompanies')
const companiesHouseCompany = require('~/test/unit/data/companies/companies-house-company')
const displayHouseCompany = require('~/test/unit/data/companies/display-companies-house')

const next = function (error) {
  throw Error(error)
}

const mockMetadataRepository = {
  businessTypeOptions: [
    { name: 'Not Expected', id: '33243434-343656' },
    { name: 'Charity', id: '1234-5678' },
    { name: 'Government Dept', id: '3434-343' },
    { name: 'Intermediary', id: '5656-5656' },
    { name: 'Limited partnership', id: '7878-7878' },
    { name: 'Partnership', id: '8989-898-9' },
    { name: 'Sole Trader', id: '3434-5656' },
    { name: 'Company', id: '1212-3454567' },
    { name: 'Random', id: '34343434-343656' },
  ],
}

describe('Company add controller', () => {
  let searchLimitedCompaniesStub
  let getDisplayCHStub
  let getCHCompanyStub
  let companyAddController

  beforeEach(() => {
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
      '../options': proxyquire('~/src/apps/companies/options.js', {
        '../../lib/metadata': mockMetadataRepository,
      }),
    })
  })

  describe('Get step 1', () => {
    it('should return options for company types', function (done) {
      const req = { session: {} }
      const expected = [
        { label: 'Charity', value: '1234-5678' },
        { label: 'Government department', value: '3434-343' },
        { label: 'Intermediary', value: '5656-5656' },
        { label: 'Limited partnership', value: '7878-7878' },
        { label: 'Partnership', value: '8989-898-9' },
        { label: 'Sole trader', value: '3434-5656' },
      ]
      const expectedForeign = [ ...expected, { label: 'Company', value: '1212-3454567' } ]
      const res = {
        locals: {},
        render: function (template, options) {
          const allOptions = mergeLocals(res, options)
          expect(allOptions.ukOtherCompanyOptions).to.deep.equal(expected)
          expect(allOptions.foreignOtherCompanyOptions).to.deep.equal(expectedForeign)
          done()
        },
      }

      companyAddController.renderAddStepOne(req, res, next)
    })
    it('should return labels for the types and error messages', function (done) {
      const req = { session: {} }
      const res = {
        locals: {},
        render: function (template, options) {
          const allOptions = mergeLocals(res, options)
          expect(allOptions.companyTypeOptions).to.deep.equal({
            ltd: 'UK private or public limited company',
            ukother: 'Other type of UK organisation',
            foreign: 'Foreign organisation',
          })
          expect(allOptions.companyDetailsLabels.business_type).to.equal('Business type')
          done()
        },
      }

      companyAddController.renderAddStepOne(req, res, next)
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
            ukother: 'Other type of UK organisation',
            foreign: 'Foreign organisation',
          })
          expect(allOptions.company).to.deep.equal(body)
          done()
        },
      }

      companyAddController.renderAddStepOne(req, res, next)
    })
  })
  describe('Post step 1', () => {
    describe('forward to next page', () => {
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
            expect(url).to.equal('/companies/add-step-2?business_type=ltd&country=uk')
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
            expect(url).to.equal('/companies/add?business_type=Charity&country=uk')
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
            expect(url).to.equal('/companies/add?business_type=Charity&country=non-uk')
            done()
          },
        }
        companyAddController.postAddStepOne(req, res, next)
      })
    })
    describe('errors', () => {
      it('should show an error when no option selected', function (done) {
        const req = {
          body: {},
          session: {},
        }
        const res = {
          locals: {},
        }
        companyAddController.postAddStepOne(req, res, () => {
          expect(res.locals.errors.messages).to.have.property('business_type')
          done()
        })
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
        }
        companyAddController.postAddStepOne(req, res, () => {
          expect(res.locals.errors.messages).to.have.property('business_type_uk_other')
          done()
        })
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
        }
        companyAddController.postAddStepOne(req, res, () => {
          expect(res.locals.errors.messages).to.have.property('business_type_for_other')
          done()
        })
      })
    })
  })
})

function mergeLocals (res, options) {
  return Object.assign({}, res.locals, options)
}
