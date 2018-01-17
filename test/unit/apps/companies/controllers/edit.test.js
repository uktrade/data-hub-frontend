const { assign } = require('lodash')

const companyMock = require('~/test/unit/data/api-response-intermediary-company.json')
const config = require('~/config')

const metaDataMock = {
  businessTypeOptions: [
    {
      id: '9dd14e94-5d95-e211-a939-e4115bead28a',
      name: 'Charity',
    },
    {
      id: '9cd14e94-5d95-e211-a939-e4115bead28a',
      name: 'Government department',
    },
    {
      id: '9bd14e94-5d95-e211-a939-e4115bead28a',
      name: 'Intermediary',
    },
    {
      id: '8b6eaf7e-03e7-e611-bca1-e4115bead28a',
      name: 'Limited partnership',
    },
    {
      id: '9ad14e94-5d95-e211-a939-e4115bead28a',
      name: 'Partnership',
    },
    {
      id: '6f75408b-03e7-e611-bca1-e4115bead28a',
      name: 'Private limited company',
    },
    {
      id: 'dac8c591-03e7-e611-bca1-e4115bead28a',
      name: 'Public limited company',
    },
    {
      id: '99d14e94-5d95-e211-a939-e4115bead28a',
      name: 'Sole Trader',
    },
    {
      id: 'b0730fc6-fcce-4071-bdab-ba8de4f4fc98',
      name: 'UK branch of foreign company (BR)',
    },
    {
      id: '98d14e94-5d95-e211-a939-e4115bead28a',
      name: 'Company',
    },
  ],
}

describe('Company edit controller', () => {
  beforeEach(() => {
    this.breadcrumbStub = sandbox.stub().returnsThis()
    this.renderSpy = sandbox.spy()
    this.nextSpy = sandbox.spy()
    this.redirectSpy = sandbox.spy()

    this.controller = require('~/src/apps/companies/controllers/edit')

    this.reqMock = {
      session: {
        token: 'abcd',
      },
    }
    this.resMock = {
      breadcrumb: this.breadcrumbStub,
      render: this.renderSpy,
      redirect: this.redirectSpy,
      locals: {
        company: companyMock,
      },
    }
  })

  describe('renderForm', () => {
    beforeEach(() => {
      this.nockScope = nock(config.apiRoot)
        .get('/metadata/business-type/')
        .twice().reply(200, metaDataMock.businessTypeOptions)
    })

    context('when adding a UK branch of a foreign company', () => {
      beforeEach(async () => {
        const reqMock = assign(this.reqMock, {
          query: {
            country: 'uk',
          },
        })
        const resMock = assign(this.resMock, {
          locals: {
            formData: {
              business_type: 'b0730fc6-fcce-4071-bdab-ba8de4f4fc98',
            },
          },
        })

        await this.controller.renderForm(reqMock, resMock, this.nextSpy)
      })

      it('should render the edit page', () => {
        expect(this.resMock.render.getCall(0).args[0]).to.equal('companies/views/edit')
      })

      it('should set the add breadcrumb', () => {
        expect(this.resMock.breadcrumb.getCall(0).args[0]).to.equal('Add')
      })

      it('should set heading', () => {
        expect(this.resMock.render.getCall(0).args[1].heading).to.equal('Add UK company')
      })

      it('should set isForeign', () => {
        expect(this.resMock.render.getCall(0).args[1].isForeign).to.be.false
      })

      it('should set businessTypeLabel', () => {
        expect(this.resMock.render.getCall(0).args[1].businessTypeLabel).to.equal('UK branch of foreign company (BR)')
      })

      it('should show the company number field', () => {
        expect(this.resMock.render.getCall(0).args[1].showCompanyNumber).to.be.true
      })

      it('should not show the trading address fields', () => {
        expect(this.resMock.render.getCall(0).args[1].showTradingAddress).to.be.false
      })

      it('nock mocked scope has been called', () => {
        expect(this.nockScope.isDone()).to.be.true
      })
    })

    context('when editing a UK branch of a foreign company', () => {
      beforeEach(async () => {
        const reqMock = assign(this.reqMock, {
          query: {
            country: 'uk',
          },
        })
        const resMock = assign(this.resMock, {
          locals: {
            formData: {
              business_type: 'b0730fc6-fcce-4071-bdab-ba8de4f4fc98',
            },
            company: {
              id: 1,
              name: 'Existing UK branch of foreign company',
              uk_based: true,
            },
          },
        })

        await this.controller.renderForm(reqMock, resMock, this.nextSpy)
      })

      it('should render the edit page', () => {
        expect(this.resMock.render.getCall(0).args[0]).to.equal('companies/views/edit')
      })

      it('should set the company breadcrumb text', () => {
        expect(this.resMock.breadcrumb.getCall(0).args[0]).to.equal('Existing UK branch of foreign company')
      })

      it('should set the company breadcrumb link', () => {
        expect(this.resMock.breadcrumb.getCall(0).args[1]).to.equal('/companies/1')
      })

      it('should set the edit breadcrumb', () => {
        expect(this.resMock.breadcrumb.getCall(1).args[0]).to.equal('Edit')
      })

      it('should set heading', () => {
        expect(this.resMock.render.getCall(0).args[1].heading).to.equal('Edit UK company')
      })

      it('should set isForeign', () => {
        expect(this.resMock.render.getCall(0).args[1].isForeign).to.be.false
      })

      it('should set businessTypeLabel', () => {
        expect(this.resMock.render.getCall(0).args[1].businessTypeLabel).to.equal('UK branch of foreign company (BR)')
      })

      it('should show the company number field', () => {
        expect(this.resMock.render.getCall(0).args[1].showCompanyNumber).to.be.true
      })

      it('should not show the trading address fields', () => {
        expect(this.resMock.render.getCall(0).args[1].showTradingAddress).to.be.false
      })

      it('nock mocked scope has been called', () => {
        expect(this.nockScope.isDone()).to.be.true
      })
    })

    context('when adding a UK sole trader', () => {
      beforeEach(async () => {
        const reqMock = assign(this.reqMock, {
          query: {
            country: 'uk',
          },
        })
        const resMock = assign(this.resMock, {
          locals: {
            formData: {
              business_type: '99d14e94-5d95-e211-a939-e4115bead28a',
            },
          },
        })

        await this.controller.renderForm(reqMock, resMock, this.nextSpy)
      })

      it('should render the edit page', () => {
        expect(this.resMock.render.getCall(0).args[0]).to.equal('companies/views/edit')
      })

      it('should set the add breadcrumb', () => {
        expect(this.resMock.breadcrumb.getCall(0).args[0]).to.equal('Add')
      })

      it('should set heading', () => {
        expect(this.resMock.render.getCall(0).args[1].heading).to.equal('Add UK company')
      })

      it('should set isForeign', () => {
        expect(this.resMock.render.getCall(0).args[1].isForeign).to.be.false
      })

      it('should set businessTypeLabel', () => {
        expect(this.resMock.render.getCall(0).args[1].businessTypeLabel).to.equal('Sole Trader')
      })

      it('should not show the company number field', () => {
        expect(this.resMock.render.getCall(0).args[1].showCompanyNumber).to.be.false
      })

      it('should not show the trading address fields', () => {
        expect(this.resMock.render.getCall(0).args[1].showTradingAddress).to.be.false
      })

      it('nock mocked scope has been called', () => {
        expect(this.nockScope.isDone()).to.be.true
      })
    })

    context('when adding a foreign sole trader', () => {
      beforeEach(async () => {
        const reqMock = assign(this.reqMock, {
          query: {
            country: 'non-uk',
          },
        })
        const resMock = assign(this.resMock, {
          locals: {
            formData: {
              business_type: '99d14e94-5d95-e211-a939-e4115bead28a',
            },
          },
        })

        await this.controller.renderForm(reqMock, resMock, this.nextSpy)
      })

      it('should render the edit page', () => {
        expect(this.resMock.render.getCall(0).args[0]).to.equal('companies/views/edit')
      })

      it('should set the add breadcrumb', () => {
        expect(this.resMock.breadcrumb.getCall(0).args[0]).to.equal('Add')
      })

      it('should set heading', () => {
        expect(this.resMock.render.getCall(0).args[1].heading).to.equal('Add foreign company')
      })

      it('should set isForeign', () => {
        expect(this.resMock.render.getCall(0).args[1].isForeign).to.be.true
      })

      it('should set businessTypeLabel', () => {
        expect(this.resMock.render.getCall(0).args[1].businessTypeLabel).to.equal('Sole Trader')
      })

      it('should not show the company number field', () => {
        expect(this.resMock.render.getCall(0).args[1].showCompanyNumber).to.be.false
      })

      it('should not show the trading address fields', () => {
        expect(this.resMock.render.getCall(0).args[1].showTradingAddress).to.be.false
      })

      it('nock mocked scope has been called', () => {
        expect(this.nockScope.isDone()).to.be.true
      })
    })

    context('when editing a government department with a trading address', () => {
      beforeEach(async () => {
        const reqMock = assign(this.reqMock, {
          query: {
            country: 'uk',
          },
        })
        const resMock = assign(this.resMock, {
          locals: {
            formData: {
              business_type: '9cd14e94-5d95-e211-a939-e4115bead28a',
              trading_address_1: 'address',
            },
            company: {
              id: 1,
              name: 'Existing government department',
              uk_based: true,
            },
          },
        })

        await this.controller.renderForm(reqMock, resMock, this.nextSpy)
      })

      it('should render the edit page', () => {
        expect(this.resMock.render.getCall(0).args[0]).to.equal('companies/views/edit')
      })

      it('should set the add breadcrumb', () => {
        expect(this.resMock.breadcrumb.getCall(0).args[0]).to.equal('Existing government department')
      })

      it('should set heading', () => {
        expect(this.resMock.render.getCall(0).args[1].heading).to.equal('Edit UK company')
      })

      it('should set isForeign', () => {
        expect(this.resMock.render.getCall(0).args[1].isForeign).to.be.false
      })

      it('should set businessTypeLabel', () => {
        expect(this.resMock.render.getCall(0).args[1].businessTypeLabel).to.equal('Government department')
      })

      it('should not show the company number field', () => {
        expect(this.resMock.render.getCall(0).args[1].showCompanyNumber).to.be.false
      })

      it('should not show the trading address fields', () => {
        expect(this.resMock.render.getCall(0).args[1].showTradingAddress).to.be.true
      })

      it('nock mocked scope has been called', () => {
        expect(this.nockScope.isDone()).to.be.true
      })
    })
  })
})
