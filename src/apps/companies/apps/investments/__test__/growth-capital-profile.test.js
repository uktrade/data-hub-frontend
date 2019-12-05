const buildMiddlewareParameters = require('../../../../../../test/unit/helpers/middleware-parameters-builder')

const controller = require('../growth-capital-profile/controllers')
const companyMock = require('../../../../../../test/unit/data/companies/minimal-company.json')

describe('Company investments - growth capital profile', () => {
  describe('#renderInvestmentsGrowthCapitalProfile', () => {
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

    it('should call the render function once', () => {
      expect(this.middlewareParameters.resMock.render).to.have.been.calledOnce
    })

    it('should call the render function with the correct view', () => {
      expect(this.middlewareParameters.resMock.render.args[0][0]).to.equal('companies/apps/investments/growth-capital-profile/views/list')
    })
  })
})
