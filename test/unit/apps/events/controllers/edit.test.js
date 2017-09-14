const { find } = require('lodash')

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

  describe('#renderEventPage', () => {
    it('should add a breadcrumb', async () => {
      await this.controller.renderEventPage(this.req, this.res, this.next)

      expect(this.res.breadcrumb).to.be.calledWith('Add event')
      expect(this.res.breadcrumb).to.have.been.calledOnce
    })

    it('should render the event page', async () => {
      await this.controller.renderEventPage(this.req, this.res, this.next)

      expect(this.res.render).to.be.calledWith('events/views/edit')
      expect(this.res.render).to.have.been.calledOnce
    })

    it('should render the event page with a title', async () => {
      await this.controller.renderEventPage(this.req, this.res, this.next)

      const actual = this.res.render.getCall(0).args[1].title

      expect(actual).to.equal('Add event')
    })

    it('should render the event page with an event form', async () => {
      await this.controller.renderEventPage(this.req, this.res, this.next)

      const actual = this.res.render.getCall(0).args[1].eventForm

      expect(actual).to.not.be.undefined
    })

    it('should populate the event form with organisers', async () => {
      await this.controller.renderEventPage(this.req, this.res, this.next)

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
      await this.controller.renderEventPage(this.req, this.res, this.next)

      const eventForm = this.res.render.getCall(0).args[1].eventForm
      const actual = find(eventForm.children, { name: 'lead_team' }).value
      const expected = currentUserTeam

      expect(actual).to.equal(expected)
    })

    context('when there are event shared teams', () => {
      it('should prepopulate the event shared teams', async () => {
        const teams = [ 'team1', 'team2' ]
        this.req.body.teams = teams

        await this.controller.renderEventPage(this.req, this.res, this.next)

        const eventForm = this.res.render.getCall(0).args[1].eventForm
        const actual = find(eventForm.children, { name: 'teams' }).value

        expect(actual).to.deep.equal(teams)
      })
    })

    context('when there are event programmes', () => {
      it('should prepopulate the event programmes', async () => {
        const relatedProgrammes = [ 'programme1', 'programme2' ]
        this.req.body.related_programmes = relatedProgrammes

        await this.controller.renderEventPage(this.req, this.res, this.next)

        const eventForm = this.res.render.getCall(0).args[1].eventForm
        const actual = find(eventForm.children, { name: 'related_programmes' }).value

        expect(actual).to.deep.equal(relatedProgrammes)
      })
    })

    context('when there is an error', () => {
      it('should return an error', async () => {
        const error = Error('error')
        const controller = createEventsEditController(sinon.stub().rejects(error))

        await controller.renderEventPage(this.req, this.res, this.next)

        expect(this.next).to.be.calledWith(sinon.match({ message: error.message }))
        expect(this.next).to.have.been.calledOnce
      })
    })
  })

  describe('#postHandler', () => {
    context('when adding an event shared team for the first time', () => {
      it('should set the event shared teams', () => {
        const team = 'team1'
        this.req.body.add_team = true
        this.req.body.teams = team

        this.controller.postHandler(this.req, this.res, this.next)

        const actual = this.req.body.teams

        expect(actual).to.deep.equal([ team ])
      })
    })

    context('when adding subsequent event shared teams', () => {
      it('should add to the event shared teams', () => {
        const teams = [ 'team1', 'team2' ]
        this.req.body.add_team = true
        this.req.body.teams = teams

        this.controller.postHandler(this.req, this.res, this.next)

        const actual = this.req.body.teams

        expect(actual).to.deep.equal(teams)
      })

      it('should not add empty values to the event programmes', () => {
        this.req.body.add_team = true
        this.req.body.teams = [ 'team1', 'team2' ]
        this.req.body.related_programmes = [ 'programme1', '' ]

        this.controller.postHandler(this.req, this.res, this.next)

        const actual = this.req.body.related_programmes

        expect(actual).to.deep.equal([ 'programme1' ])
      })
    })

    context('when adding an event programme for the first time', () => {
      it('should set the event programmes', () => {
        const relatedProgramme = 'programme1'
        this.req.body.add_related_programme = true
        this.req.body.related_programmes = relatedProgramme

        this.controller.postHandler(this.req, this.res, this.next)

        const actual = this.req.body.related_programmes

        expect(actual).to.deep.equal([ relatedProgramme ])
      })
    })

    context('when adding subsequent event programmes', () => {
      it('should add to the event programmes', () => {
        const relatedProgrammes = [ 'programme1', 'programme2' ]
        this.req.body.add_team = true
        this.req.body.related_programmes = relatedProgrammes

        this.controller.postHandler(this.req, this.res, this.next)

        const actual = this.req.body.related_programmes

        expect(actual).to.deep.equal(relatedProgrammes)
      })

      it('should not add empty values to the event shared teams', () => {
        this.req.body.add_team = true
        this.req.body.teams = [ 'team1', '' ]
        this.req.body.related_programmes = [ 'programme1', 'programme2' ]

        this.controller.postHandler(this.req, this.res, this.next)

        const actual = this.req.body.teams

        expect(actual).to.deep.equal([ 'team1' ])
      })
    })
  })
})
