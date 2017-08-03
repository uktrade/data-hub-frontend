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

  describe('#handleDefaultFilters', () => {
    it('should redirect to url with default query string when initial query is empty', () => {
      const resMock = {
        redirect: this.sandbox.spy(),
      }
      const currentYear = (new Date()).getFullYear()

      this.controller.handleDefaultFilters(this.req, resMock, this.next)

      expect(resMock.redirect).to.be.calledWith(`/?estimated_land_date_after=${currentYear}-04-05&estimated_land_date_before=${currentYear + 1}-04-06`)
      expect(this.next).to.not.be.called
    })

    it('should redirect to url with default query string when initial query is empty', () => {
      this.req.query = {
        stage: 'i1',
        sector: 's1',
      }
      this.controller.handleDefaultFilters(this.req, this.res, this.next)

      expect(this.next).to.be.called
    })
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
      expect(actual).to.have.property('limit')
      expect(actual).to.have.property('page')
      expect(actual).to.have.property('items')
      expect(actual).to.have.property('pagination')
      expect(actual.count).to.equal(3)
      expect(this.next).to.have.been.calledOnce
    })
  })
})
