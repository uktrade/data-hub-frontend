const eventData = require('~/test/unit/data/events/event-data')

describe('Event details controller', () => {
  beforeEach(() => {
    this.transformedData = {}
    this.sandbox = sinon.sandbox.create()

    this.fetchEventStub = this.sandbox
      .stub()
      .withArgs('4321', '1234')
      .resolves(eventData)

    this.controller = proxyquire('~/src/apps/events/controllers/details', {
      '../transformers': {
        transformEventResponseToViewRecord: this.sandbox
          .stub()
          .withArgs(eventData)
          .returns(this.transformedData),
      },
      '../repos': {
        fetchEvent: this.fetchEventStub,
      },
    })

    this.req = {
      params: {
        id: '1234',
      },
      session: {
        token: '4321',
      },
    }

    this.res = {
      breadcrumb: this.sandbox.stub().returnsThis(),
      render: this.sandbox.spy(),
    }

    this.next = this.sandbox.spy()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#renderDetailsPage', async () => {
    context('when there are no errors', () => {
      beforeEach(async () => {
        await this.controller.renderDetailsPage(this.req, this.res, this.next)
      })

      it('should add a breadcrumb', () => {
        expect(this.res.breadcrumb).to.be.calledWith(eventData.name)
        expect(this.res.breadcrumb).to.have.been.calledOnce
      })

      it('should render the event details template', () => {
        expect(this.res.render).to.be.calledWith('events/views/details')
        expect(this.res.render).to.have.been.calledOnce
      })

      it('should return transformed events data', () => {
        const options = this.res.render.firstCall.args[1]
        expect(options.eventViewRecord).to.deep.equal(this.transformedData)
      })

      it('should return the event id', () => {
        const options = this.res.render.firstCall.args[1]
        expect(options.eventId).to.equal('1234')
      })
    })

    context('when there are errors fetching data', async () => {
      beforeEach(async () => {
        this.error = new Error()
        this.fetchEventStub.rejects(this.error)
        await this.controller.renderDetailsPage(this.req, this.res, this.next)
      })

      it('should pass the error to the error page', () => {
        expect(this.next).to.be.calledWith(this.error)
      })
    })
  })
})
