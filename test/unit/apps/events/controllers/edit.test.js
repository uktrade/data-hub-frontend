const { assign, find, set } = require('lodash')

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
    }
    this.next = this.sandbox.spy()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#renderEditPage', () => {
    it('should add a breadcrumb', async () => {
      await this.controller.renderEditPage(this.req, this.res, this.next)

      expect(this.res.breadcrumb).to.be.calledWith('Add event')
      expect(this.res.breadcrumb).to.have.been.calledOnce
    })

    it('should render the event page', async () => {
      await this.controller.renderEditPage(this.req, this.res, this.next)

      expect(this.res.render).to.be.calledWith('events/views/edit')
      expect(this.res.render).to.have.been.calledOnce
    })

    it('should render the event page with a title', async () => {
      await this.controller.renderEditPage(this.req, this.res, this.next)

      const actual = this.res.render.getCall(0).args[1].title

      expect(actual).to.equal('Add event')
    })

    it('should render the event page with an event form', async () => {
      await this.controller.renderEditPage(this.req, this.res, this.next)

      const actual = this.res.render.getCall(0).args[1].eventForm

      expect(actual).to.not.be.undefined
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
      const expected = currentUserTeam

      expect(actual).to.equal(expected)
    })

    context('when there are event shared teams', () => {
      it('should prepopulate the event shared teams', async () => {
        const teams = [ 'team1', 'team2' ]
        const req = assign({}, this.req, {
          body: {
            teams: teams,
          },
        })

        await this.controller.renderEditPage(req, this.res, this.next)

        const eventForm = this.res.render.getCall(0).args[1].eventForm
        const actual = find(eventForm.children, { name: 'teams' }).value

        expect(actual).to.deep.equal(teams)
      })
    })

    context('when there are event programmes', () => {
      it('should prepopulate the event programmes', async () => {
        const relatedProgrammes = [ 'programme1', 'programme2' ]
        const req = assign({}, this.req, {
          body: {
            related_programmes: relatedProgrammes,
          },
        })

        await this.controller.renderEditPage(req, this.res, this.next)

        const eventForm = this.res.render.getCall(0).args[1].eventForm
        const actual = find(eventForm.children, { name: 'related_programmes' }).value

        expect(actual).to.deep.equal(relatedProgrammes)
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

  describe('#redirectToDetails', () => {
    context('when there are errors', () => {
      beforeEach(() => {
        set(this.res, 'locals.form.errors', [ 'error' ])
      })

      it('should not flash a success message', () => {
        this.controller.redirectToDetails(this.req, this.res, this.next)

        expect(this.req.flash).have.not.been.called
      })

      it('should not redirect to the event', () => {
        this.controller.redirectToDetails(this.req, this.res, this.next)

        expect(this.res.redirect).have.not.been.calledOnce
      })

      it('should call next', () => {
        this.controller.redirectToDetails(this.req, this.res, this.next)

        expect(this.next).have.been.calledWith()
        expect(this.next).have.been.calledOnce
      })
    })

    context('when creating was successful', () => {
      beforeEach(() => {
        set(this.res, 'locals.resultId', 1)
      })

      it('should flash a success message', () => {
        this.controller.redirectToDetails(this.req, this.res, this.next)

        expect(this.req.flash).have.been.calledWith('success', 'Event created')
        expect(this.req.flash).have.been.calledOnce
      })

      it('should redirect to the event', () => {
        this.controller.redirectToDetails(this.req, this.res, this.next)

        expect(this.res.redirect).have.been.calledWith('/events/1')
        expect(this.res.redirect).have.been.calledOnce
      })

      it('should not call next', () => {
        this.controller.redirectToDetails(this.req, this.res, this.next)

        expect(this.next).have.not.been.called
      })
    })
  })
})
