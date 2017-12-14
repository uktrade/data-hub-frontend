describe('Investment list controller', () => {
  beforeEach(() => {
    this.next = sandbox.spy()
    this.req = {
      session: {
        token: 'abcd',
      },
      query: {},
    }
    this.res = {
      render: sandbox.spy(),
      query: {},
    }

    this.buildSelectedFiltersSummaryStub = sandbox.spy()

    this.controller = proxyquire('~/src/apps/investment-projects/controllers/list', {
      '../../builders': {
        buildSelectedFiltersSummary: this.buildSelectedFiltersSummaryStub,
      },
      '../macros': {
        investmentFiltersFields: [
          { macroName: 'useful' },
          { macroName: 'exciting' },
        ],
      },
    })
  })

  describe('#renderInvestmentList', () => {
    it('should render collection page with locals', () => {
      this.controller.renderInvestmentList(this.req, this.res, this.next)
      expect(this.res.render).to.have.been.calledWith(sandbox.match.any, sandbox.match.hasOwn('title'))
      expect(this.res.render).to.have.been.calledWith(sandbox.match.any, sandbox.match.hasOwn('sortForm'))
      expect(this.res.render).to.have.been.calledWith(sandbox.match.any, sandbox.match.hasOwn('filtersFields'))
      expect(this.res.render).to.have.been.calledWith(sandbox.match.any, sandbox.match.hasOwn('selectedFilters'))
      expect(this.buildSelectedFiltersSummaryStub).to.have.been.calledWith([
        { macroName: 'useful' },
        { macroName: 'exciting' },
      ], this.req.query)
    })
  })
})
