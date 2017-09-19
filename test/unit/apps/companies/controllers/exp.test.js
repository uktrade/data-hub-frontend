/* eslint camelcase: 0 */
const controllerUtils = require('~/src/lib/controller-utils')
const _company = require('~/test/unit/data/api-response-intermediary-company.json')

describe('Company export controller', () => {
  beforeEach(() => {
    this.company = Object.assign({}, _company, {
      export_to_countries: [{ id: '1234', name: 'France' }, { id: '2234', name: 'Italy' }],
      future_interest_countries: [{ id: '4321', name: 'Germany' }],
    })

    this.sandbox = sinon.sandbox.create()
    this.next = function (error) {
      console.log(error)
    }
    this.getDitCompany = this.sandbox.stub().resolves(this.company)
    this.saveCompany = this.sandbox.stub().resolves(this.company)
    this.flattenIdFields = this.sandbox.spy(controllerUtils, 'flattenIdFields')
    this.getCommonTitlesAndlinks = this.sandbox.stub()
    this.breadcrumbsStub = function () {
      return this
    }

    this.companyExportController = proxyquire('~/src/apps/companies/controllers/exp', {
      '../services/data': {
        getCommonTitlesAndlinks: this.getCommonTitlesAndlinks,
      },
      '../repos': {
        getDitCompany: this.getDitCompany,
        saveCompany: this.saveCompany,
      },
      '../../../lib/metadata': {
        countryOptions: [{
          id: '1234',
          name: 'France',
        }],
      },
      '../../../../lib/controller-utils': {
        flattenIdFields: this.flattenIdFields,
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('common', () => {
    it('should include the section title', () => {
      this.locals = { id: 'test' }
      const req = {
        session: {
          token: '1234',
        },
        params: {
          id: this.company.id,
        },
      }

      const res = {
        locals: {},
        breadcrumb: this.breadcrumbsStub,
      }

      return this.companyExportController.common(req, res)
        .then(() => {
          expect(res.locals.tab).to.equal('exports')
        })
    })
    it('should include a copy of the company', () => {
      this.locals = { id: 'test' }
      const req = {
        session: {
          token: '1234',
        },
        params: {
          id: this.company.id,
        },
      }

      const res = {
        locals: {},
        breadcrumb: this.breadcrumbsStub,
      }

      return this.companyExportController.common(req, res)
        .then(() => {
          expect(this.getDitCompany).to.be.calledWith('1234', this.company.id)
          expect(res.locals.company).to.deep.equal(this.company)
        })
    })
    it('should get the common page titles needed for the layout', () => {
      this.locals = { id: 'test' }
      const req = {
        session: {
          token: '1234',
        },
        params: {
          id: this.company.id,
        },
      }

      const res = {
        locals: {},
        breadcrumb: this.breadcrumbsStub,
      }

      return this.companyExportController.common(req, res)
        .then(() => {
          expect(this.getCommonTitlesAndlinks).to.be.called
        })
    })
  })

  describe('view', () => {
    it('should return a list of countries currently exporting to and want to export to', (done) => {
      this.companyExportController.view({
        session: {
          token: '1234',
        },
        params: {
          id: this.company.id,
        },
      }, {
        locals: {
          company: this.company,
        },
        breadcrumb: this.breadcrumbsStub,
        render: (template, data) => {
          expect(data.exportDetails).to.deep.equal({
            exportToCountries: 'France, Italy',
            futureInterestCountries: 'Germany',
          })
          done()
        },
      }, this.next)
    })

    it('should return empty strings when no value', (done) => {
      this.company.export_to_countries = []
      this.companyExportController = proxyquire('~/src/apps/companies/controllers/exp', {
        '../repos': {
          getDitCompany: this.getDitCompany,
          saveCompany: this.saveCompany,
        },
        '../../../../lib/controller-utils': {
          flattenIdFields: this.flattenIdFields,
        },
      })

      const req = {
        session: {
          token: '1234',
        },
        params: {
          id: this.company.id,
        },
      }
      const res = {
        locals: {
          company: this.company,
        },
        breadcrumb: this.breadcrumbsStub,
        render: (template, data) => {
          expect(data.exportDetails.exportToCountries).to.equal('')
          done()
        },
      }

      this.next = function (error) {
        console.log(error)
      }

      this.companyExportController.view(req, res, this.next)
    })

    it('should include display order and labels', (done) => {
      this.companyExportController.view({
        session: {
          token: '1234',
        },
        params: {
          id: this.company.id,
        },
      }, {
        locals: {
          company: this.company,
        },
        breadcrumb: this.breadcrumbsStub,
        render: (template, data) => {
          expect(data).to.have.property('exportDetailsDisplayOrder')
          expect(data).to.have.property('exportDetailsLabels')
          done()
        },
      }, this.next)
    })
  })

  describe('edit', () => {
    it('should pass through form data if called after an error', (done) => {
      const export_to_countries = ['111', '222']
      const future_interest_countries = '1234'

      this.companyExportController.edit({
        session: {
          token: '1234',
        },
        body: {
          export_to_countries,
          future_interest_countries,
        },
        params: {
          id: '1234',
        },
      }, {
        locals: {},
        breadcrumb: this.breadcrumbsStub,
        render: (template, data) => {
          expect(data.export_to_countries).to.deep.equal(export_to_countries)
          expect(data.future_interest_countries).to.deep.equal(future_interest_countries)
          done()
        },
      }, this.next)
    })

    it('parse company export data into a form format if called for first time', (done) => {
      this.companyExportController.edit({
        session: {
          token: '1234',
        },
        params: {
          id: this.company.id,
        },
        body: {},
      }, {
        locals: {
          company: this.company,
        },
        breadcrumb: this.breadcrumbsStub,
        render: (template, data) => {
          expect(data.export_to_countries).to.deep.equal(['1234', '2234'])
          expect(data.future_interest_countries).to.deep.equal(['4321'])
          done()
        },
      }, this.next)
    })

    it('should include labels', (done) => {
      this.companyExportController.edit({
        session: { token: '1234' },
        params: { id: '1234' },
      }, {
        locals: {
          company: this.company,
        },
        breadcrumb: this.breadcrumbsStub,
        render: (template, data) => {
          expect(data).to.have.property('exportDetailsLabels')
          done()
        },
      }, this.next)
    })
  })

  describe('post', () => {
    it('should get the existing company and flatten it pass back with export data', (done) => {
      this.companyExportController.post({
        session: {
          token: '1234',
        },
        params: {
          id: this.company.id,
        },
        body: {
          id: this.company.id,
          export_to_countries: ['888', '333'],
          future_interest_countries: ['555', '666'],
        },
      }, {
        locals: {},
        breadcrumb: this.breadcrumbsStub,
        redirect: (url) => {
          expect(this.getDitCompany).to.be.calledWith('1234', this.company.id)
          expect(controllerUtils.flattenIdFields).to.be.calledWith(this.company)
          expect(this.saveCompany).to.have.been.called

          const firstCallArgs = this.saveCompany.firstCall.args[1]
          expect(firstCallArgs).to.have.property('id')
          expect(firstCallArgs).to.have.property('name')
          expect(firstCallArgs).to.have.property('export_to_countries')
          expect(firstCallArgs).to.have.property('future_interest_countries')
          done()
        },
      }, this.next)
    })

    it('should handle an ideal situation, simply upading the company with the countries selected', (done) => {
      const export_to_countries = ['888', '333']
      const future_interest_countries = ['555', '666']

      this.companyExportController.post({
        session: {
          token: '1234',
        },
        params: {
          id: this.company.id,
        },
        body: {
          id: this.company.id,
          export_to_countries,
          future_interest_countries,
        },
      }, {
        locals: {},
        breadcrumb: this.breadcrumbsStub,
        redirect: (url) => {
          const firstCallArgs = this.saveCompany.firstCall.args[1]
          expect(firstCallArgs.export_to_countries).to.deep.equal(export_to_countries)
          expect(firstCallArgs.future_interest_countries).to.deep.equal(future_interest_countries)
          done()
        },
      }, this.next)
    })

    it('should turn all single fields to an array', (done) => {
      const export_to_countries = ['1234', '3211']
      const future_interest_countries = '4321'

      this.companyExportController.post({
        session: {
          token: '1234',
        },
        params: {
          id: this.company.id,
        },
        body: {
          id: this.company.id,
          export_to_countries,
          future_interest_countries,
        },
      }, {
        locals: {},
        breadcrumb: this.breadcrumbsStub,
        redirect: (url) => {
          expect(this.saveCompany.firstCall.args[1].future_interest_countries).to.be.deep.equal(['4321'])
          done()
        },
      }, this.next)
    })

    it('it should remove empty, none selected, values', (done) => {
      const export_to_countries = ['1234', '']
      const future_interest_countries = ['666', '888']

      this.companyExportController.post({
        session: { token: '1234' },
        params: {
          id: this.company.id,
        },
        body: {
          id: this.company.id,
          export_to_countries,
          future_interest_countries,
        },
      }, {
        locals: {},
        breadcrumb: this.breadcrumbsStub,
        redirect: (url) => {
          expect(this.saveCompany.firstCall.args[1].export_to_countries).to.deep.equal(['1234'])
          done()
        },
      }, this.next)
    })

    it('should handle when saving throws error', (done) => {
      this.companyExportController = proxyquire('~/src/apps/companies/controllers/exp', {
        '../repos': {
          getDitCompany: this.getDitCompany,
          saveCompany: this.saveCompany,
        },
        '../../../lib/metadata': {
          countryOptions: [{
            id: '1234',
            name: 'France',
          }],
        },
        '../../../../lib/controller-utils': {
          flattenIdFields: this.flattenIdFields,
        },
      })

      this.companyExportController.post({
        session: { token: '1234' },
        params: { id: this.company.id },
        body: {
          id: this.company.id,
          export_to_countries: ['1234', '3211'],
          future_interest_countries: '4321',
        },
      }, {
        locals: {},
        breadcrumb: this.breadcrumbsStub,
      }, (err) => {
        expect(err).to.be.an('error')
        expect(err).to.be.an.instanceof(TypeError)
        expect(err.message).to.equal('res.redirect is not a function')
        done()
      })
    })

    it('should add a new export to country when instructed to', (done) => {
      this.companyExportController.post({
        session: {
          token: '1234',
        },
        params: {
          id: this.company.id,
        },
        body: {
          id: this.company.id,
          export_to_countries: ['888', '333'],
          future_interest_countries: ['555', '666'],
          addExportToCountry: 'Add country',
        },
      }, {
        locals: {},
        breadcrumb: this.breadcrumbsStub,
        render: (template, data) => {
          expect(data.export_to_countries).to.deep.equal(['888', '333', ''])
          done()
        },
      }, this.next)
    })

    it('should add a new future interest country when instructed to', (done) => {
      this.companyExportController.post({
        session: {
          token: '1234',
        },
        params: {
          id: this.company.id,
        },
        body: {
          id: this.company.id,
          export_to_countries: ['888', '333'],
          future_interest_countries: ['555', '666'],
          addFutureInterestCountry: 'Add country',
        },
      }, {
        locals: {},
        breadcrumb: this.breadcrumbsStub,
        render: (template, data) => {
          expect(data.future_interest_countries).to.deep.equal(['555', '666', ''])
          done()
        },
      }, this.next)
    })
  })
})
