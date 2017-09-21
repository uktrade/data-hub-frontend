const config = require('~/config')
const token = 'abcd'

describe('Event repos', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.authorisedRequestStub = this.sandbox.stub().resolves()

    this.repos = proxyquire('~/src/apps/events/repos', {
      '../../lib/authorised-request': this.authorisedRequestStub,
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
})
