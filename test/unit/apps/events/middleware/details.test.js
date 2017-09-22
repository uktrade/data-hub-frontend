const eventData = require('../../../data/events/event.json')
const { merge, assign } = require('lodash')

describe('Event details middleware', () => {
  describe('#handleFormPost', () => {
    beforeEach(() => {
      this.sandbox = sinon.sandbox.create()
      this.createEventStub = this.sandbox.stub()
      this.createEventStub.resolves({ id: '1' })
      this.middleware = proxyquire('~/src/apps/events/middleware/details', {
        '../repos': {
          createEvent: this.createEventStub,
        },
      })
      this.req = {
        session: {
          token: 'abcd',
        },
        body: assign({}, eventData),
      }
      this.res = {
        breadcrumb: this.sandbox.stub().returnsThis(),
        render: this.sandbox.spy(),
        locals: {},
      }
      this.next = this.sandbox.spy()
      this.expectedBody = {
        name: 'name',
        event_type: 'event_type',
        start_date: '2018-01-01',
        end_date: '2018-02-02',
        location_type: 'location_type',
        address_1: 'address 1',
        address_2: 'address 2',
        address_town: 'town',
        address_county: 'county',
        postcode: 'postcode',
        address_country: 'country',
        notes: 'notes',
        lead_team: 'lead_team',
        organiser: 'organiser',
        related_programmes: [ 'programme1', 'programme2' ],
        teams: [ 'team1', 'team2', 'lead_team' ],
        service: '1783ae93-b78f-e611-8c55-e4115bed50dc',
      }
    })

    afterEach(() => {
      this.sandbox.restore()
    })

    context('when all fields are valid', () => {
      it('should post to the API', async () => {
        await this.middleware.postDetails(this.req, this.res, this.next)

        expect(this.createEventStub).to.have.been.calledWith(this.req.session.token, this.expectedBody)
        expect(this.createEventStub).to.have.been.calledOnce
      })

      it('should set the result ID', async () => {
        await this.middleware.postDetails(this.req, this.res, this.next)

        const actualResultId = this.res.locals.resultId
        const expectedResultId = '1'

        expect(actualResultId).to.equal(expectedResultId)
      })
    })

    context('when start and end dates have not been entered', () => {
      it('should not attempt to set start and end date', async () => {
        const req = merge({}, this.req, {
          body: {
            start_date_day: '',
            start_date_month: '',
            start_date_year: '',
            end_date_day: '',
            end_date_month: '',
            end_date_year: '',
          },
        })

        await this.middleware.postDetails(req, this.res, this.next)

        const expectedBody = assign({}, this.expectedBody, { start_date: undefined, end_date: undefined })

        expect(this.createEventStub).to.have.been.calledWith(this.req.session.token, expectedBody)
        expect(this.createEventStub).to.have.been.calledOnce
      })
    })

    context('when start and end dates have not been partially entered', () => {
      it('should attempt to set start and end date', async () => {
        const req = merge({}, this.req, {
          body: {
            start_date_day: '01',
            start_date_month: '',
            start_date_year: '',
            end_date_day: '02',
            end_date_month: '',
            end_date_year: '',
          },
        })

        await this.middleware.postDetails(req, this.res, this.next)

        const expectedBody = assign({}, this.expectedBody, { start_date: '--01', end_date: '--02' })

        expect(this.createEventStub).to.have.been.calledWith(this.req.session.token, expectedBody)
        expect(this.createEventStub).to.have.been.calledOnce
      })
    })

    context('when not selecting the lead team', () => {
      it('should not add to the teams', async () => {
        const req = merge({}, this.req, {
          body: {
            lead_team: null,
          },
        })

        await this.middleware.postDetails(req, this.res, this.next)

        const expectedBody = assign({}, this.expectedBody, {
          teams: [ 'team1', 'team2' ],
          lead_team: undefined,
        })

        expect(this.createEventStub).to.have.been.calledWith(this.req.session.token, expectedBody)
        expect(this.createEventStub).to.have.been.calledOnce
      })
    })

    context('when selecting one event shared team', () => {
      it('should set teams as an array', async () => {
        const req = merge({}, this.req, {
          body: {
            teams: 'team 1',
          },
        })

        await this.middleware.postDetails(req, this.res, this.next)

        const expectedBody = assign({}, this.expectedBody, { teams: [ 'team 1', 'lead_team' ] })

        expect(this.createEventStub).to.have.been.calledWith(this.req.session.token, expectedBody)
        expect(this.createEventStub).to.have.been.calledOnce
      })

      it('should not add empty values to the event shared teams', async () => {
        const req = merge({}, this.req, {
          body: {
            teams: [ 'team 1', '' ],
          },
        })

        await this.middleware.postDetails(req, this.res, this.next)

        const expectedBody = assign({}, this.expectedBody, { teams: [ 'team 1', 'lead_team' ] })

        expect(this.createEventStub).to.have.been.calledWith(this.req.session.token, expectedBody)
        expect(this.createEventStub).to.have.been.calledOnce
      })
    })

    context('when adding another event shared team', () => {
      it('should not POST to the API', async () => {
        const req = merge({}, this.req, {
          body: {
            add_team: true,
          },
        })

        await this.middleware.postDetails(req, this.res, this.next)

        expect(this.createEventStub).to.not.have.been.called
      })

      it('should call next', async () => {
        const req = merge({}, this.req, {
          body: {
            add_team: true,
          },
        })

        await this.middleware.postDetails(req, this.res, this.next)

        expect(this.next).to.have.been.calledOnce
      })
    })

    context('when selecting one related programme', () => {
      it('should set related programmes as an array', async () => {
        const req = merge({}, this.req, {
          body: {
            related_programmes: 'programme 1',
          },
        })

        await this.middleware.postDetails(req, this.res, this.next)

        const expectedBody = assign({}, this.expectedBody, { related_programmes: [ 'programme 1' ] })

        expect(this.createEventStub).to.have.been.calledWith(this.req.session.token, expectedBody)
        expect(this.createEventStub).to.have.been.calledOnce
      })

      it('should not add empty values to the event shared teams', async () => {
        const req = merge({}, this.req, {
          body: {
            related_programmes: [ 'programme 1', '' ],
          },
        })

        await this.middleware.postDetails(req, this.res, this.next)

        const expectedBody = assign({}, this.expectedBody, { related_programmes: [ 'programme 1' ] })

        expect(this.createEventStub).to.have.been.calledWith(this.req.session.token, expectedBody)
        expect(this.createEventStub).to.have.been.calledOnce
      })
    })

    context('when adding another related programme', () => {
      it('should not POST to the API', async () => {
        const req = merge({}, this.req, {
          body: {
            add_related_programme: true,
          },
        })

        await this.middleware.postDetails(req, this.res, this.next)

        expect(this.createEventStub).to.not.have.been.called
      })

      it('should call next', async () => {
        const req = merge({}, this.req, {
          body: {
            add_related_programme: true,
          },
        })

        await this.middleware.postDetails(req, this.res, this.next)

        expect(this.next).to.have.been.calledOnce
      })
    })

    context('when there is a 400', () => {
      beforeEach(() => {
        this.createEventStub.rejects({ statusCode: 400, error: 'error' })
      })

      it('should set the state', async () => {
        await this.middleware.postDetails(this.req, this.res, this.next)

        expect(this.res.locals.form.state).to.deep.equal(this.req.body)
      })

      it('should set the errors', async () => {
        await this.middleware.postDetails(this.req, this.res, this.next)

        expect(this.res.locals.form.errors.messages).to.equal('error')
      })

      it('should not call next with errors', async () => {
        await this.middleware.postDetails(this.req, this.res, this.next)

        expect(this.next).have.been.calledWith()
        expect(this.next).have.been.calledOnce
      })
    })

    context('when there is an error other than 400', () => {
      beforeEach(() => {
        this.createEventStub.rejects({ statusCode: 500, error: 'error' })
      })

      it('should not set form', async () => {
        await this.middleware.postDetails(this.req, this.res, this.next)

        expect(this.res.locals.form).to.be.undefined
      })

      it('should call next with errors', async () => {
        await this.middleware.postDetails(this.req, this.res, this.next)

        expect(this.next).have.been.calledWith({ statusCode: 500, error: 'error' })
        expect(this.next).have.been.calledOnce
      })
    })
  })
})
