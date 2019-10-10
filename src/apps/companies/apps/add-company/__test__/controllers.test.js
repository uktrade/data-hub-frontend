const config = require('~/config')
const {
  renderAddCompanyForm,
  postSearchDnbCompanies,
  postAddDnbCompany,
  postAddDnbCompanyInvestigation,
} = require('~/src/apps/companies/apps/add-company/controllers')
const companyCreateResponse = require('~/test/unit/data/companies/dnb/company-create.json')
const companyCreateInvestigationResponse = require('~/test/unit/data/companies/dnb/company-create-investigation.json')
const {
  transformObjectToOption,
  transformCountryToOptionWithIsoCode,
} = require('~/src/apps/transformers')
const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder')

const metadataMock = {
  countriesOptions: [
    {
      id: '1',
      name: 'France',
      iso_alpha2_code: 'FR',
    },
    {
      id: '2',
      name: 'United Kingdom',
      iso_alpha2_code: 'GB',
    },
    {
      id: '3',
      name: 'United States',
      iso_alpha2_code: 'US',
    },
  ],
  regionOptions: [
    { id: '1', name: 'r1', disabled_on: null },
    { id: '2', name: 'r2', disabled_on: null },
    { id: '3', name: 'r3', disabled_on: null },
  ],
  sectorOptions: [
    { id: '1', name: 's1', disabled_on: null },
    { id: '2', name: 's2', disabled_on: null },
    { id: '3', name: 's3', disabled_on: null },
  ],
  businessTypeOptions: [
    {
      id: '9cd14e94-5d95-e211-a939-e4115bead28a',
      name: 'Government department or other public body',
      disabled_on: null,
    },
  ],
}

describe('Add company form controllers', () => {
  beforeEach(() => {
    nock(config.apiRoot)
      .get('/v4/metadata/country')
      .reply(200, metadataMock.countriesOptions)

    nock(config.apiRoot)
      .get('/v4/metadata/business-type')
      .reply(200, metadataMock.businessTypeOptions)

    nock(config.apiRoot)
      .get('/v4/metadata/sector')
      .reply(200, metadataMock.sectorOptions)

    nock(config.apiRoot)
      .get('/v4/metadata/uk-region')
      .reply(200, metadataMock.regionOptions)
  })

  describe('#renderAddCompanyForm', () => {
    context('when the "Add company form" renders successfully', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters()

        await renderAddCompanyForm(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should render the add company form template with fields', () => {
        const expectedTemplate = 'companies/apps/add-company/views/client-container'
        const expectedCountries = metadataMock.countriesOptions.map(transformCountryToOptionWithIsoCode)
        const expectedOrganisationTypes = metadataMock.businessTypeOptions.map(transformObjectToOption)
        const expectedSectors = metadataMock.sectorOptions.map(transformObjectToOption)
        const expectedRegions = metadataMock.regionOptions.map(transformObjectToOption)

        expect(this.middlewareParameters.resMock.render).to.be.calledOnceWithExactly(expectedTemplate, {
          props: {
            countries: expectedCountries,
            organisationTypes: expectedOrganisationTypes,
            sectors: expectedSectors,
            regions: expectedRegions,
          },
        })
      })

      it('should add a breadcrumb', () => {
        expect(this.middlewareParameters.resMock.breadcrumb.firstCall).to.be.calledWith('Add company')
      })

      it('should not call next() with an error', () => {
        expect(this.middlewareParameters.nextSpy).to.not.have.been.called
      })
    })

    context('when the rendering fails', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters()

        this.error = new Error('Could not render')

        const errorRes = {
          ...this.middlewareParameters.resMock,
          render: () => { throw this.error },
        }

        await renderAddCompanyForm(
          this.middlewareParameters.reqMock,
          errorRes,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should call next() with an error', () => {
        expect(this.middlewareParameters.nextSpy).to.have.been.calledOnceWithExactly(this.error)
      })
    })
  })

  describe('#postSearchDnbCompanies', () => {
    context('when the search is successful', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .post(`/v4/dnb/company-search`, {
            search_term: 'company',
            address_country: 'GB',
            page_size: 100,
          })
          .reply(200, {
            count: 0,
            results: [],
          })

        this.middlewareParameters = buildMiddlewareParameters({
          requestBody: {
            search_term: 'company',
            address_country: 'GB',
            page_size: 100,
          },
        })

        await postSearchDnbCompanies(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should respond with JSON', () => {
        expect(this.middlewareParameters.resMock.json).to.be.calledOnceWithExactly({
          count: 0,
          results: [],
        })
      })

      it('should not call next() with an error', () => {
        expect(this.middlewareParameters.nextSpy).to.not.have.been.called
      })
    })

    context('when the search fails', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .post(`/v4/dnb/company-search`, {
            search_term: 'company',
            address_country: 'GB',
            page_size: 100,
          })
          .reply(500, 'Error message')

        this.middlewareParameters = buildMiddlewareParameters({
          requestBody: {
            search_term: 'company',
            address_country: 'GB',
            page_size: 100,
          },
        })

        await postSearchDnbCompanies(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should not respond with JSON', () => {
        expect(this.middlewareParameters.resMock.json).to.not.have.been.called
      })

      it('should call next() with an error', () => {
        expect(this.middlewareParameters.nextSpy).to.have.been.calledOnceWithExactly(sinon.match({
          message: '500 - "Error message"',
        }))
      })
    })
  })

  describe('#postAddDnbCompany', () => {
    context('when the company is successfully created', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .post('/v4/dnb/company-create', {
            duns_number: '123',
          })
          .reply(200, companyCreateResponse)

        this.middlewareParameters = buildMiddlewareParameters({
          requestBody: {
            dnbCompany: {
              duns_number: '123',
            },
          },
        })

        await postAddDnbCompany(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should flash a created message', () => {
        expect(this.middlewareParameters.reqMock.flash).to.be.calledOnceWithExactly('success', 'Company added to Data Hub')
      })

      it('should respond with the created company', () => {
        expect(this.middlewareParameters.resMock.json).to.be.calledOnceWithExactly(companyCreateResponse)
      })

      it('should not call next() with an error', async () => {
        expect(this.middlewareParameters.nextSpy).to.not.have.been.called
      })
    })

    context('when there is an error', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .post('/v4/dnb/company-create', {
            duns_number: '123',
          })
          .reply(500, 'Error message')

        this.middlewareParameters = buildMiddlewareParameters({
          requestBody: {
            dnbCompany: {
              duns_number: '123',
            },
          },
        })

        await postAddDnbCompany(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should not flash a created message', () => {
        expect(this.middlewareParameters.reqMock.flash).to.not.have.been.called
      })

      it('should not respond', () => {
        expect(this.middlewareParameters.resMock.json).to.not.have.been.called
      })

      it('should call next() with an error', async () => {
        expect(this.middlewareParameters.nextSpy).to.have.been.calledOnceWithExactly(sinon.match({
          message: '500 - "Error message"',
        }))
      })
    })
  })

  describe('#postAddDnbCompanyInvestigation', () => {
    context('when the company investigation is successfully created', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .post('/v4/dnb/company-create-investigation', {
            address: {
              country: {
                id: 'country',
              },
              county: '',
              line_1: 'line 1',
              line_2: '',
              postcode: 'postcode',
              town: 'town',
            },
            business_type: '1',
            name: 'name',
            sector: '3',
            telephone_number: '123',
            uk_region: '2',
            website: 'website',
          })
          .reply(200, companyCreateInvestigationResponse)

        this.middlewareParameters = buildMiddlewareParameters({
          requestBody: {
            business_type: '1',
            name: 'name',
            sector: '3',
            telephone_number: '123',
            address1: 'line 1',
            address2: null,
            city: 'town',
            county: null,
            postcode: 'postcode',
            country: 'country',
            uk_region: '2',
            website: 'website',
          },
        })

        await postAddDnbCompanyInvestigation(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should flash a created message', () => {
        expect(this.middlewareParameters.reqMock.flash).to.be.calledOnceWithExactly('success', 'Company added to Data Hub')
      })

      it('should respond with the created company', () => {
        expect(this.middlewareParameters.resMock.json).to.be.calledOnceWithExactly(companyCreateInvestigationResponse)
      })

      it('should not call next() with an error', async () => {
        expect(this.middlewareParameters.nextSpy).to.not.have.been.called
      })
    })

    context('when there is an error', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .post('/v4/dnb/company-create-investigation', {
            address: {
              country: {
                id: 'country',
              },
              county: '',
              line_1: 'line 1',
              line_2: '',
              postcode: 'postcode',
              town: 'town',
            },
            business_type: '1',
            name: 'name',
            sector: '3',
            telephone_number: '123',
            uk_region: '2',
            website: 'website',
          })
          .reply(500, 'Error message')

        this.middlewareParameters = buildMiddlewareParameters({
          requestBody: {
            business_type: '1',
            name: 'name',
            sector: '3',
            telephone_number: '123',
            address1: 'line 1',
            address2: null,
            city: 'town',
            county: null,
            postcode: 'postcode',
            country: 'country',
            uk_region: '2',
            website: 'website',
          },
        })

        await postAddDnbCompanyInvestigation(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should not flash a created message', () => {
        expect(this.middlewareParameters.reqMock.flash).to.not.have.been.called
      })

      it('should not respond', () => {
        expect(this.middlewareParameters.resMock.json).to.not.have.been.called
      })

      it('should call next() with an error', async () => {
        expect(this.middlewareParameters.nextSpy).to.have.been.calledOnceWithExactly(sinon.match({
          message: '500 - "Error message"',
        }))
      })
    })
  })
})
