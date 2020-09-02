const proxyquire = require('proxyquire')

const buildMiddlewareParameters = require('../../../../../test/unit/helpers/middleware-parameters-builder')
const ordersMock = require('../../../../../test/unit/data/omis/collection.json')
const companyMock = require('../../../../../test/unit/data/company.json')

describe('Company orders controller', () => {
  beforeEach(() => {
    this.searchStub = sinon.stub()
    this.transformOrderToListItemSpy = sinon.spy()
    this.transformApiResponseToCollectionSpy = sinon.spy()

    this.controller = proxyquire('../orders', {
      '../../../modules/search/services': {
        search: this.searchStub,
      },
      '../../omis/transformers': {
        transformOrderToListItem: this.transformOrderToListItemSpy,
      },
      '../../../modules/api/transformers': {
        transformApiResponseToCollection: this
          .transformApiResponseToCollectionSpy,
      },
    })
  })

  context('when orders returns successfully', () => {
    context('with default page number', () => {
      beforeEach(async () => {
        this.searchStub.resolves(ordersMock.results)

        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
        })

        await this.controller.renderOrders(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy
        )
      })

      it('should call search with correct arguments', () => {
        expect(this.searchStub).to.have.been.calledWith({
          req: this.middlewareParameters.reqMock,
          isAggregation: false,
          page: 1,
          requestBody: {
            company: companyMock.id,
          },
          searchEntity: 'order',
        })
      })

      it('should call list item transformer', () => {
        expect(this.transformApiResponseToCollectionSpy).to.have.been.calledOnce
      })

      it('should render the correct template', () => {
        expect(this.middlewareParameters.resMock.render.args[0][0]).to.equal(
          'companies/views/orders'
        )
        expect(this.middlewareParameters.resMock.render).to.have.been.calledOnce
      })

      it('should send results to the template', () => {
        expect(
          this.middlewareParameters.resMock.render.args[0][1].results
        ).to.deep.equal(ordersMock.results)
      })

      it('should send an add button to the template', () => {
        expect(
          this.middlewareParameters.resMock.render.args[0][1].actionButtons
        ).to.deep.equal([
          {
            label: 'Add order',
            url: `/omis/create?company=${companyMock.id}&skip-company=true`,
          },
        ])
      })
    })

    context('when the company is archived', () => {
      beforeEach(async () => {
        this.searchStub.resolves(ordersMock.results)

        this.middlewareParameters = buildMiddlewareParameters({
          company: {
            ...companyMock,
            archived: true,
          },
        })

        await this.controller.renderOrders(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy
        )
      })

      it('should not send buttons to the template', () => {
        expect(
          this.middlewareParameters.resMock.render.args[0][1].actionButtons
        ).to.be.undefined
      })
    })
  })

  context('when search rejects', () => {
    beforeEach(async () => {
      this.errorMock = {
        errorCode: 500,
      }

      this.searchStub.rejects(this.errorMock)

      this.middlewareParameters = buildMiddlewareParameters({
        company: companyMock,
      })

      await this.controller.renderOrders(
        this.middlewareParameters.reqMock,
        this.middlewareParameters.resMock,
        this.middlewareParameters.nextSpy
      )
    })

    it('should call next with error', () => {
      expect(this.middlewareParameters.nextSpy).to.have.been.calledWith(
        this.errorMock
      )
      expect(this.middlewareParameters.nextSpy).to.have.been.calledOnce
    })
  })
})
