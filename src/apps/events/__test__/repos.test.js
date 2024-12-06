const { expect } = require('chai')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

const authorisedRequestStub = sinon.stub()
const searchStub = sinon.stub()

const { saveEvent, fetchEvent, getAllEvents, getActiveEvents } = proxyquire(
  '../repos',
  {
    '../../lib/authorised-request': {
      authorisedRequest: authorisedRequestStub,
    },
    '../../modules/search/services': { search: searchStub },
  }
)

const config = require('../../../config')

describe('Event Service', () => {
  const mockReq = { session: { token: 'test-token' } }

  beforeEach(() => {
    sinon.reset()
  })

  afterEach(() => {
    sinon.restore()
  })

  context('saveEvent', () => {
    it('should POST new event', async () => {
      const event = { name: 'Test Event' }
      await saveEvent(mockReq, event)
      expect(authorisedRequestStub).to.have.been.calledWith(mockReq, {
        url: `${config.apiRoot}/v4/event`,
        method: 'POST',
        body: event,
      })
    })

    it('should PATCH existing event', async () => {
      const event = { id: 123, name: 'Test Event' }
      await saveEvent(mockReq, event)
      expect(authorisedRequestStub).to.have.been.calledWith(mockReq, {
        url: `${config.apiRoot}/v4/event/${event.id}`,
        method: 'PATCH',
        body: event,
      })
    })
  })

  describe('#getActiveEvents', () => {
    context(
      'When there is a mix of active and inactive events on the server',
      () => {
        beforeEach(() => {
          this.currentId = '3'

  context('getActiveEvents', () => {
    let clock

    after(() => {
      clock.restore()
    })

    it('should fetch active events at the current point in time when no date supplied', async () => {
      const now = new Date()
      clock = sinon.useFakeTimers({
        now: now,
        shouldAdvanceTime: false,
      })
      const mockedResults = [{ id: '1', name: 'Active Event' }]
      searchStub.resolves({ results: mockedResults })
      const result = await getActiveEvents(mockReq)
      expect(searchStub).to.have.been.calledWith({
        req: mockReq,
        searchEntity: 'event',
        requestBody: {
          sortby: 'name:asc',
          disabled_on: {
            after: now.toISOString(),
            exists: false,
          },
        },
        limit: 100000,
        isAggregation: false,
      })
      expect(result).to.deep.equal(mockedResults)
    })

    it('should fetch active events at the specified point in time', async () => {
      const specificDate = new Date('2024-12-10T12:00:00Z').toISOString()
      const mockedResults = [{ id: '1', name: 'Active Event' }]
      searchStub.resolves({ results: mockedResults })
      const result = await getActiveEvents(mockReq, specificDate)
      expect(searchStub).to.have.been.calledWith({
        req: mockReq,
        searchEntity: 'event',
        requestBody: {
          sortby: 'name:asc',
          disabled_on: {
            after: specificDate,
            exists: false,
          },
        },
        limit: 100000,
        isAggregation: false,
      })
      expect(result).to.deep.equal(mockedResults)
    })
  })
})
