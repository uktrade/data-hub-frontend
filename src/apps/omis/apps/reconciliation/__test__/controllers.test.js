const proxyquire = require('proxyquire')

describe('OMIS reconciliation controllers', () => {
  beforeEach(() => {
    this.req = {
      session: {
        token: 'abcd',
      },
      query: {},
    }
    this.res = {
      breadcrumb: sinon.stub().returnsThis(),
      render: sinon.spy(),
      query: {},
    }
    this.buildSelectedFiltersSummaryStub = sinon.spy()

    this.controller = proxyquire('../controllers', {
      '../../../builders': {
        buildSelectedFiltersSummary: this.buildSelectedFiltersSummaryStub,
      },
      './macros': {
        filtersFields: [
          { macroName: 'foo' },
          { macroName: 'bar' },
        ],
      },
    })
  })

  describe('renderList()', () => {
    beforeEach(() => {
      this.controller.renderList(this.req, this.res)
    })

    it('should call render method', () => {
      expect(this.res.render).to.have.been.calledOnce
    })

    it('should pass the correct data to the view', () => {
      expect(this.res.render).to.have.been.calledWith(sinon.match.any, sinon.match.hasOwn('sortForm'))
      expect(this.res.render).to.have.been.calledWith(sinon.match.any, sinon.match.hasOwn('filtersFields'))
      expect(this.res.render).to.have.been.calledWith(sinon.match.any, sinon.match.hasOwn('selectedFilters'))
    })

    it('should build filters summary', () => {
      expect(this.buildSelectedFiltersSummaryStub).to.have.been.calledWith([
        { macroName: 'foo' },
        { macroName: 'bar' },
      ], this.req.query)
    })
  })
})
