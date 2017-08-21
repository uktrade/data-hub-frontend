const nock = require('nock')
const config = require('~/config')
const investmentCollectioData = require('~/test/unit/data/investment/collection.json')

describe('Investment projects collection middleware', () => {
  beforeEach(() => {
    nock(config.apiRoot)
      .post(`/v3/search/investment_project`)
      .reply(200, investmentCollectioData)

    this.sandbox = sinon.sandbox.create()
    this.next = this.sandbox.spy()
    this.req = Object.assign({}, globalReq, {
      session: { token: 'abcd' },
    })
    this.res = Object.assign({}, globalRes)

    this.controller = require('~/src/apps/investment-projects/middleware/collection')
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#getInvestmentProjectsCollection', () => {
    beforeEach(async () => {
      this.req.query = {
        stage: 'i1',
        sector: 's1',
        sortby: 'name:asc',
      }
      await this.controller.getInvestmentProjectsCollection(this.req, this.res, this.next)
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
        stage: 'i1',
        sector: 's1',
        sortby: 'name:asc',
        random: 'query',
      }

      await this.controller.getRequestBody(this.req, this.res, this.next)

      expect(this.req.body).to.deep.equal({
        stage: 'i1',
        sector: 's1',
        sortby: 'name:asc',
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
