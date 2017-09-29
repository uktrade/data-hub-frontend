const { assign } = require('lodash')
const eventCollectionData = require('~/test/unit/data/events/collection.json')

describe('Event collection middleware', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.next = this.sandbox.spy()
    this.req = assign({}, globalReq, {
      session: { token: 'abcd' },
    })
    this.res = assign({}, globalRes)
    this.searchStub = this.sandbox.stub()

    this.controller = proxyquire('~/src/apps/events/middleware/collection', {
      '../../search/services': {
        search: this.searchStub.resolves(eventCollectionData),
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
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

  describe('#getRequestBody', () => {
    it('should not set req.body for empty query', async () => {
      await this.controller.getRequestBody(this.req, this.res, this.next)

      expect(this.req.body).to.be.an('object').and.empty
      expect(this.next).to.have.been.calledOnce
    })

    it('should set req.body for valid query items', async () => {
      this.req.query = {
        sortby: 'modified_on:desc',
        random: 'query',
      }

      await this.controller.getRequestBody(this.req, this.res, this.next)

      expect(this.req.body).to.deep.equal({
        sortby: 'modified_on:desc',
      })
      expect(this.next).to.have.been.calledOnce
    })

    it('should not set req.body invalid items', async () => {
      this.req.query = {
        random: 'query',
        some: 'more',
      }

      await this.controller.getRequestBody(this.req, this.res, this.next)

      expect(this.req.body).to.be.an('object').and.empty
      expect(this.next).to.have.been.calledOnce
    })
  })
})
