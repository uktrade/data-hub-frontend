const ordersMock = require('~/test/unit/data/omis/collection.json')
const companyMock = require('~/test/unit/data/company.json')
const tokenMock = '12345abcde'

describe('Company investments controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.searchStub = this.sandbox.stub()
    this.transformOrderToListItemSpy = this.sandbox.spy()
    this.transformApiResponseToCollectionSpy = this.sandbox.spy()
    this.breadcrumbStub = this.sandbox.stub().returnsThis()
    this.renderSpy = this.sandbox.spy()
    this.nextSpy = this.sandbox.spy()

    this.controller = proxyquire('~/src/apps/companies/controllers/orders', {
      '../../search/services': {
        search: this.searchStub,
      },
      '../../omis/transformers': {
        transformOrderToListItem: this.transformOrderToListItemSpy,
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
      this.searchStub.resolves(ordersMock.results)
    })

    context('with default page number', () => {
      beforeEach(async () => {
        await this.controller.renderOrders(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call search with correct arguments', () => {
        expect(this.searchStub).to.have.been.calledWith({
          isAggregation: false,
          page: 1,
          requestBody: {
            company: companyMock.id,
          },
          searchEntity: 'order',
          token: tokenMock,
        })
      })

      it('should call list item transformer', () => {
        expect(this.transformApiResponseToCollectionSpy).to.have.been.calledOnce
      })

      it('should set the correct number of breadcrumbs', () => {
        expect(this.breadcrumbStub).to.have.been.calledTwice
      })

      it('should render the correct template', () => {
        expect(this.renderSpy.args[0][0]).to.equal('companies/views/orders')
        expect(this.renderSpy).to.have.been.calledOnce
      })

      it('should send the correct template data', () => {
        expect(this.renderSpy.args[0][1]).to.deep.equal({
          results: ordersMock.results,
        })
      })
    })

    context('when a custom page number', () => {
      beforeEach(async () => {
        this.reqMock.query.page = 2

        await this.controller.renderOrders(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call with custom page number', () => {
        expect(this.searchStub).to.have.been.calledWith({
          isAggregation: false,
          page: 2,
          requestBody: {
            company: companyMock.id,
          },
          searchEntity: 'order',
          token: tokenMock,
        })
      })
    })
  })

  context('when search rejects', () => {
    beforeEach(async () => {
      this.errorMock = {
        errorCode: 500,
      }
      this.searchStub.rejects(this.errorMock)

      await this.controller.renderOrders(this.reqMock, this.resMock, this.nextSpy)
    })

    it('should call next with error', () => {
      expect(this.nextSpy).to.have.been.calledWith(this.errorMock)
      expect(this.nextSpy).to.have.been.calledOnce
    })
  })
})
