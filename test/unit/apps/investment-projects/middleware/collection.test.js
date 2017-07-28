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
    this.res = Object.assign({}, globalRes, {
      locals: {
        buildQuery: this.sandbox.spy(),
      },
    })

    this.controller = proxyquire('~/src/apps/investment-projects/middleware/collection', {
      '../../../lib/metadata': {
        investmentStageOptions: [
          { id: 'i1', name: 'Investment stage #1' },
          { id: 'i2', name: 'Investment stage #2' },
        ],
        investmentTypeOptions: [
          { id: 't1', name: 'Investment type #1' },
          { id: 't2', name: 'Investment type #2' },
        ],
        sectorOptions: [
          { id: 's1', name: 'Sector #1' },
          { id: 's2', name: 'Sector #2' },
        ],
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#getInvestmentFilters', () => {
    beforeEach(async () => {
      this.req.query = {
        stage: 'i1',
        sector: 's1',
        sortby: 'name:asc',
      }
      await this.controller.getInvestmentFilters(this.req, this.res, this.next)
    })

    it('should set selectedFiltersHumanised property on locals', () => {
      expect(this.res.locals.selectedFiltersHumanised.stage).to.deep.equal(
        { value: 'Investment stage #1', label: 'Stage' },
        { value: 'Sector #1', label: 'Sector' }
      )
      expect(this.next).to.have.been.calledOnce
    })

    it('should set form.options property on locals with available filter options', () => {
      const actual = this.res.locals.form.options
      expect(actual).to.have.property('stage')
      expect(actual).to.have.property('investment_type')
      expect(actual).to.have.property('sector')
      expect(this.next).to.have.been.calledOnce
    })

    it('should set form.options.sortby property on locals with available sorting modes', () => {
      const actual = this.res.locals.form.options.sortby
      expect(actual).to.have.length(6)
      expect(this.next).to.have.been.calledOnce
    })

    it('should set form.data.filters property on locals', () => {
      const actual = this.res.locals.form.data.filters
      expect(actual).to.have.property('stage')
      expect(actual).to.have.property('sector')
      expect(this.next).to.have.been.calledOnce
    })

    it('should set form.data.sorting property on locals with available sorting modes', () => {
      const actual = this.res.locals.form.data.sorting
      expect(actual).to.deep.equal({ sortby: 'name:asc' })
      expect(this.next).to.have.been.calledOnce
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
      expect(this.res.locals.buildQuery).to.have.been.called
      expect(this.next).to.have.been.calledOnce
    })
  })

  describe('#setDefaults', async () => {
    beforeEach(async () => {
      await this.controller.setDefaults(this.req, this.res, this.next)
    })

    it('should set default query on req object', () => {
      const actual = this.req.query
      expect(actual).to.have.ownProperty('estimated_land_date_before')
      expect(actual).to.have.ownProperty('estimated_land_date_after')
      expect(actual).to.have.ownProperty('sortby')
      expect(this.next).to.have.been.calledOnce
    })
  })
})
