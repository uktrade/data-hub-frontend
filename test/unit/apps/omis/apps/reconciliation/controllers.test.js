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

    this.controller = proxyquire('~/src/apps/omis/apps/reconciliation/controllers', {
      './macros': {
        filtersFields: [
          { macroName: 'foo' },
          { macroName: 'bar' },
        ],
      },
    })
  })

  describe('renderList()', () => {
    beforeEach(async () => {
      await this.controller.renderList(this.req, this.res)
    })

    it('should call render method', () => {
      expect(this.res.render).to.have.been.calledOnce
    })

    it('should pass the correct data to the view', () => {
      expect(this.res.render).to.have.been.calledWith(sinon.match.any, sinon.match.hasOwn('sortForm'))
      expect(this.res.render).to.have.been.calledWith(sinon.match.any, sinon.match.hasOwn('filtersFields'))
      expect(this.res.render).to.have.been.calledWith(sinon.match.any, sinon.match.hasOwn('selectedFiltersSummary'))
    })
  })
})
