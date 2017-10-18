describe('OMIS list controllers', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

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
    this.buildSelectedFiltersSummaryStub = this.sandbox.spy()

    this.controller = proxyquire('~/src/apps/omis/apps/list/controllers', {
      '../../../builders': {
        buildSelectedFiltersSummary: this.buildSelectedFiltersSummaryStub,
      },
      './macros': {
        collectionFiltersFields: [
          { macroName: 'useful' },
          { macroName: 'exciting' },
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
      expect(this.res.render).to.have.been.calledWith(this.sandbox.match.any, this.sandbox.match.hasOwn('sortForm'))
      expect(this.res.render).to.have.been.calledWith(this.sandbox.match.any, this.sandbox.match.hasOwn('filtersFields'))
      expect(this.res.render).to.have.been.calledWith(this.sandbox.match.any, this.sandbox.match.hasOwn('selectedFilters'))
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
  })
})
