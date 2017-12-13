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
    this.nextSpy = sandbox.spy()
  })

  describe('#setInteractionsReturnUrl', () => {
    it('should set the return URL', () => {
      this.middleware.setInteractionsReturnUrl(this.req, this.res, this.nextSpy)
      expect(this.res.locals.returnLink).to.equal('/companies/1/interactions/')
    })
  })

  describe('#setInteractionsEntityName', () => {
    it('should set the entity name', () => {
      this.middleware.setInteractionsEntityName(this.req, this.res, this.nextSpy)
      expect(this.res.locals.entityName).to.equal('company name')
    })
  })
})
