
const { assign } = require('lodash')

const config = require('~/config')
const orderCollectionData = require('~/test/unit/data/omis/collection.json')

describe('OMIS list middleware', () => {
  beforeEach(() => {
    this.next = sandbox.spy()
    this.req = assign({}, globalReq, {
      session: { token: 'abcd' },
    })
    this.res = assign({}, globalRes)

    this.controller = require('~/src/apps/omis/apps/list/middleware')
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('Results', () => {
    beforeEach(() => {
      this.nockScope = nock(config.apiRoot)
        .post(`/v3/search/order`)
        .reply(200, orderCollectionData)
    })

    context('#setCollectionResults', () => {
      beforeEach(async () => {
        this.req.query = {
          status: 'draft',
          company_name: 'samsung',
          sortby: 'name:asc',
        }
        await this.controller.setCollectionResults(this.req, this.res, this.next)
      })

      it('should set results property on locals with pagination', () => {
        const actual = this.res.locals.results
        expect(actual).to.have.property('count')
        expect(actual).to.have.property('items')
        expect(actual).to.have.property('pagination')
        expect(actual.count).to.equal(3)
        expect(this.next).to.have.been.calledOnce
      })

      it('nock mocked scope has been called', () => {
        expect(this.nockScope.isDone()).to.be.true
      })
    })

    context('#setReconciliationResults', () => {
      beforeEach(async () => {
        this.req.query = {
          status: 'draft',
          company_name: 'samsung',
          sortby: 'name:asc',
        }
        await this.controller.setCollectionResults(this.req, this.res, this.next)
      })

      it('should set results property on locals with pagination', () => {
        const actual = this.res.locals.results
        expect(actual).to.have.property('count')
        expect(actual).to.have.property('items')
        expect(actual).to.have.property('pagination')
        expect(actual.count).to.equal(3)
        expect(this.next).to.have.been.calledOnce
      })

      it('nock mocked scope has been called', () => {
        expect(this.nockScope.isDone()).to.be.true
      })
    })
  })

  describe('#setRequestBody', () => {
    it('should not set req.body for empty query', async () => {
      await this.controller.setRequestBody(this.req, this.res, this.next)

      expect(this.req.body).to.be.an('object').and.empty
      expect(this.next).to.have.been.calledOnce
    })

    it('should set req.body for valid query items', async () => {
      this.req.query = {
        status: 'draft',
        company_name: 'samsung',
        sortby: 'name:asc',
        random: 'query',
      }

      await this.controller.setRequestBody(this.req, this.res, this.next)

      expect(this.req.body).to.deep.equal({
        status: 'draft',
        company_name: 'samsung',
        sortby: 'name:asc',
      })
      expect(this.next).to.have.been.calledOnce
    })

    it('should not set req.body invalid items', async () => {
      this.req.query = {
        random: 'query',
        some: 'more',
      }

      await this.controller.setRequestBody(this.req, this.res, this.next)

      expect(this.req.body).to.be.an('object').and.empty
      expect(this.next).to.have.been.calledOnce
    })

    context('when a currency field is searched on', () => {
      it('should transform value to pence', async () => {
        this.req.query = {
          random: 'query',
          total_cost: '10.00',
        }

        await this.controller.setRequestBody(this.req, this.res, this.next)

        expect(this.req.body).to.deep.equal({
          total_cost: 1000,
        })
        expect(this.next).to.have.been.calledOnce
      })
    })
  })
})
