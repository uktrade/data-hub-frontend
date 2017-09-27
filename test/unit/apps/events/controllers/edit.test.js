const { assign, find } = require('lodash')

const eventData = require('../../../data/events/event.json')

describe('Event edit controller', () => {
  const createEventsEditController = (getAdvisers) => {
    return proxyquire('~/src/apps/events/controllers/edit', {
      '../../adviser/repos': {
        getAdvisers: getAdvisers,
      },
    })
  }
  const currentUserTeam = 'team1'

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
        user: {
          dit_team: {
            id: currentUserTeam,
          },
        },
      },
      body: {},
      flash: this.sandbox.spy(),
    }
    this.res = {
      breadcrumb: this.sandbox.stub().returnsThis(),
      render: this.sandbox.spy(),
      redirect: this.sandbox.spy(),
      locals: {},
    }
    this.next = this.sandbox.spy()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#renderEditPage', () => {
    it('should render the event page', async () => {
      await this.controller.renderEditPage(this.req, this.res, this.next)

      expect(this.res.render).to.be.calledWith('events/views/edit')
      expect(this.res.render).to.have.been.calledOnce
    })

    it('should render the event page with an event form', async () => {
      await this.controller.renderEditPage(this.req, this.res, this.next)

      const actual = this.res.render.getCall(0).args[1].eventForm

      expect(actual).to.be.an('object').and.have.property('hiddenFields').and.have.property('id')
    })

    it('should populate the event form with organisers', async () => {
      await this.controller.renderEditPage(this.req, this.res, this.next)

      const eventForm = this.res.render.getCall(0).args[1].eventForm
      const actual = find(eventForm.children, { name: 'organiser' }).options
      const expected = [
        { value: 'advisor1', label: 'advisor 1' },
        { value: 'advisor2', label: 'advisor 2' },
        { value: 'advisor3', label: 'advisor 3' },
      ]

      expect(actual).to.deep.equal(expected)
    })

    it('should prepopulate the team hosting the event with the current user team', async () => {
      await this.controller.renderEditPage(this.req, this.res, this.next)

      const eventForm = this.res.render.getCall(0).args[1].eventForm
      const actual = find(eventForm.children, { name: 'lead_team' }).value

      expect(actual).to.equal(currentUserTeam)
    })

    context('when adding an event', () => {
      it('should add a breadcrumb', async () => {
        await this.controller.renderEditPage(this.req, this.res, this.next)

        expect(this.res.breadcrumb.firstCall).to.be.calledWith(undefined)
        expect(this.res.breadcrumb.secondCall).to.be.calledWith('Add event')
      })
    })

    context('when editing an event', () => {
      beforeEach(() => {
        this.res.locals.event = eventData
      })

      it('should add a breadcrumb', async () => {
        await this.controller.renderEditPage(this.req, this.res, this.next)

        expect(this.res.breadcrumb.firstCall).to.be.calledWith('name', '/events/123')
        expect(this.res.breadcrumb.secondCall).to.be.calledWith('Edit event')
      })
    })

    context('when there are validation errors', () => {
      it('should prepopulate the errors', async () => {
        const messages = {
          name: 'error 1',
          start_date: 'error 2',
        }

        const fieldLabels = {
          name: 'Event name',
          start_date: 'Event start date',
        }

        const res = assign({}, this.res, {
          locals: {
            form: {
              errors: {
                messages,
              },
            },
          },
        })

        await this.controller.renderEditPage(this.req, res, this.next)

        const actualErrors = this.res.render.getCall(0).args[1].eventForm.errors
        const expectedErrors = {
          summary: 'Please correct the following errors:',
          messages,
          fieldLabels,
        }

        expect(actualErrors).to.deep.equal(expectedErrors)
      })
    })

    context('when there is an exception', () => {
      it('should return an error', async () => {
        const error = Error('error')
        const controller = createEventsEditController(sinon.stub().rejects(error))

        await controller.renderEditPage(this.req, this.res, this.next)

        expect(this.next).to.be.calledWith(sinon.match({ message: error.message }))
        expect(this.next).to.have.been.calledOnce
      })
    })
  })
})
