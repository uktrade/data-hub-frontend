const { assign } = require('lodash')
const eventCollectionData = require('~/test/unit/data/events/collection.json')

describe('Event collection middleware', () => {
  beforeEach(() => {
    this.next = sinon.spy()
    this.req = assign({}, globalReq, {
      session: { token: 'abcd' },
    })
    this.res = assign({}, globalRes)
    this.searchStub = sinon.stub()

    this.controller = proxyquire('~/src/apps/events/middleware/collection', {
      '../../search/services': {
        search: this.searchStub.resolves(eventCollectionData),
      },
    })
  })

  describe('#getEventsCollection', () => {
    beforeEach(() => {
      this.req.query = {
        sortby: 'modified_on:desc',
      }
    })

    context('when success', () => {
      it('should with correct options', async () => {
        await this.controller.getEventsCollection(this.req, this.res, this.next)

        expect(this.searchStub).to.have.been.calledWith(sinon.match({
          searchEntity: 'event',
          token: this.req.session.token,
          isAggregation: false,
        }))
      })

      it('should set results property on locals with pagination', async () => {
        await this.controller.getEventsCollection(this.req, this.res, this.next)

        const actual = this.res.locals.results
        expect(actual).to.have.property('count')
        expect(actual).to.have.property('items')
        expect(actual).to.have.property('pagination')
        expect(actual.count).to.equal(3)
        expect(this.next).to.have.been.calledOnce
      })
    })

    context('when error', () => {
      it('should call next middleware with error', async () => {
        const error = Error('nope')
        this.searchStub.rejects(error)
        await this.controller.getEventsCollection(this.req, this.res, this.next)

        expect(this.next).to.have.been.calledWith(error)
      })
    })
  })
})
