const eventData = require('../../../data/events/event.json')

describe('Event details middleware', () => {
  describe('#handleFormPost', () => {
    beforeEach(() => {
      this.sandbox = sinon.sandbox.create()
      this.createEventStub = this.sandbox.stub()
      this.middleware = proxyquire('~/src/apps/events/middleware/details', {
        '../repos': {
          createEvent: this.createEventStub,
        },
      })
      this.req = {
        session: {
          token: 'abcd',
        },
        body: eventData,
      }
      this.res = {
        breadcrumb: this.sandbox.stub().returnsThis(),
        render: this.sandbox.spy(),
        locals: {},
      }
      this.next = this.sandbox.spy()
    })

    afterEach(() => {
      this.sandbox.restore()
    })

    context('when all fields are valid', () => {
      beforeEach(() => {
        this.createEventStub.resolves({ id: '1' })
      })

      it('should post to the API', async () => {
        await this.middleware.handleFormPost(this.req, this.res, this.next)

        const expectedBody = {
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
          teams: [ 'team1', 'team2' ],
        }

        expect(this.createEventStub).to.have.been.calledWith(this.req.session.token, expectedBody)
        expect(this.createEventStub).to.have.been.calledOnce
      })

      it('should set the result ID', async () => {
        await this.middleware.handleFormPost(this.req, this.res, this.next)

        const actualResultId = this.res.locals.resultId
        const expectedResultId = '1'

        expect(actualResultId).to.equal(expectedResultId)
      })
    })

    context('when there is a 400', () => {
      beforeEach(() => {
        this.createEventStub.rejects({ statusCode: 400, error: 'error' })
      })

      it('should set the state', async () => {
        await this.middleware.handleFormPost(this.req, this.res, this.next)

        expect(this.res.locals.form.state).to.deep.equal(this.req.body)
      })

      it('should set the errors', async () => {
        await this.middleware.handleFormPost(this.req, this.res, this.next)

        expect(this.res.locals.form.errors.messages).to.equal('error')
      })

      it('should not call next with errors', async () => {
        await this.middleware.handleFormPost(this.req, this.res, this.next)

        expect(this.next).have.been.calledWith()
        expect(this.next).have.been.calledOnce
      })
    })

    context('when there is an error other than 400', () => {
      beforeEach(() => {
        this.createEventStub.rejects({ statusCode: 500, error: 'error' })
      })

      it('should not set form', async () => {
        await this.middleware.handleFormPost(this.req, this.res, this.next)

        expect(this.res.locals.form).to.be.undefined
      })

      it('should call next with errors', async () => {
        await this.middleware.handleFormPost(this.req, this.res, this.next)

        expect(this.next).have.been.calledWith({ statusCode: 500, error: 'error' })
        expect(this.next).have.been.calledOnce
      })
    })
  })
})
