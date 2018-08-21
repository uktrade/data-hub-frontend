describe('Companies interactions middleware', () => {
  beforeEach(() => {
    this.middleware = require('~/src/apps/companies/middleware/interactions')
    this.req = {
      params: {
        companyId: '1',
      },
    }
    this.res = {
      locals: {
        company: {
          name: 'company name',
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
      expect(this.res.locals.interactions.returnLink).to.equal('/companies/1/interactions/')
    })

    it('should set the entity name', () => {
      expect(this.res.locals.interactions.entityName).to.equal('company name')
    })

    it('should set the interactions query', () => {
      expect(this.res.locals.interactions.query).to.equal('company_id=1')
    })
  })
})
