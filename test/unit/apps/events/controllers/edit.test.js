const { assign, find } = require('lodash')

const eventData = require('../../../data/events/event.json')
const advisersResponse = require('../../../data/advisers/advisers')

describe('Event edit controller', () => {
  const currentUserTeam = 'team1'

  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.controller = require('~/src/apps/events/controllers/edit')
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
      locals: {
        advisers: advisersResponse,
      },
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
        {
          label: 'Jeff Smith',
          value: 'a0dae366-1134-e411-985c-e4115bead28a',
        },
        {
          label: 'Aaron Mr',
          value: 'e13209b8-8d61-e311-8255-e4115bead28a',
        },
        {
          label: 'Mr Benjamin',
          value: 'b9d6b3dc-7af4-e411-bcbe-e4115bead28a',
        },
        {
          label: 'George Chan',
          value: '0119a99e-9798-e211-a939-e4115bead28a',
        },
        {
          label: 'Fred Rafters',
          value: '0919a99e-9798-e211-a939-e4115bead28a',
        },
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
      it('should pre populate the errors', async () => {
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
            advisers: advisersResponse,
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
  })
})
