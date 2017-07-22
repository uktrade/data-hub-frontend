describe('Investment list controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.next = this.sandbox.spy()
    this.req = {}
    this.res = {
      render: this.sandbox.spy(),
    }

    this.controller = require('~/src/apps/investment-projects/controllers/list')
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#renderInvestmentList', () => {
    it('should render collection page', () => {
      this.controller.renderInvestmentList(this.req, this.res, this.next)
      expect(this.res.render).to.have.been.calledWith(this.sandbox.match.any, this.sandbox.match.hasOwn('title'))
    })
  })
})
