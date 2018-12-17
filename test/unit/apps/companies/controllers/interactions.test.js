const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')

const companyMock = require('~/test/unit/data/companies/minimal-company.json')
const dnbCompanyMock = require('~/test/unit/data/companies/dnb-company.json')
const { setInteractionsDetails } = require('~/src/apps/companies/middleware/interactions')

describe('Companies interactions middleware', () => {
  describe('#setInteractionsDetails', () => {
    const commonTests = (expectedCompanyId, expectedCompanyName) => {
      it('should set the return URL', () => {
        expect(this.middlewareParameters.resMock.locals.interactions.returnLink).to.equal(`/companies/${expectedCompanyId}/interactions/`)
      })

      it('should set the entity name', () => {
        expect(this.middlewareParameters.resMock.locals.interactions.entityName).to.equal(expectedCompanyName)
      })

      it('should set the interactions query', () => {
        expect(this.middlewareParameters.resMock.locals.interactions.query).to.deep.equal({ company_id: expectedCompanyId })
      })
    }

    context('when the company is active', () => {
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

        commonTests(companyMock.id, companyMock.name)

        it('should allow interactions to be added', () => {
          expect(this.middlewareParameters.resMock.locals.interactions.canAdd).to.be.true
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

        commonTests(dnbCompanyMock.id, dnbCompanyMock.name)

        it('should allow interactions to be added', () => {
          expect(this.middlewareParameters.resMock.locals.interactions.canAdd).to.be.true
        })
      })
    })

    context('when the company is archived', () => {
      beforeEach(() => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: {
            ...companyMock,
            archived: true,
          },
        })

        setInteractionsDetails(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      commonTests(companyMock.id, companyMock.name)

      it('should not allow interactions to be added', () => {
        expect(this.middlewareParameters.resMock.locals.interactions.canAdd).to.be.false
      })
    })
  })
})
