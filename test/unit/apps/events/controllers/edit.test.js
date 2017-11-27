const { assign, find } = require('lodash')
const nock = require('nock')

const config = require('~/config')
const eventData = require('../../../data/events/event.json')

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
    }

    this.res = {
      breadcrumb: this.sandbox.stub().returnsThis(),
      render: this.sandbox.spy(),
      redirect: this.sandbox.spy(),
      locals: { },
    }

    this.next = this.sandbox.spy()

    this.advisers = [{
      id: '1',
      name: 'Fred Flintstone',
      disabled_on: '2017-01-01',
    }, {
      id: '2',
      name: 'Wilma Flintstone',
      disabled_on: '2017-01-01',
    }, {
      id: '3',
      name: 'Barney Rubble',
      disabled_on: null,
    }]

    nock(config.apiRoot)
      .get(`/adviser/?limit=100000&offset=0`)
      .reply(200, { results: this.advisers })
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

    it('should prepopulate the team hosting the event with the current user team', async () => {
      await this.controller.renderEditPage(this.req, this.res, this.next)

      const eventForm = this.res.render.getCall(0).args[1].eventForm
      const actual = find(eventForm.children, { name: 'lead_team' }).value

      expect(actual).to.equal(currentUserTeam)
    })

    context('when adding an event', () => {
      beforeEach(async () => {
        await this.controller.renderEditPage(this.req, this.res, this.next)
      })

      it('should add a breadcrumb', () => {
        expect(this.res.breadcrumb.firstCall).to.be.calledWith(undefined)
        expect(this.res.breadcrumb.secondCall).to.be.calledWith('Add event')
      })

      it('should only include active organisers', () => {
        const organiserFieldOptions = getOrganiserFieldOptions(this.res)
        const expectedAdvisers = [{
          label: 'Barney Rubble',
          value: '3',
        }]
        expect(organiserFieldOptions).to.deep.equal(expectedAdvisers)
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

      context('and when the organiser is active', () => {
        beforeEach(async () => {
          this.res.locals.event = assign({}, eventData, {
            organiser: this.advisers[2],
          })

          await this.controller.renderEditPage(this.req, this.res, this.next)
        })

        it('should only include active organisers', () => {
          const organiserFieldOptions = getOrganiserFieldOptions(this.res)
          const expectedAdvisers = [{
            label: 'Barney Rubble',
            value: '3',
          }]
          expect(organiserFieldOptions).to.deep.equal(expectedAdvisers)
        })
      })

      context('and when the organiser is inactive', () => {
        beforeEach(async () => {
          this.res.locals.event = assign({}, eventData, {
            organiser: this.advisers[1],
          })

          await this.controller.renderEditPage(this.req, this.res, this.next)
        })

        it('should only include active organisers and the current one', () => {
          const organiserFieldOptions = getOrganiserFieldOptions(this.res)
          const expectedAdvisers = [{
            label: 'Wilma Flintstone',
            value: '2',
          }, {
            label: 'Barney Rubble',
            value: '3',
          }]
          expect(organiserFieldOptions).to.deep.equal(expectedAdvisers)
        })
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

        this.res = assign({}, this.res, {
          locals: {
            form: {
              errors: {
                messages,
              },
            },
          },
        })

        await this.controller.renderEditPage(this.req, this.res, this.next)

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

  function getOrganiserFieldOptions (res) {
    const renderOptions = res.render.firstCall.args[1]
    const formFields = renderOptions.eventForm.children
    const organiserField = find(formFields, field => field.name === 'organiser')
    return organiserField.options
  }
})
