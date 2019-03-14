const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')

const controller = require('~/src/apps/companies/apps/investments/growth-capital-profile/controllers')
const companyMock = require('~/test/unit/data/companies/minimal-company.json')
const dnbCompanyMock = require('~/test/unit/data/companies/dnb-company.json')

describe('Company investments - growth capital profile', () => {
  describe('#renderInvestmentsGrowthCapitalProfile', () => {
    const commonTests = (view) => {
      it('should call the render function once', () => {
        expect(this.middlewareParameters.resMock.render).to.have.been.calledOnce
      })

      it('should call the render function with the correct view', () => {
        expect(this.middlewareParameters.resMock.render.args[0][0]).to.equal(view)
      })
    }

    context('when the company does not have a DUNS number', () => {
      beforeEach(() => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
        })

        controller.renderGrowthCapitalProfile(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      commonTests('companies/apps/investments/growth-capital-profile/views/list-deprecated')
    })

    context('when the company does has a DUNS number', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: dnbCompanyMock,
        })

        controller.renderGrowthCapitalProfile(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      commonTests('companies/apps/investments/growth-capital-profile/views/list')
    })

    context('when the company does not have a DUNS number and the companies new layout feature is enabled', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          features: {
            'companies-new-layout': true,
          },
        })

        controller.renderGrowthCapitalProfile(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      commonTests('companies/apps/investments/growth-capital-profile/views/list')
    })
  })
})
