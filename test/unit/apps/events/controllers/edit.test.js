describe('Event edit controller', () => {
  describe('#renderEventPage', () => {
    beforeEach(() => {
      this.sandbox = sinon.sandbox.create()

      this.controller = require('~/src/apps/events/controllers/edit')

      this.req = {}
      this.res = {
        breadcrumb: this.sandbox.stub().returnsThis(),
        render: this.sandbox.spy(),
      }
    })

    afterEach(() => {
      this.sandbox.restore()
    })

    it('should add a breadcrumb', () => {
      this.controller.renderEventPage(this.req, this.res)

      expect(this.res.breadcrumb).to.be.calledWith('Add event')
      expect(this.res.breadcrumb).to.have.been.calledOnce
    })

    it('should render the event page', () => {
      this.controller.renderEventPage(this.req, this.res)

      expect(this.res.render).to.be.calledWith('events/views/edit')
      expect(this.res.render).to.have.been.calledOnce
    })

    it('should render the event page with a title', () => {
      this.controller.renderEventPage(this.req, this.res)

      const actual = this.res.render.getCall(0).args[1].title

      expect(actual).to.equal('Add event')
    })

    it('should render the event page with an event form', () => {
      this.controller.renderEventPage(this.req, this.res)

      const actual = this.res.render.getCall(0).args[1].eventForm

      expect(actual).to.not.be.undefined
    })
  })
})
