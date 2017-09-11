describe('Interaction list controller', () => {
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

    this.controller = require('~/src/apps/interactions/controllers/list')
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#renderInteractionList', () => {
    it('should render collection with a sort form', () => {
      this.controller.renderInteractionList(this.req, this.res, this.next)
      expect(this.res.render).to.have.been.calledWith(this.sandbox.match.any, this.sandbox.match.hasOwn('sortForm'))
    })
  })
})
