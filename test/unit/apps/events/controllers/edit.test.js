const { assign, find } = require('lodash')

const config = require('~/config')
const eventData = require('~/test/unit/data/events/event.json')
const adviserFilters = require('~/src/apps/adviser/filters')

describe('Event edit controller', () => {
  const currentUserTeam = 'team1'

  beforeEach(() => {
    this.filterActiveAdvisersSpy = sandbox.spy(adviserFilters, 'filterActiveAdvisers')

    this.controller = proxyquire('~/src/apps/events/controllers/edit', {
      '../../adviser/filters': {
        filterActiveAdvisers: this.filterActiveAdvisersSpy,
      },
    })

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
      breadcrumb: sandbox.stub().returnsThis(),
      render: sandbox.spy(),
      redirect: sandbox.spy(),
      locals: { },
    }

    this.next = sandbox.spy()

    this.activeInactiveAdviserData = {
      count: 5,
      results: [
        { id: '1', name: 'Jeff Smith', is_active: true },
        { id: '2', name: 'John Smith', is_active: true },
        { id: '3', name: 'Zac Smith', is_active: true },
        { id: '4', name: 'Fred Smith', is_active: false },
        { id: '5', name: 'Jim Smith', is_active: false },
      ],
    }

    this.nockScope = nock(config.apiRoot)
      .get('/adviser/')
      .query({
        limit: 100000,
        offset: 0,
      })
      .reply(200, this.activeInactiveAdviserData)
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#renderEditPage', () => {
    context('when rendering the page', () => {
      beforeEach(async () => {
        await this.controller.renderEditPage(this.req, this.res, this.next)
      })

      it('should render the event page', () => {
        expect(this.res.render).to.be.calledWith('events/views/edit')
        expect(this.res.render).to.have.been.calledOnce
      })

      it('should render the event page with an event form', () => {
        const actual = this.res.render.getCall(0).args[1].eventForm

        expect(actual).to.be.an('object').and.have.property('hiddenFields').and.have.property('id')
      })

      it('should prepopulate the team hosting the event with the current user team', () => {
        const eventForm = this.res.render.getCall(0).args[1].eventForm
        const actual = find(eventForm.children, { name: 'lead_team' }).value

        expect(actual).to.equal(currentUserTeam)
      })

      it('nock mocked scope has been called', () => {
        expect(this.nockScope.isDone()).to.be.true
      })
    })

    context('when adding an event', () => {
      beforeEach(async () => {
        await this.controller.renderEditPage(this.req, this.res, this.next)
      })

      it('should add a breadcrumb', () => {
        expect(this.res.breadcrumb.firstCall).to.be.calledWith(undefined)
        expect(this.res.breadcrumb.secondCall).to.be.calledWith('Add event')
      })

      it('should get all active advisers', () => {
        expect(this.filterActiveAdvisersSpy).to.be.calledWith({
          advisers: this.activeInactiveAdviserData.results,
          includeAdviser: undefined,
        })
      })

      it('should render the form with the active advisers', () => {
        const expectedOptions = [
          { label: 'Jeff Smith', value: '1' },
          { label: 'John Smith', value: '2' },
          { label: 'Zac Smith', value: '3' },
        ]

        const formOrganizerFieldOptions = getOrganiserFieldOptions(this.res)
        expect(formOrganizerFieldOptions).to.deep.equal(expectedOptions)
      })

      it('nock mocked scope has been called', () => {
        expect(this.nockScope.isDone()).to.be.true
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
        expect(this.nockScope.isDone()).to.be.true
      })

      context('and when the organiser is active', () => {
        beforeEach(async () => {
          this.currentAdviser = this.activeInactiveAdviserData.results[3]

          this.res.locals.event = assign({}, eventData, {
            organiser: this.currentAdviser,
          })

          await this.controller.renderEditPage(this.req, this.res, this.next)
        })

        it('should filters the advisers and include the current one', () => {
          expect(this.filterActiveAdvisersSpy).to.be.calledWith({
            advisers: this.activeInactiveAdviserData.results,
            includeAdviser: this.currentAdviser.id,
          })
        })

        it('should render the form with the active advisers', () => {
          const expectedOptions = [
            { label: 'Jeff Smith', value: '1' },
            { label: 'John Smith', value: '2' },
            { label: 'Zac Smith', value: '3' },
            { label: 'Fred Smith', value: '4' },
          ]

          const formOrganizerFieldOptions = getOrganiserFieldOptions(this.res)
          expect(formOrganizerFieldOptions).to.deep.equal(expectedOptions)
        })

        it('nock mocked scope has been called', () => {
          expect(this.nockScope.isDone()).to.be.true
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
        expect(this.nockScope.isDone()).to.be.true
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
