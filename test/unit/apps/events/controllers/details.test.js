describe('Event details controller', () => {
  beforeEach(() => {
    this.controller = require('~/src/apps/events/controllers/details')

    this.sandbox = sinon.sandbox.create()

    this.req = { }
    this.res = {
      breadcrumb: this.sandbox.stub().returnsThis(),
      render: this.sandbox.spy(),
    }
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#renderDetailsPage', () => {
    it('should add a breadcrumb', async () => {
      this.controller.renderDetailsPage(this.req, this.res)

      expect(this.res.breadcrumb).to.be.calledWith('Event details')
      expect(this.res.breadcrumb).to.have.been.calledOnce
    })

    it('should render the event details page', async () => {
      await this.controller.renderDetailsPage(this.req, this.res)

      expect(this.res.render).to.be.calledWith('events/views/details')
      expect(this.res.render).to.have.been.calledOnce
    })

    it('should render the event details page with a title', async () => {
      await this.controller.renderDetailsPage(this.req, this.res, this.next)

      const actual = this.res.render.getCall(0).args[1].title

      expect(actual).to.equal('Event details')
    })
  })
})
