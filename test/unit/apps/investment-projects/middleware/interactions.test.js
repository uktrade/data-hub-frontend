const investmentData = { investor_company: { name: 'company' } }

describe('Investment projects interactions middleware', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.getInvestmentStub = this.sandbox.stub().returns(investmentData)
    this.middleware = proxyquire('~/src/apps/investment-projects/middleware/interactions', {
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
        investmentData: {
          name: 'investment',
        },
      },
    }
    this.nextSpy = this.sandbox.spy()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#setInteractionsReturnUrl', () => {
    it('should set the return URL', () => {
      this.middleware.setInteractionsReturnUrl(this.req, this.res, this.nextSpy)
      expect(this.res.locals.returnLink).to.equal('/investment-projects/1/interactions/')
    })
  })

  describe('#setInteractionsEntityName', () => {
    it('should set the entity name', () => {
      this.middleware.setInteractionsEntityName(this.req, this.res, this.nextSpy)
      expect(this.res.locals.entityName).to.equal('investment')
    })
  })

  describe('#setCompanyDetails', () => {
    it('should set the entity name', async () => {
      await this.middleware.setCompanyDetails(this.req, this.res, this.nextSpy)
      expect(this.res.locals.company).to.deep.equal(investmentData.investor_company)
    })
  })
})
