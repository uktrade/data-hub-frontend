const buildMiddlewareParameters = require('../../../../../test/unit/helpers/middleware-parameters-builder')

const companyMock = require('../../../../../test/unit/data/companies/minimal-company.json')
const { setInteractionsDetails } = require('../../middleware/interactions')

describe('Companies interactions middleware', () => {
  let middlewareParameters
  describe('#setInteractionsDetails', () => {
    function commonTests(expectedCompanyId, expectedCompanyName) {
      it('should set the return URL', () => {
        expect(
          middlewareParameters.resMock.locals.interactions.returnLink
        ).to.equal(`/companies/${expectedCompanyId}/interactions`)
      })

      it('should set the entity name', () => {
        expect(
          middlewareParameters.resMock.locals.interactions.entityName
        ).to.equal(expectedCompanyName)
      })

      it('should set the interactions query', () => {
        expect(
          middlewareParameters.resMock.locals.interactions.query
        ).to.deep.equal({ company_id: expectedCompanyId })
      })
    }

    context('when the company is active', () => {
      beforeEach(() => {
        middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
        })

        setInteractionsDetails(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      commonTests(companyMock.id, companyMock.name)

      it('should allow interactions to be added', () => {
        expect(middlewareParameters.resMock.locals.interactions.canAdd).to.be
          .true
      })
    })

    context('when the company is archived', () => {
      beforeEach(() => {
        middlewareParameters = buildMiddlewareParameters({
          company: {
            ...companyMock,
            archived: true,
          },
        })

        setInteractionsDetails(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      commonTests(companyMock.id, companyMock.name)

      it('should not allow interactions to be added', () => {
        expect(middlewareParameters.resMock.locals.interactions.canAdd).to.be
          .false
      })
    })
  })
})
