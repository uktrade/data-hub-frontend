describe('OMIS list controllers', () => {
  beforeEach(() => {
    this.req = {
      session: {
        token: 'abcd',
      },
      query: {},
    }
    this.res = {
      breadcrumb: sandbox.stub().returnsThis(),
      render: sandbox.spy(),
      query: {},
    }
    this.buildSelectedFiltersSummaryStub = sandbox.spy()

    this.controller = proxyquire('~/src/apps/omis/apps/list/controllers', {
      '../../../builders': {
        buildSelectedFiltersSummary: this.buildSelectedFiltersSummaryStub,
      },
      './macros': {
        collectionFiltersFields: [
          { macroName: 'useful' },
          { macroName: 'exciting' },
        ],
        reconciliationFiltersFields: [
          { macroName: 'foo' },
          { macroName: 'bar' },
        ],
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('renderCollectionList()', () => {
    beforeEach(() => {
      this.controller.renderCollectionList(this.req, this.res)
    })

    it('should call render method', () => {
      expect(this.res.render).to.have.been.calledOnce
    })

    it('should pass the correct data to the view', () => {
      expect(this.res.render).to.have.been.calledWith(sandbox.match.any, sandbox.match.hasOwn('sortForm'))
      expect(this.res.render).to.have.been.calledWith(sandbox.match.any, sandbox.match.hasOwn('filtersFields'))
      expect(this.res.render).to.have.been.calledWith(sandbox.match.any, sandbox.match.hasOwn('selectedFilters'))
    })

    it('should build filters summary', () => {
      expect(this.buildSelectedFiltersSummaryStub).to.have.been.calledWith([
        { macroName: 'useful' },
        { macroName: 'exciting' },
      ], this.req.query)
    })
  })

  describe('renderReconciliationList()', () => {
    beforeEach(() => {
      this.controller.renderReconciliationList(this.req, this.res)
    })

    it('should call render method', () => {
      expect(this.res.render).to.have.been.calledOnce
    })

    it('should set a breadcrumb item', () => {
      expect(this.res.breadcrumb).to.have.been.calledOnce
    })

    it('should pass the correct data to the view', () => {
      expect(this.res.render).to.have.been.calledWith(sandbox.match.any, sandbox.match.hasOwn('sortForm'))
      expect(this.res.render).to.have.been.calledWith(sandbox.match.any, sandbox.match.hasOwn('filtersFields'))
      expect(this.res.render).to.have.been.calledWith(sandbox.match.any, sandbox.match.hasOwn('selectedFilters'))
    })

    it('should build filters summary', () => {
      expect(this.buildSelectedFiltersSummaryStub).to.have.been.calledWith([
        { macroName: 'foo' },
        { macroName: 'bar' },
      ], this.req.query)
    })
  })
})
