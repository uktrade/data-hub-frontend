const { sortBy } = require('lodash')

const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')
const companiesHouseAndLtdCompanies = require('~/test/unit/data/search/companiesHouseAndLtdCompanies')
const companiesHouseCompany = require('~/test/unit/data/companies/companies-house-company')
const config = require('~/config')

const next = function (error) {
  throw Error(error)
}

const metaDataMock = {
  businessTypeOptions: [
    { name: 'Not Expected', id: '33243434-343656' },
    { name: 'Charity', id: '9dd14e94-5d95-e211-a939-e4115bead28a' },
    { name: 'Government Dept', id: '9cd14e94-5d95-e211-a939-e4115bead28a' },
    { name: 'Intermediary', id: '9bd14e94-5d95-e211-a939-e4115bead28a' },
    { name: 'Limited partnership', id: '8b6eaf7e-03e7-e611-bca1-e4115bead28a' },
    { name: 'Partnership', id: '9ad14e94-5d95-e211-a939-e4115bead28a' },
    { name: 'Sole Trader', id: '99d14e94-5d95-e211-a939-e4115bead28a' },
    { name: 'UK branch of foreign company (BR)', id: 'b0730fc6-fcce-4071-bdab-ba8de4f4fc98' },
    { name: 'Company', id: '98d14e94-5d95-e211-a939-e4115bead28a' },
    { name: 'Random', id: '34343434-343656' },
  ],
}

describe('Company add controller', () => {
  let searchLimitedCompaniesStub
  let getCHCompanyStub
  let companyAddController

  beforeEach(() => {
    searchLimitedCompaniesStub = sinon.stub().resolves(companiesHouseAndLtdCompanies)
    getCHCompanyStub = sinon.stub().resolves(companiesHouseCompany)

    this.nextStub = sinon.stub()

    companyAddController = proxyquire('~/src/apps/companies/controllers/add', {
      '../../../modules/search/services': {
        searchLimitedCompanies: searchLimitedCompaniesStub,
      },
      '../repos': {
        getCHCompany: getCHCompanyStub,
      },
    })
  })

  describe('Get step 1', () => {
    beforeEach(() => {
      nock(config.apiRoot)
        .get('/metadata/business-type/')
        .twice().reply(200, metaDataMock.businessTypeOptions)
    })

    it('should return options for company types', async function () {
      const req = { session: {} }
      const expected = [
        { label: 'Charity', value: '9dd14e94-5d95-e211-a939-e4115bead28a' },
        { label: 'Government Dept', value: '9cd14e94-5d95-e211-a939-e4115bead28a' },
        { label: 'Intermediary', value: '9bd14e94-5d95-e211-a939-e4115bead28a' },
        { label: 'Limited partnership', value: '8b6eaf7e-03e7-e611-bca1-e4115bead28a' },
        { label: 'Partnership', value: '9ad14e94-5d95-e211-a939-e4115bead28a' },
        { label: 'Sole Trader', value: '99d14e94-5d95-e211-a939-e4115bead28a' },
      ]
      const expectedUk = [
        ...expected,
        { label: 'UK branch of foreign company (BR)', value: 'b0730fc6-fcce-4071-bdab-ba8de4f4fc98' },
      ]
      const expectedForeign = [
        ...expected,
        { label: 'Company', value: '98d14e94-5d95-e211-a939-e4115bead28a' },
      ]
      const res = {
        locals: {},
        render: function (template, options) {
          const allOptions = mergeLocals(res, options)
          expect(allOptions.ukOtherCompanyOptions).to.deep.equal(expectedUk)
          expect(allOptions.foreignOtherCompanyOptions).to.deep.equal(sortBy(expectedForeign, 'label'))
        },
      }

      await companyAddController.renderAddStepOne(req, res, this.nextStub)
    })
    it('should return labels for the types and error messages', async function () {
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
        },
      }

      await companyAddController.renderAddStepOne(req, res, this.nextStub)
    })
    it('should pass through the request body to show previosuly selected options', async function () {
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
        },
      }

      await companyAddController.renderAddStepOne(req, res, this.nextStub)
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

  describe('#renderAddStepTwo', () => {
    beforeEach(() => {
      this.middlewareParameters = buildMiddlewareParameters({})

      companyAddController.renderAddStepTwo(this.middlewareParameters.reqMock, this.middlewareParameters.resMock)
    })

    it('should render once', () => {
      expect(this.middlewareParameters.resMock.render).to.be.calledOnce
    })

    it('should render the correct template', () => {
      expect(this.middlewareParameters.resMock.render.firstCall.args[0]).to.equal('companies/views/add-step-2')
    })

    it('should render a heading', () => {
      expect(this.middlewareParameters.resMock.render.firstCall.args[1]).to.deep.equal({
        heading: 'Add company',
      })
    })
  })
})

function mergeLocals (res, options) {
  return Object.assign({}, res.locals, options)
}
