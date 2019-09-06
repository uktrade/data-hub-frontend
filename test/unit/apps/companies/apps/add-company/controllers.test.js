const config = require('~/config')
const {
  renderAddCompanyForm,
  postSearchDnbCompanies,
  postAddDnbCompany,
} = require('~/src/apps/companies/apps/add-company/controllers')
const companyCreateResponse = require('~/test/unit/data/companies/dnb/company-create.json')
const countriesFixture = require('../../../../data/metadata/country')
const { transformObjectToOption } = require('~/src/apps/transformers')
const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder')

describe('Add company form controllers', () => {
  beforeEach(() => {
    nock(config.apiRoot)
      .get('/metadata/country/')
      .reply(200, countriesFixture)
  })

  describe('#renderAddCompanyForm', () => {
    context('when the "Add company form" renders successfully', () => {
      beforeEach(async () => {
        this.foreignCountriesFixture = countriesFixture
          .filter(c => c.name !== 'United Kingdom')
          .map(transformObjectToOption)

        this.middlewareParameters = buildMiddlewareParameters()

        await renderAddCompanyForm(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should render the add company form template with fields', () => {
        const expectedTemplate = 'companies/apps/add-company/views/client-container'
        expect(this.middlewareParameters.resMock.render).to.be.calledOnceWithExactly(expectedTemplate, {
          props: {
            host: 'localhost:3000',
            csrfToken: 'csrf',
            foreignCountries: this.foreignCountriesFixture,
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
            duns_number: '123',
          },
        })

        await postAddDnbCompany(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should flash a created message', () => {
        expect(this.middlewareParameters.reqMock.flash).to.be.calledOnceWithExactly('success', 'Company created')
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
            duns_number: '123',
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
})
