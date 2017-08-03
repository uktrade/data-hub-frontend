describe('Investment list controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.next = this.sandbox.spy()
    this.req = {}
    this.res = {
      render: this.sandbox.spy(),
      query: {},
    }

    this.buildInvestmentSortingStub = this.sandbox.spy()
    this.buildInvestmentFiltersStub = this.sandbox.spy()

    this.controller = proxyquire('~/src/apps/investment-projects/controllers/list', {
      '../builders': {
        buildInvestmentSorting: this.buildInvestmentSortingStub,
        buildInvestmentFilters: this.buildInvestmentFiltersStub,
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
      expect(this.res.render).to.have.been.calledWith(this.sandbox.match.any, this.sandbox.match.hasOwn('sort'))
      expect(this.res.render).to.have.been.calledWith(this.sandbox.match.any, this.sandbox.match.hasOwn('filters'))
      expect(this.buildInvestmentSortingStub).to.have.been.calledOnce
      expect(this.buildInvestmentFiltersStub).to.have.been.calledOnce
    })
  })
})
