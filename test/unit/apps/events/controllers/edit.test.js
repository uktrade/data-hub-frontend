const { find } = require('lodash')

describe('Event edit controller', () => {
  describe('#renderEventPage', () => {
    const createEventsEditController = (getAdvisers) => {
      return proxyquire('~/src/apps/events/controllers/edit', {
        '../../adviser/repos': {
          getAdvisers: getAdvisers,
        },
      })
    }

    beforeEach(() => {
      const advisersResponse = {
        results: [
          { name: 'advisor 1', id: 'advisor1' },
          { name: 'advisor 2', id: 'advisor2' },
          { name: 'advisor 3', id: 'advisor3' },
        ],
      }
      const getAdvisersStub = sinon.stub().resolves(advisersResponse)

      this.controller = createEventsEditController(getAdvisersStub)

      this.sandbox = sinon.sandbox.create()

      this.req = {
        session: {
          token: 'abcd',
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

    it('should add a breadcrumb', async () => {
      await this.controller.renderEventPage(this.req, this.res)

      expect(this.res.breadcrumb).to.be.calledWith('Add event')
      expect(this.res.breadcrumb).to.have.been.calledOnce
    })

    it('should render the event page', async () => {
      await this.controller.renderEventPage(this.req, this.res)

      expect(this.res.render).to.be.calledWith('events/views/edit')
      expect(this.res.render).to.have.been.calledOnce
    })

    it('should render the event page with a title', async () => {
      await this.controller.renderEventPage(this.req, this.res)

      const actual = this.res.render.getCall(0).args[1].title

      expect(actual).to.equal('Add event')
    })

    it('should render the event page with an event form', async () => {
      await this.controller.renderEventPage(this.req, this.res)

      const actual = this.res.render.getCall(0).args[1].eventForm

      expect(actual).to.not.be.undefined
    })

    it('should populate the event form with organisers', async () => {
      await this.controller.renderEventPage(this.req, this.res)

      const eventForm = this.res.render.getCall(0).args[1].eventForm
      const actual = find(eventForm.children, { name: 'event-organiser' }).options
      const expected = [
        { value: 'advisor1', label: 'advisor 1' },
        { value: 'advisor2', label: 'advisor 2' },
        { value: 'advisor3', label: 'advisor 3' },
      ]

      expect(actual).to.deep.equal(expected)
    })

    it('should return an error when there is an error', async () => {
      const error = Error('error')
      const controller = createEventsEditController(sinon.stub().rejects(error))

      await controller.renderEventPage(this.req, this.res, this.next)

      expect(this.next).to.be.calledWith(sinon.match({ message: error.message }))
      expect(this.next).to.have.been.calledOnce
    })
  })
})
