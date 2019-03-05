const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')

const companyMock = require('~/test/unit/data/companies/minimal-company.json')
const dnbCompanyMock = require('~/test/unit/data/companies/dnb-company.json')
const { setInteractionsDetails } = require('~/src/apps/companies/middleware/interactions')

describe('Interactions middleware', () => {
  describe('#setInteractionsDetails', () => {
    const commonTests = ({
      expectedTemplate,
      expectedReturnLink,
      expectedEntityName,
      expectedQuery,
      expectedAddFlag,
    }) => {
      it('should set the view', () => {
        expect(this.middlewareParameters.resMock.locals.interactions.view).to.equal(expectedTemplate)
      })

      it('should set the return link', () => {
        expect(this.middlewareParameters.resMock.locals.interactions.returnLink).to.equal(expectedReturnLink)
      })

      it('should set the entity name', () => {
        expect(this.middlewareParameters.resMock.locals.interactions.entityName).to.equal(expectedEntityName)
      })

      it('should set the query', () => {
        expect(this.middlewareParameters.resMock.locals.interactions.query).to.deep.equal(expectedQuery)
      })

      it('should set the add flag', () => {
        expect(this.middlewareParameters.resMock.locals.interactions.canAdd).to.equal(expectedAddFlag)
      })

      it('should call next once', () => {
        expect(this.middlewareParameters.nextSpy).to.be.calledWithExactly()
        expect(this.middlewareParameters.nextSpy).to.be.calledOnce
      })
    }

    context('when the company does not have a DUNS number', () => {
      beforeEach(() => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
        })

        setInteractionsDetails(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      commonTests({
        expectedTemplate: 'companies/views/_deprecated/interactions',
        expectedReturnLink: '/companies/72fda78f-bdc3-44dc-9c22-c8ac82f7bda4/interactions/',
        expectedEntityName: 'SAMSUNG BIOEPIS UK LIMITED',
        expectedQuery: { company_id: '72fda78f-bdc3-44dc-9c22-c8ac82f7bda4' },
        expectedAddFlag: true,
      })
    })
    
    context('when the company does have a DUNS number', () => {
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

      commonTests({
        expectedTemplate: 'companies/views/interactions',
        expectedReturnLink: '/companies/375094ac-f79a-43e5-9c88-059a7caa17f0/interactions/',
        expectedEntityName: 'One List Corp',
        expectedQuery: { company_id: '375094ac-f79a-43e5-9c88-059a7caa17f0' },
        expectedAddFlag: true,
      })
    })
  })
})
