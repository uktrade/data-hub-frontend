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
    const commonTests = () => {
      it('should set the return URL', () => {
        expect(this.res.locals.interactions.returnLink).to.equal('/companies/1/interactions/')
      })

      it('should set the entity name', () => {
        expect(this.res.locals.interactions.entityName).to.equal('company name')
      })

      it('should set the interactions query', () => {
        expect(this.res.locals.interactions.query).to.deep.equal({ company_id: '1' })
      })
    }

    context('when the company is active', () => {
      beforeEach(() => {
        this.middleware.setInteractionsDetails(this.req, this.res, this.nextSpy)
      })

      commonTests()

      it('should allow interactions to be added', () => {
        expect(this.res.locals.interactions.canAdd).to.be.true
      })
    })

    context('when the company is archived', () => {
      beforeEach(() => {
        this.res = {
          ...this.res,
          locals: {
            ...this.res.locals,
            company: {
              ...this.res.locals.company,
              archived: true,
            },
          },
        }

        this.middleware.setInteractionsDetails(this.req, this.res, this.nextSpy)
      })

      commonTests()

      it('should not allow interactions to be added', () => {
        expect(this.res.locals.interactions.canAdd).to.be.false
      })
    })
  })
})
