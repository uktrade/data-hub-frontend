const advisersData = require('../../../data/advisers/advisers')
const eventData = require('../../../data/events/event.json')
const { merge, assign } = require('lodash')

const expectedBody = {
  id: '123',
  name: 'name',
  event_type: 'event_type',
  start_date: '2018-01-01',
  start_date_year: '2018',
  start_date_month: '01',
  start_date_day: '01',
  end_date: '2018-02-02',
  end_date_year: '2018',
  end_date_month: '02',
  end_date_day: '02',
  location_type: 'location_type',
  address_1: 'address 1',
  address_2: 'address 2',
  address_town: 'town',
  address_county: 'county',
  postcode: 'postcode',
  address_country: 'country',
  uk_region: 'uk_region',
  notes: 'notes',
  lead_team: 'lead_team',
  organiser: 'organiser',
  related_programmes: [ 'programme1', 'programme2' ],
  teams: [ 'team1', 'team2', 'lead_team' ],
  services: 'services',
  service: '1783ae93-b78f-e611-8c55-e4115bed50dc',
}

describe('Event details middleware', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.saveEventStub = this.sandbox.stub()
    this.fetchEventStub = this.sandbox.stub()
    this.getAdvisersStub = this.sandbox.stub()
    this.transformEventFormBodyToApiRequestStub = this.sandbox.stub()
    this.transformEventResponseToViewRecordStub = this.sandbox.stub()
    this.middleware = proxyquire('~/src/apps/events/middleware/details', {
      '../repos': {
        saveEvent: this.saveEventStub.resolves({ id: '1' }),
        fetchEvent: this.fetchEventStub.resolves(eventData),
      },
      '../transformers': {
        transformEventViewRecordToApiRequest: this.transformEventFormBodyToApiRequestStub.returns(expectedBody),
        transformEventResponseToViewRecord: this.transformEventResponseToViewRecordStub.returns({
          id: '2',
          data: 'transformed',
        }),
      },
      '../../adviser/repos': {
        getAdvisers: this.getAdvisersStub.resolves(advisersData),
      },
    })
    this.req = {
      session: {
        token: 'abcd',
      },
      flash: this.sandbox.spy(),
      body: assign({}, eventData),
    }
    this.res = {
      breadcrumb: this.sandbox.stub().returnsThis(),
      render: this.sandbox.spy(),
      redirect: this.sandbox.spy(),
      locals: {},
    }
    this.nextSpy = this.sandbox.spy()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#postDetails', () => {
    context('when all fields are valid', () => {
      it('should post to the API', async () => {
        await this.middleware.postDetails(this.req, this.res, this.nextSpy)

        expect(this.saveEventStub).to.have.been.calledWith(this.req.session.token)
        expect(this.saveEventStub).to.have.been.calledOnce
        expect(this.saveEventStub.firstCall.args[1]).to.deep.equal(expectedBody)
      })

      it('should redirect on success', async () => {
        await this.middleware.postDetails(this.req, this.res, this.nextSpy)

        expect(this.req.flash).to.be.calledWith('success')
        expect(this.res.redirect).to.be.calledWith('/events/1')
      })
    })

    context('when selecting one event shared team', () => {
      it('should set teams as an array', async () => {
        const req = merge({}, this.req, {
          body: {
            teams: 'team 1',
          },
        })

        await this.middleware.postDetails(req, this.res, this.nextSpy)

        const expected = assign({}, expectedBody, { teams: [ 'team 1', 'lead_team' ] })

        expect(this.saveEventStub).to.have.been.calledWith(this.req.session.token, expected)
        expect(this.saveEventStub).to.have.been.calledOnce
      })

      it('should not add empty values to the event shared teams', async () => {
        const req = merge({}, this.req, {
          body: {
            teams: [ 'team 1', '' ],
          },
        })

        await this.middleware.postDetails(req, this.res, this.nextSpy)

        const expected = assign({}, expectedBody, { teams: [ 'team 1', 'lead_team' ] })

        expect(this.saveEventStub).to.have.been.calledWith(this.req.session.token, expected)
        expect(this.saveEventStub).to.have.been.calledOnce
      })
    })

    context('when adding another event shared team', () => {
      it('should not POST to the API', async () => {
        const req = merge({}, this.req, {
          body: {
            add_team: true,
          },
        })

        await this.middleware.postDetails(req, this.res, this.nextSpy)

        expect(this.saveEventStub).to.not.have.been.called
      })

      it('should call next', async () => {
        const req = merge({}, this.req, {
          body: {
            add_team: true,
          },
        })

        await this.middleware.postDetails(req, this.res, this.nextSpy)

        expect(this.nextSpy).to.have.been.calledOnce
      })
    })

    context('when selecting one related programme', () => {
      it('should set related programmes as an array', async () => {
        const req = merge({}, this.req, {
          body: {
            related_programmes: 'programme 1',
          },
        })

        await this.middleware.postDetails(req, this.res, this.nextSpy)

        const expected = assign({}, expectedBody, { related_programmes: [ 'programme 1' ] })

        expect(this.saveEventStub).to.have.been.calledWith(this.req.session.token, expected)
        expect(this.saveEventStub).to.have.been.calledOnce
      })

      it('should not add empty values to the event shared teams', async () => {
        const req = merge({}, this.req, {
          body: {
            related_programmes: [ 'programme 1', '' ],
          },
        })

        await this.middleware.postDetails(req, this.res, this.nextSpy)

        const expected = assign({}, expectedBody, { related_programmes: [ 'programme 1' ] })

        expect(this.saveEventStub).to.have.been.calledWith(this.req.session.token, expected)
        expect(this.saveEventStub).to.have.been.calledOnce
      })
    })

    context('when adding another related programme', () => {
      it('should not POST to the API', async () => {
        const req = merge({}, this.req, {
          body: {
            add_related_programme: true,
          },
        })

        await this.middleware.postDetails(req, this.res, this.nextSpy)

        expect(this.saveEventStub).to.not.have.been.called
      })

      it('should call next', async () => {
        const req = merge({}, this.req, {
          body: {
            add_related_programme: true,
          },
        })

        await this.middleware.postDetails(req, this.res, this.nextSpy)

        expect(this.nextSpy).to.have.been.calledOnce
      })
    })

    context('when there is a 400', () => {
      beforeEach(() => {
        this.saveEventStub.rejects({ statusCode: 400, error: 'error' })
      })

      it('should set the errors', async () => {
        await this.middleware.postDetails(this.req, this.res, this.nextSpy)

        expect(this.res.locals.form.errors.messages).to.equal('error')
      })

      it('should not call next with errors', async () => {
        await this.middleware.postDetails(this.req, this.res, this.nextSpy)

        expect(this.nextSpy).have.been.calledWith()
        expect(this.nextSpy).have.been.calledOnce
      })
    })

    context('when there is an error other than 400', () => {
      beforeEach(() => {
        this.saveEventStub.rejects({ statusCode: 500, error: 'error' })
      })

      it('should not set form', async () => {
        await this.middleware.postDetails(this.req, this.res, this.nextSpy)

        expect(this.res.locals.form).to.be.undefined
      })

      it('should call next with errors', async () => {
        await this.middleware.postDetails(this.req, this.res, this.nextSpy)

        expect(this.nextSpy).have.been.calledWith({ statusCode: 500, error: 'error' })
        expect(this.nextSpy).have.been.calledOnce
      })
    })
  })

  describe('#getEventDetails', () => {
    context('when success', () => {
      it('should set event data on locals', async () => {
        await this.middleware.getEventDetails(this.req, this.res, this.nextSpy, eventData.id)

        expect(this.res.locals.event).to.deep.equal(eventData)
        expect(this.res.locals.eventViewRecord).to.have.property('id', '2')
        expect(this.res.locals.eventViewRecord).to.have.property('data', 'transformed')
      })
    })

    describe('#getAdviserDetails', () => {
      context('when success', () => {
        it('should set event data on locals', async () => {
          await this.middleware.getAdviserDetails(this.req, this.res, this.nextSpy)

          expect(this.res.locals.advisers).to.deep.equal(advisersData)
        })
      })
    })
  })
})
