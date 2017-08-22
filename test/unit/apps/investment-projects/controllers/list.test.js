describe('Investment list controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.next = this.sandbox.spy()
    this.req = {
      session: {
        token: 'abcd',
      },
      query: {},
    }
    this.res = {
      render: this.sandbox.spy(),
      query: {},
    }

    this.buildSelectedInvestmentFiltersSummaryStub = this.sandbox.spy()

    this.controller = proxyquire('~/src/apps/investment-projects/controllers/list', {
      '../builders': {
        buildSelectedInvestmentFiltersSummary: this.buildSelectedInvestmentFiltersSummaryStub,
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#renderInvestmentList', () => {
    it('should render collection page with locals', () => {
      this.controller.renderInvestmentList(this.req, this.res, this.next)
      expect(this.res.render).to.have.been.calledWith(this.sandbox.match.any, this.sandbox.match.hasOwn('title'))
      expect(this.res.render).to.have.been.calledWith(this.sandbox.match.any, this.sandbox.match.hasOwn('sortForm'))
      expect(this.res.render).to.have.been.calledWith(this.sandbox.match.any, this.sandbox.match.hasOwn('filtersFields'))
      expect(this.res.render).to.have.been.calledWith(this.sandbox.match.any, this.sandbox.match.hasOwn('selectedFilters'))
      expect(this.buildSelectedInvestmentFiltersSummaryStub).to.have.been.calledWith(this.req.query)
    })
  })
})
