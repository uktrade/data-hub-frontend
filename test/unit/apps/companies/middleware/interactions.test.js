const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')

const dnbCompanyMock = require('~/test/unit/data/companies/dnb-company.json')
const { setInteractionsDetails } = require('~/src/apps/companies/middleware/interactions')

describe('Interactions middleware', () => {
  describe('#setInteractionsDetails', () => {
    beforeEach(() => {
      this.middlewareParameters = buildMiddlewareParameters({
        company: dnbCompanyMock,
      })

      setInteractionsDetails(
        this.middlewareParameters.reqMock,
        this.middlewareParameters.resMock,
        this.middlewareParameters.nextSpy,
      )
    })

    it('should set the view', () => {
      expect(this.middlewareParameters.resMock.locals.interactions.view).to.equal('companies/views/interactions')
    })

    it('should set the return link', () => {
      expect(this.middlewareParameters.resMock.locals.interactions.returnLink).to.equal('/companies/375094ac-f79a-43e5-9c88-059a7caa17f0/interactions/')
    })

    it('should set the entity name', () => {
      expect(this.middlewareParameters.resMock.locals.interactions.entityName).to.equal('One List Corp')
    })

    it('should set the query', () => {
      expect(this.middlewareParameters.resMock.locals.interactions.query).to.deep.equal({ company_id: '375094ac-f79a-43e5-9c88-059a7caa17f0' })
    })

    it('should set the add flag', () => {
      expect(this.middlewareParameters.resMock.locals.interactions.canAdd).to.equal(true)
    })

    it('should call next once', () => {
      expect(this.middlewareParameters.nextSpy).to.be.calledWithExactly()
      expect(this.middlewareParameters.nextSpy).to.be.calledOnce
    })
  })
})
