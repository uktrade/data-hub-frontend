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
    this.req = {
      session: { token: 'abcd' },
    }
    this.res = {
      locals: {
        buildQuery: this.sandbox.spy(),
      },
    }

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

  describe('#getInvestmentProjectsCollection', () => {
    describe('expose #findFilter on locals', () => {
      beforeEach(async () => {
        await this.controller.getInvestmentProjectsCollection(this.req, this.res, this.next)
      })

      it('should return undefined if filter not found in options', () => {
        const actual = this.res.locals.findFilter('stage', 'non-existent')
        expect(actual).to.be.undefined
        expect(this.next).to.be.calledOnce
      })

      it('should return label with value prop is absent', () => {
        const actual = this.res.locals.findFilter('estimated_land_date_before', '2018')
        expect(actual).to.be.deep.equal({ label: 'Estimated land date before', value: '2018' })
        expect(this.next).to.be.calledOnce
      })

      it('should return filter from options', () => {
        const actual = this.res.locals.findFilter('sector', 's1')
        expect(actual).to.be.deep.equal({ label: 'Sector', value: 'Sector #1' })
        expect(this.next).to.be.calledOnce
      })
    })

    describe('expose additional properties on locals', () => {
      beforeEach(async () => {
        this.req.query = {
          stage: 'i1',
          sector: 's1',
          sortby: 'name:asc',
        }
        await this.controller.getInvestmentProjectsCollection(this.req, this.res, this.next)
      })

      it('should add results property on locals with pagination', () => {
        const actual = this.res.locals.results
        expect(actual).to.have.property('limit')
        expect(actual).to.have.property('page')
        expect(actual).to.have.property('items')
        expect(actual).to.have.property('pagination')
        expect(this.res.locals.buildQuery).to.have.been.called
      })

      it('should add form.options property on locals with available filter options', () => {
        const actual = this.res.locals.form.options
        expect(actual).to.have.property('stage')
        expect(actual).to.have.property('investment_type')
        expect(actual).to.have.property('sector')
      })

      it('should add form.options.sortby property on locals with available sorting modes', () => {
        const actual = this.res.locals.form.options.sortby
        expect(actual).to.have.length(6)
      })

      it('should add form.data.filters property on locals', () => {
        const actual = this.res.locals.form.data.filters
        expect(actual).to.have.property('stage')
        expect(actual).to.have.property('sector')
      })

      it('should add form.data.sorting property on locals with available sorting modes', () => {
        const actual = this.res.locals.form.data.sorting
        expect(actual).to.deep.equal({ sortby: 'name:asc' })
      })
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
    })
  })
})
