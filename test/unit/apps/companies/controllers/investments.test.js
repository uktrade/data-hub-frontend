const investmentsMock = require('~/test/unit/data/investment/collection.json')
const companyMock = require('~/test/unit/data/companies/company.json')
const tokenMock = '12345abcde'

describe('Company investments controller', () => {
  beforeEach(() => {
    this.getCompanyInvestmentProjectsStub = sandbox.stub()
    this.transformInvestmentProjectToListItemSpy = sandbox.spy()
    this.transformApiResponseToCollectionSpy = sandbox.spy()
    this.breadcrumbStub = sandbox.stub().returnsThis()
    this.renderSpy = sandbox.spy()
    this.nextSpy = sandbox.spy()

    this.controller = proxyquire('~/src/apps/companies/controllers/investments', {
      '../../investment-projects/repos': {
        getCompanyInvestmentProjects: this.getCompanyInvestmentProjectsStub,
      },
      '../../investment-projects/transformers': {
        transformInvestmentProjectToListItem: this.transformInvestmentProjectToListItemSpy,
      },
      '../../transformers': {
        transformApiResponseToCollection: this.transformApiResponseToCollectionSpy,
      },
    })

    this.reqMock = {
      query: {},
      session: {
        token: tokenMock,
      },
    }
    this.resMock = {
      breadcrumb: this.breadcrumbStub,
      render: this.renderSpy,
      locals: {
        company: companyMock,
      },
    }
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  context('when investments returns successfully', () => {
    beforeEach(() => {
      this.getCompanyInvestmentProjectsStub.resolves(investmentsMock.results)
    })

    context('with default page number', () => {
      beforeEach(async () => {
        await this.controller.renderInvestments(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call audit log with correct arguments', () => {
        expect(this.getCompanyInvestmentProjectsStub).to.have.been.calledWith(tokenMock, companyMock.id, 1)
      })

      it('should call list item transformer', () => {
        expect(this.transformApiResponseToCollectionSpy).to.have.been.calledOnce
      })

      it('should set the correct number of breadcrumbs', () => {
        expect(this.breadcrumbStub).to.have.been.calledTwice
      })

      it('should render the correct template', () => {
        expect(this.renderSpy.args[0][0]).to.equal('companies/views/investments')
        expect(this.renderSpy).to.have.been.calledOnce
      })

      it('should send the correct template data', () => {
        expect(this.renderSpy.args[0][1]).to.deep.equal({
          results: investmentsMock.results,
        })
      })
    })

    context('when a custom page number', () => {
      beforeEach(async () => {
        this.reqMock.query.page = 2

        await this.controller.renderInvestments(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call with custom page number', () => {
        expect(this.getCompanyInvestmentProjectsStub).to.have.been.calledWith(tokenMock, companyMock.id, 2)
      })
    })
  })

  context('when investments rejects', () => {
    beforeEach(async () => {
      this.errorMock = {
        errorCode: 500,
      }
      this.getCompanyInvestmentProjectsStub.rejects(this.errorMock)

      await this.controller.renderInvestments(this.reqMock, this.resMock, this.nextSpy)
    })

    it('should call next with error', () => {
      expect(this.nextSpy).to.have.been.calledWith(this.errorMock)
      expect(this.nextSpy).to.have.been.calledOnce
    })
  })
})
