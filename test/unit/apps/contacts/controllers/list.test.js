describe('Contact list controller', () => {
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

    this.controller = proxyquire('~/src/apps/contacts/controllers/list', {
      '../../builders': {
        buildSelectedFiltersSummary: this.buildSelectedFiltersSummaryStub,
      },
      '../macros': {
        contactFiltersFields: [
          { macroName: 'useful' },
          { macroName: 'exciting' },
        ],
      },
    })
  })

  describe('#renderContactList', () => {
    it('should render collection page with locals', () => {
      this.controller.renderContactList(this.req, this.res, this.next)
      expect(this.res.render).to.have.been.calledWith(sinon.match.any, sinon.match.hasOwn('title'))
      expect(this.res.render).to.have.been.calledWith(sinon.match.any, sinon.match.hasOwn('sortForm'))
      expect(this.res.render).to.have.been.calledWith(sinon.match.any, sinon.match.hasOwn('filtersFields'))
      expect(this.res.render).to.have.been.calledWith(sinon.match.any, sinon.match.hasOwn('selectedFilters'))
      expect(this.buildSelectedFiltersSummaryStub).to.have.been.calledWith([
        { macroName: 'useful' },
        { macroName: 'exciting' },
      ], this.req.query)
    })
  })
})
