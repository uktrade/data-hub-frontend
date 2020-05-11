const proxyquire = require('proxyquire')

const paths = require('../../paths')

const investmentData = { investor_company: { name: 'company' } }

describe('Investment projects interactions middleware', () => {
  beforeEach(() => {
    this.getInvestmentStub = sinon.stub().returns(investmentData)
    this.middleware = proxyquire('../interactions', {
      '../repos': {
        getInvestment: this.getInvestmentStub,
      },
    })
    this.req = {
      params: {
        investmentId: '1',
      },
      session: {
        token: 'abcd',
      },
    }
    this.res = {
      locals: {
        paths,
        investment: {
          name: 'investment',
        },
      },
    }
    this.nextSpy = sinon.spy()
  })

  describe('#setInteractionsDetails', () => {
    beforeEach(() => {
      this.middleware.setInteractionsDetails(this.req, this.res, this.nextSpy)
    })

    it('should set the return URL', () => {
      expect(this.res.locals.interactions.returnLink).to.equal(
        '/investments/projects/1/interactions/'
      )
    })

    it('should set the entity name', () => {
      expect(this.res.locals.interactions.entityName).to.equal('investment')
    })

    it('should set the interactions query', () => {
      expect(this.res.locals.interactions.query).to.deep.equal({
        investment_project_id: '1',
      })
    })

    it('should allow interactions to be added', () => {
      expect(this.res.locals.interactions.canAdd).to.be.true
    })
  })
})
