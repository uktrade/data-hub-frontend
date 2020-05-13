const buildMiddlewareParameters = require('../../../../../../test/unit/helpers/middleware-parameters-builder')

const companyMock = require('../../../../../../test/unit/data/companies/company-v4.json')

describe('Company export controller', () => {
  let middlewareParameters
  let controller

  beforeEach(() => {
    controller = require('../controllers')
  })

  describe('#renderExports', () => {
    beforeEach(() => {
      middlewareParameters = buildMiddlewareParameters({
        company: companyMock,
      })

      controller.renderExports(
        middlewareParameters.reqMock,
        middlewareParameters.resMock
      )
    })

    it('should render the correct view', () => {
      expect(middlewareParameters.resMock.render.args[0][0]).to.equal(
        'companies/apps/exports/views/index'
      )
      expect(middlewareParameters.resMock.render).to.have.been.calledOnce
    })

    it('should exports to view', () => {
      expect(middlewareParameters.resMock.render.args[0][1]).to.have.property(
        'props'
      )
    })
  })
})
