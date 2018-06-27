
const config = require('~/config')
const investmentCollectioData = require('~/test/unit/data/investment/collection.json')

describe('Investment projects collection middleware', () => {
  beforeEach(() => {
    this.next = sinon.spy()
    this.req = Object.assign({}, globalReq, {
      session: { token: 'abcd' },
    })
    this.res = Object.assign({}, globalRes)
    this.controller = require('~/src/apps/investment-projects/middleware/collection')
  })

  describe('#getInvestmentProjectsCollection', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .post(`/v3/search/investment_project`)
        .reply(200, investmentCollectioData)
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
})
