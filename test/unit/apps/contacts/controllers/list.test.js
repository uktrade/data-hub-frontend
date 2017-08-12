describe('Contact list controller', () => {
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

    this.buildSortObjectStub = this.sandbox.spy()
    this.controller = proxyquire('~/src/apps/contacts/controllers/list', {
      '../../builders': {
        buildSortObject: this.buildSortObjectStub,
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#renderInvestmentList', () => {
    it('should render collection page with locals', () => {
      this.controller.renderContactList(this.req, this.res, this.next)
      expect(this.res.render).to.have.been.calledWith(this.sandbox.match.any, this.sandbox.match.hasOwn('title'))
      expect(this.res.render).to.have.been.calledWith(this.sandbox.match.any, this.sandbox.match.hasOwn('sort'))
      expect(this.buildSortObjectStub).to.have.been.calledOnce
    })
  })
})
