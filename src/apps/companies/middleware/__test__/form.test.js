const moment = require('moment')

const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')

const config = require('~/src/config')
const companyRecord = require('~/test/unit/data/companies/datahub-only-company.json')

const yesterday = moment().subtract(1, 'days').toISOString()
const { populateForm, handleFormPost } = require('~/src/apps/companies/middleware/form')
const formService = require('~/src/apps/companies/services/form')

const metadataMock = {
  headquarterOptions: [
    { id: '1', name: 'ehq', disabled_on: null },
    { id: '2', name: 'ghq', disabled_on: yesterday },
    { id: '3', name: 'ukhq', disabled_on: null },
  ],
  regionOptions: [
    { id: '1', name: 'r1', disabled_on: null },
    { id: '2', name: 'r2', disabled_on: yesterday },
    { id: '3', name: 'r3', disabled_on: null },
  ],
  sectorOptions: [
    { id: '1', name: 's1', disabled_on: null },
    { id: '2', name: 's2', disabled_on: yesterday },
    { id: '3', name: 's3', disabled_on: null },
  ],
  employeeOptions: [
    { id: '1', name: 'e1', disabled_on: null },
    { id: '2', name: 'e2', disabled_on: yesterday },
    { id: '3', name: 'e3', disabled_on: null },
  ],
  turnoverOptions: [
    { id: '1', name: 't1', disabled_on: null },
    { id: '2', name: 't2', disabled_on: yesterday },
    { id: '3', name: 't3', disabled_on: null },
  ],
  countryOptions: [
    { id: '9999', name: 'United Kingdom', disabled_on: null },
    { id: '7777', name: 'France', disabled_on: null },
    { id: '8888', name: 'Test', disabled_on: yesterday },
  ],
  businessTypeOptions: [
    { id: '12345', name: 'example-bussiness-type-id-12345' },
    { id: '33333', name: 'Private Limited Company' },
  ],
}

describe('Companies form middleware', () => {
  describe('#populateForm', () => {
    context('when creating any new company', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({})

        nock(config.apiRoot)
          .get('/v4/metadata/uk-region')
          .reply(200, metadataMock.regionOptions)
          .get('/v4/metadata/headquarter-type')
          .reply(200, metadataMock.headquarterOptions)
          .get('/v4/metadata/sector')
          .reply(200, metadataMock.sectorOptions)
          .get('/v4/metadata/employee-range')
          .reply(200, metadataMock.employeeOptions)
          .get('/v4/metadata/turnover')
          .reply(200, metadataMock.turnoverOptions)
          .get('/v4/metadata/country')
          .reply(200, metadataMock.countryOptions)
          .get('/v4/metadata/business-type')
          .reply(200, metadataMock.businessTypeOptions)

        await populateForm(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should include the active region options for use in the form', () => {
        expect(this.middlewareParameters.resMock.locals.options.regions).to.deep.equal([
          { value: '1', label: 'r1' },
          { value: '3', label: 'r3' },
        ])
      })

      it('should include the active sector options for use in the form', () => {
        expect(this.middlewareParameters.resMock.locals.options.sectors).to.deep.equal([
          { value: '1', label: 's1' },
          { value: '3', label: 's3' },
        ])
      })

      it('should include the active employee options for use in the form', () => {
        expect(this.middlewareParameters.resMock.locals.options.employees).to.deep.equal([
          { value: '1', label: 'e1' },
          { value: '3', label: 'e3' },
        ])
      })

      it('should include the active turnover options for use in the form', () => {
        expect(this.middlewareParameters.resMock.locals.options.turnovers).to.deep.equal([
          { value: '1', label: 't1' },
          { value: '3', label: 't3' },
        ])
      })

      it('should include the active foreign country options for use in the form', () => {
        expect(this.middlewareParameters.resMock.locals.options.foreignCountries).to.deep.equal([
          { value: '7777', label: 'France' },
        ])
      })

      it('should include headquarter options that have had label substituted and an option for not a headquarters', () => {
        expect(this.middlewareParameters.resMock.locals.options.headquarters).to.deep.equal([
          { value: 'not_headquarters', label: 'Not a headquarters' },
          { value: '1', label: 'European HQ' },
          { value: '3', label: 'UK HQ' },
        ])
      })
    })

    context('when editing an existing company', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: {
            ...companyRecord,
            uk_region: { id: 'r2' },
            sector: { id: 's2' },
            employee_range: { id: 'e2' },
            turnover_range: { id: 't2' },
          },
        })

        nock(config.apiRoot)
          .get('/v4/metadata/uk-region')
          .reply(200, metadataMock.regionOptions)
          .get('/v4/metadata/headquarter-type')
          .reply(200, metadataMock.headquarterOptions)
          .get('/v4/metadata/sector')
          .reply(200, metadataMock.sectorOptions)
          .get('/v4/metadata/employee-range')
          .reply(200, metadataMock.employeeOptions)
          .get('/v4/metadata/turnover')
          .reply(200, metadataMock.turnoverOptions)
          .get('/v4/metadata/country')
          .reply(200, metadataMock.countryOptions)
          .get('/v4/metadata/business-type')
          .reply(200, metadataMock.businessTypeOptions)

        await populateForm(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should pre-populate the form with company values', () => {
        const formData = this.middlewareParameters.resMock.locals.formData
        expect(formData).to.have.property('name', 'SAMSUNG BIOEPIS UK LIMITED')
        expect(formData).to.have.property('business_type', '6f75408b-03e7-e611-bca1-e4115bead28a')
        expect(formData).to.have.property('registered_address_1', '5TH FLOOR, PROFILE WEST')
        expect(formData).to.have.property('registered_address_town', 'BRENTFORD')
        expect(formData).to.have.property('registered_address_postcode', 'TW8 9ES')
      })

      it('should include the active region options for use in the form and the current option', () => {
        expect(this.middlewareParameters.resMock.locals.options.regions).to.deep.equal([
          { value: '1', label: 'r1' },
          { value: '2', label: 'r2' },
          { value: '3', label: 'r3' },
        ])
      })

      it('should include the active sector options for use in the form and the current option', () => {
        expect(this.middlewareParameters.resMock.locals.options.sectors).to.deep.equal([
          { value: '1', label: 's1' },
          { value: '2', label: 's2' },
          { value: '3', label: 's3' },
        ])
      })

      it('should include the active employee options for use in the form and the current option', () => {
        expect(this.middlewareParameters.resMock.locals.options.employees).to.deep.equal([
          { value: '1', label: 'e1' },
          { value: '2', label: 'e2' },
          { value: '3', label: 'e3' },
        ])
      })

      it('should include the active turnover options for use in the form and the current option', () => {
        expect(this.middlewareParameters.resMock.locals.options.turnovers).to.deep.equal([
          { value: '1', label: 't1' },
          { value: '2', label: 't2' },
          { value: '3', label: 't3' },
        ])
      })

      it('should include the active foreign country options for use in the form and the current option', () => {
        expect(this.middlewareParameters.resMock.locals.options.foreignCountries).to.deep.equal([
          { value: '7777', label: 'France' },
          { value: '8888', label: 'Test' },
        ])
      })
    })

    context('when populating a company for a previous failed save', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: companyRecord,
          requestBody: {
            name: 'Fred Bloggs Pies',
          },
        })

        nock(config.apiRoot)
          .get('/v4/metadata/uk-region')
          .reply(200, metadataMock.regionOptions)
          .get('/v4/metadata/headquarter-type')
          .reply(200, metadataMock.headquarterOptions)
          .get('/v4/metadata/sector')
          .reply(200, metadataMock.sectorOptions)
          .get('/v4/metadata/employee-range')
          .reply(200, metadataMock.employeeOptions)
          .get('/v4/metadata/turnover')
          .reply(200, metadataMock.turnoverOptions)
          .get('/v4/metadata/country')
          .reply(200, metadataMock.countryOptions)
          .get('/v4/metadata/business-type')
          .reply(200, metadataMock.businessTypeOptions)

        await populateForm(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should pre-populate the form with posted data', () => {
        const formData = this.middlewareParameters.resMock.locals.formData
        expect(formData).to.have.property('name', 'Fred Bloggs Pies')
      })
    })
  })

  describe('#handleFormPost', () => {
    context('when saving is successful', () => {
      const commonTests = (expectedCompanyToBeSaved, expectedRedirect) => {
        it('should call save company service', () => {
          expect(this.saveCompanyFormSpy).to.have.been.calledWith(
            this.middlewareParameters.reqMock.session.token,
            expectedCompanyToBeSaved,
          )
        })

        it('should call flash message', () => {
          expect(this.middlewareParameters.reqMock.flash).to.have.been.calledOnce
          expect(this.middlewareParameters.reqMock.flash).to.be.calledWith('success', 'Company record updated')
        })

        it('should redirect to the entity', () => {
          expect(this.middlewareParameters.resMock.redirect).to.have.been.calledWith(expectedRedirect)
        })

        it('should not call next', () => {
          expect(this.middlewareParameters.nextSpy).not.to.have.been.called
        })
      }

      context('when saving a new company', () => {
        beforeEach(async () => {
          this.saveCompanyFormSpy = sinon.spy(formService, 'saveCompanyForm')

          this.middlewareParameters = buildMiddlewareParameters({
            requestBody: {
              name: 'Fred Bloggs Ltd',
              address_1: 'line 1',
              address_2: 'line 2',
              address_town: 'town',
              address_county: 'county',
              address_postcode: 'postcode',
              address_country: 'country',
            },
          })

          nock(config.apiRoot)
            .post('/v4/company')
            .reply(200, companyRecord)

          await handleFormPost(
            this.middlewareParameters.reqMock,
            this.middlewareParameters.resMock,
            this.middlewareParameters.nextSpy,
          )
        })

        commonTests({
          name: 'Fred Bloggs Ltd',
          trading_names: [],
          address: {
            country: 'country',
            county: 'county',
            line_1: 'line 1',
            line_2: 'line 2',
            postcode: 'postcode',
            town: 'town',
          },
          registered_address: undefined,
        }, `/companies/${companyRecord.id}`)
      })

      context('when saving an existing company', () => {
        beforeEach(async () => {
          this.saveCompanyFormSpy = sinon.spy(formService, 'saveCompanyForm')

          this.middlewareParameters = buildMiddlewareParameters({
            company: companyRecord,
            requestBody: {
              id: companyRecord.id,
              name: 'Fred Bloggs Ltd',
              address_1: 'line 1',
              address_2: 'line 2',
              address_town: 'town',
              address_county: 'county',
              address_postcode: 'postcode',
              address_country: 'country',
            },
          })

          nock(config.apiRoot)
            .patch(`/v4/company/${companyRecord.id}`)
            .reply(200, companyRecord)

          await handleFormPost(
            this.middlewareParameters.reqMock,
            this.middlewareParameters.resMock,
            this.middlewareParameters.nextSpy,
          )
        })

        commonTests({
          id: companyRecord.id,
          name: 'Fred Bloggs Ltd',
          trading_names: [],
          address: {
            country: 'country',
            county: 'county',
            line_1: 'line 1',
            line_2: 'line 2',
            postcode: 'postcode',
            town: 'town',
          },
          registered_address: undefined,
        }, `/companies/${companyRecord.id}/business-details`)
      })
    })

    context('when saving fails', () => {
      const commonTests = () => {
        it('should set the error on the response', () => {
          expect(this.middlewareParameters.resMock.locals.errors).to.exist
        })

        it('should call next', () => {
          expect(this.middlewareParameters.nextSpy).to.have.been.calledOnce
        })
      }

      context('when saving a new company', () => {
        beforeEach(async () => {
          this.middlewareParameters = buildMiddlewareParameters({
            requestBody: {
              name: 'Fred Bloggs Ltd',
            },
          })

          nock(config.apiRoot)
            .post('/v4/company')
            .reply(400, { error: 'Error message' })

          await handleFormPost(
            this.middlewareParameters.reqMock,
            this.middlewareParameters.resMock,
            this.middlewareParameters.nextSpy,
          )
        })

        commonTests()
      })

      context('when saving an existing company fails', () => {
        beforeEach(async () => {
          this.middlewareParameters = buildMiddlewareParameters({
            requestBody: {
              id: companyRecord.id,
              name: 'Fred Bloggs Ltd',
            },
          })

          nock(config.apiRoot)
            .patch(`/v4/company/${companyRecord.id}`)
            .reply(400, { error: 'Error message' })

          await handleFormPost(
            this.middlewareParameters.reqMock,
            this.middlewareParameters.resMock,
            this.middlewareParameters.nextSpy,
          )
        })

        commonTests()
      })
    })
  })
})
