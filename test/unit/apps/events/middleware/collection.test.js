const { assign } = require('lodash')
const nock = require('nock')
const config = require('~/config')
const eventCollectionData = require('~/test/unit/data/events/collection.json')

describe('Event collection middleware', () => {
  beforeEach(() => {
    nock(config.apiRoot)
      .post(`/v3/search/event`)
      .reply(200, eventCollectionData)

    this.sandbox = sinon.sandbox.create()
    this.next = this.sandbox.spy()
    this.req = assign({}, globalReq, {
      session: { token: 'abcd' },
    })
    this.res = assign({}, globalRes)

    this.controller = require('~/src/apps/events/middleware/collection')
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#getEventsCollection', () => {
    beforeEach(async () => {
      this.req.query = {
        sortby: 'modified_on:desc',
      }
      await this.controller.getEventsCollection(this.req, this.res, this.next)
    })

    it('should set results property on locals with pagination', () => {
      const actual = this.res.locals.results
      expect(actual).to.have.property('count')
      expect(actual).to.have.property('items')
      expect(actual).to.have.property('pagination')
      expect(actual.count).to.equal(3)
      expect(this.next).to.have.been.calledOnce
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
