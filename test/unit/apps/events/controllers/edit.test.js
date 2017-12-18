const { assign, find } = require('lodash')
const moment = require('moment')

const config = require('~/config')
const eventData = require('~/test/unit/data/events/event.json')
const adviserFilters = require('~/src/apps/adviser/filters')

const yesterday = moment().subtract(1, 'days').toISOString()
const lastMonth = moment().subtract(1, 'months').toISOString()

const metadataMock = {
  eventTypes: [
    { id: '1', name: 'et1', disabled_on: null },
    { id: '2', name: 'et2', disabled_on: yesterday },
    { id: '3', name: 'et3', disabled_on: null },
  ],
  locationTypes: [
    { id: '1', name: 'lt1', disabled_on: null },
    { id: '2', name: 'lt2', disabled_on: yesterday },
    { id: '3', name: 'lt3', disabled_on: null },
  ],
  countryOptions: [
    { id: '9999', name: 'United Kingdom', disabled_on: null },
    { id: '8888', name: 'Test', disabled_on: yesterday },
  ],
  teamOptions: [
    { id: '1', name: 'te1', disabled_on: null },
    { id: '2', name: 'te2', disabled_on: yesterday },
    { id: '3', name: 'te3', disabled_on: null },
  ],
  serviceOptions: [
    { id: '1', name: 'sv1', disabled_on: null },
    { id: '2', name: 'sv2', disabled_on: yesterday },
    { id: '3', name: 'sv3', disabled_on: null },
  ],
  programmeOptions: [
    { id: '1', name: 'p1', disabled_on: null },
    { id: '2', name: 'p2', disabled_on: yesterday },
    { id: '3', name: 'p3', disabled_on: null },
  ],
  regionOptions: [
    { id: '1', name: 'r1', disabled_on: null },
    { id: '2', name: 'r2', disabled_on: yesterday },
    { id: '3', name: 'r3', disabled_on: null },
  ],
}

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
  })

  describe('#renderEditPage', () => {
    beforeEach(() => {
      this.nockScope = nock(config.apiRoot)
        .get('/adviser/')
        .query({ limit: 100000, offset: 0 })
        .reply(200, this.activeInactiveAdviserData)
        .get('/metadata/event-type/')
        .reply(200, metadataMock.eventTypes)
        .get('/metadata/location-type/')
        .reply(200, metadataMock.locationTypes)
        .get('/metadata/country/')
        .reply(200, metadataMock.countryOptions)
        .get('/metadata/team/')
        .reply(200, metadataMock.teamOptions)
        .get('/metadata/service/')
        .reply(200, metadataMock.serviceOptions)
        .get('/metadata/programme/')
        .reply(200, metadataMock.programmeOptions)
        .get('/metadata/uk-region/')
        .reply(200, metadataMock.regionOptions)
    })

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

        const formOrganizerFieldOptions = getFormFieldOptions(this.res, 'organiser')
        expect(formOrganizerFieldOptions).to.deep.equal(expectedOptions)
      })

      it('should get all active event type options', () => {
        const options = getFormFieldOptions(this.res, 'event_type')
        expect(options).to.deep.equal([
          { label: 'et1', value: '1' },
          { label: 'et3', value: '3' },
        ])
      })

      it('should get all active location type options', () => {
        const options = getFormFieldOptions(this.res, 'location_type')
        expect(options).to.deep.equal([
          { label: 'lt1', value: '1' },
          { label: 'lt3', value: '3' },
        ])
      })

      it('should get all active country type options', () => {
        const options = getFormFieldOptions(this.res, 'address_country')
        expect(options).to.deep.equal([
          { label: 'United Kingdom', value: '9999' },
        ])
      })

      it('should get all active team options', () => {
        const options = getFormFieldOptions(this.res, 'lead_team')
        expect(options).to.deep.equal([
          { label: 'te1', value: '1' },
          { label: 'te3', value: '3' },
        ])
      })

      it('should get all active service options', () => {
        const options = getFormFieldOptions(this.res, 'service')
        expect(options).to.deep.equal([
          { label: 'sv1', value: '1' },
          { label: 'sv3', value: '3' },
        ])
      })

      it('should get all active programme options', () => {
        const options = getFormFieldOptions(this.res, 'related_programmes')
        expect(options).to.deep.equal([
          { label: 'p1', value: '1' },
          { label: 'p3', value: '3' },
        ])
      })

      it('should get all active uk region options', () => {
        const options = getFormFieldOptions(this.res, 'uk_region')
        expect(options).to.deep.equal([
          { label: 'r1', value: '1' },
          { label: 'r3', value: '3' },
        ])
      })
    })

    context('when editing an event', () => {
      beforeEach(async () => {
        this.currentAdviser = this.activeInactiveAdviserData.results[3]

        this.res.locals.event = assign({}, eventData, {
          created_on: lastMonth,
          organiser: this.currentAdviser,
        })

        await this.controller.renderEditPage(this.req, this.res, this.next)
      })

      it('should add a breadcrumb', () => {
        expect(this.res.breadcrumb.firstCall).to.be.calledWith('name', '/events/123')
        expect(this.res.breadcrumb.secondCall).to.be.calledWith('Edit event')
        expect(this.nockScope.isDone()).to.be.true
      })

      it('should get all active event type options when the event was created', () => {
        const options = getFormFieldOptions(this.res, 'event_type')
        expect(options).to.deep.equal([
          { label: 'et1', value: '1' },
          { label: 'et2', value: '2' },
          { label: 'et3', value: '3' },
        ])
      })

      it('should get all active location type options when the event was created', () => {
        const options = getFormFieldOptions(this.res, 'location_type')
        expect(options).to.deep.equal([
          { label: 'lt1', value: '1' },
          { label: 'lt2', value: '2' },
          { label: 'lt3', value: '3' },
        ])
      })

      it('should get all active country type options when the event was created', () => {
        const options = getFormFieldOptions(this.res, 'address_country')
        expect(options).to.deep.equal([
          { label: 'United Kingdom', value: '9999' },
          { label: 'Test', value: '8888' },
        ])
      })

      it('should get all active team options when the event was created', () => {
        const options = getFormFieldOptions(this.res, 'lead_team')
        expect(options).to.deep.equal([
          { label: 'te1', value: '1' },
          { label: 'te2', value: '2' },
          { label: 'te3', value: '3' },
        ])
      })

      it('should get all active service options when the event was created', () => {
        const options = getFormFieldOptions(this.res, 'service')
        expect(options).to.deep.equal([
          { label: 'sv1', value: '1' },
          { label: 'sv2', value: '2' },
          { label: 'sv3', value: '3' },
        ])
      })

      it('should get all active programme options when the event was created', () => {
        const options = getFormFieldOptions(this.res, 'related_programmes')
        expect(options).to.deep.equal([
          { label: 'p1', value: '1' },
          { label: 'p2', value: '2' },
          { label: 'p3', value: '3' },
        ])
      })

      it('should get all active uk region options when the event was created', () => {
        const options = getFormFieldOptions(this.res, 'uk_region')
        expect(options).to.deep.equal([
          { label: 'r1', value: '1' },
          { label: 'r2', value: '2' },
          { label: 'r3', value: '3' },
        ])
      })

      it('should get all active adviser options and the current one', () => {
        expect(this.filterActiveAdvisersSpy).to.be.calledWith({
          advisers: this.activeInactiveAdviserData.results,
          includeAdviser: this.currentAdviser.id,
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

  function getFormFieldOptions (res, fieldName) {
    const renderOptions = res.render.firstCall.args[1]
    const formFields = renderOptions.eventForm.children
    const field = find(formFields, field => field.name === fieldName)
    return field.options || field.children[0].options
  }
})
