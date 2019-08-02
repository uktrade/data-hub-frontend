const buildMiddlewareParameters = require('test/unit/helpers/middleware-parameters-builder.js')

const companyMock = require('test/unit/data/companies/company-v4.json')
const { setInteractionsDetails } = require('src/apps/companies/middleware/interactions')

describe('Interactions middleware', () => {
  describe('#setInteractionsDetails', () => {
    context('when browsing and the route is "/interactions"', () => {
      beforeEach(() => {
        this.middlewareParameters = buildMiddlewareParameters({
          requestPath: '/interactions',
          company: companyMock,
        })

        setInteractionsDetails(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should redirect to the activity', () => {
        expect(this.middlewareParameters.resMock.redirect).to.have.been.calledOnceWithExactly(301, 'activity')
      })

      it('should not set the interactions object on locals', () => {
        expect(this.middlewareParameters.resMock.locals.interactions).to.not.exist
      })
    })

    context('when browsing and the route is not "/interactions"', () => {
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

      it('should set the view', () => {
        expect(this.middlewareParameters.resMock.locals.interactions.view).to.equal('companies/views/interactions')
      })

      it('should set the return link', () => {
        expect(this.middlewareParameters.resMock.locals.interactions.returnLink).to.equal(`/companies/${companyMock.id}/interactions/`)
      })

      it('should set the entity name', () => {
        expect(this.middlewareParameters.resMock.locals.interactions.entityName).to.equal(companyMock.name)
      })

      it('should set the query', () => {
        expect(this.middlewareParameters.resMock.locals.interactions.query).to.deep.equal({ company_id: companyMock.id })
      })

      it('should set the add flag', () => {
        expect(this.middlewareParameters.resMock.locals.interactions.canAdd).to.equal(true)
      })

      it('should set the show company flag', () => {
        expect(this.middlewareParameters.resMock.locals.interactions.showCompany).to.equal(false)
      })

      it('should set the breadcrumbs', () => {
        expect(this.middlewareParameters.resMock.locals.interactions.breadcrumbs).to.deep.equal([
          {
            href: `/companies/${companyMock.id}`,
            text: companyMock.name,
          },
          {
            href: `/companies/${companyMock.id}/interactions`,
            text: 'Interactions',
          },
        ])
      })

      it('should call next once', () => {
        expect(this.middlewareParameters.nextSpy).to.be.calledWithExactly()
        expect(this.middlewareParameters.nextSpy).to.be.calledOnce
      })
    })
  })
})
