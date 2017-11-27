const nock = require('nock')

const config = require('~/config')
const { search } = require('~/src/apps/search/services')

const token = 'abcd'

describe('Event repos', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.authorisedRequestStub = this.sandbox.stub().resolves()
    this.searchSpy = this.sandbox.spy(search)

    this.repos = proxyquire('~/src/apps/events/repos', {
      '../../lib/authorised-request': this.authorisedRequestStub,
      '../search/services': {
        search: this.searchSpy,
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#saveEvent', () => {
    context('when POST request', () => {
      const eventMock = { name: 'Convention' }

      it('should call with POST method', () => {
        this.repos.saveEvent(token, eventMock)

        expect(this.authorisedRequestStub).to.be.calledWith(token, sinon.match({ method: 'POST' }))
      })

      it('should contain event form body', () => {
        this.repos.saveEvent(token, eventMock)

        expect(this.authorisedRequestStub).to.be.calledWith(token, sinon.match({ body: eventMock }))
      })
    })

    context('when PATCH request', () => {
      const eventMock = { id: '123', name: 'Convention' }

      it('should call with POST method', () => {
        this.repos.saveEvent(token, eventMock)

        expect(this.authorisedRequestStub).to.be.calledWith(token, sinon.match({ method: 'PATCH' }))
      })

      it('should set request URL to event URL', () => {
        this.repos.saveEvent(token, eventMock)

        expect(this.authorisedRequestStub)
          .to.be.calledWith(token, sinon.match({ url: `${config.apiRoot}/v3/event/${eventMock.id}` }))
      })

      it('should contain event form body', () => {
        const event = { name: 'Convention' }
        this.repos.saveEvent(token, eventMock)

        expect(this.authorisedRequestStub).to.be.calledWith(token, sinon.match({ body: event }))
      })
    })
  })

  describe('#fetchEvent', () => {
    it('should call with event URL', () => {
      this.repos.fetchEvent(token, '123')
      expect(this.authorisedRequestStub)
        .to.be.calledWith(token, `${config.apiRoot}/v3/event/123`)
    })
  })

  describe('#getActiveEvents', () => {
    context('When there is a mix of active and inactive events', () => {
      beforeEach(() => {
        this.currentId = '3'

        this.eventCollection = {
          results: [{
            id: '1',
            disabled_on: '2017-01-01',
          }, {
            id: '2',
            disabled_on: null,
          }, {
            id: '3',
            disabled_on: '2017-01-01',
          }],
        }

        nock(config.apiRoot)
          .post('/v3/search/event')
          .reply(200, this.eventCollection)
      })

      context('and no current event', () => {
        beforeEach(async () => {
          this.events = await this.repos.getActiveEvents('1234')
        })

        it('should call search to get the events', () => {
          expect(this.searchSpy).to.be.calledWith({
            searchEntity: 'event',
            requestBody: { sortby: 'name:asc' },
            token: '1234',
            limit: 100000,
            isAggregation: false,
          })
        })

        it('should return only the active events', () => {
          expect(this.events).to.deep.eq([{
            id: '2',
            disabled_on: null,
          }])
        })
      })

      context('and a current inactive event', () => {
        beforeEach(async () => {
          this.events = await this.repos.getActiveEvents('1234', this.currentId)
        })

        it('should call search to get the events', () => {
          expect(this.searchSpy).to.be.calledWith({
            searchEntity: 'event',
            requestBody: { sortby: 'name:asc' },
            token: '1234',
            limit: 100000,
            isAggregation: false,
          })
        })

        it('should return active events and the current inactive one', () => {
          expect(this.events).to.deep.eq([{
            id: '2',
            disabled_on: null,
          }, {
            id: '3',
            disabled_on: '2017-01-01',
          }])
        })
      })
    })
  })
})
