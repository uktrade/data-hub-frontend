const buildMiddlewareParameters = require('test/unit/helpers/middleware-parameters-builder.js')

describe('Investment create invenstor profile controller', () => {
  beforeEach(async () => {
    this.middlewareParameters = await buildMiddlewareParameters({ 'test': 'test' })
  })

  describe('#renderCreateInvestorProfileView', () => {
    beforeEach(async () => {
      const controller = require('src/apps/investments/controllers/create/investor-profile')

      await controller.renderCreateInvestorProfilePage(
        this.middlewareParameters.reqMock,
        this.middlewareParameters.resMock,
        this.middlewareParameters.nextSpy)
    })

    it('should render', () => {
      expect(this.middlewareParameters.resMock.render).to.be.calledOnce
    })

    it('should render the collection template', () => {
      expect(this.middlewareParameters.resMock.render.firstCall.args[0]).to
        .equal('investments/views/create/investor-profile')
    })

    it('should set breadcrumb', () => {
      expect(this.middlewareParameters.resMock.breadcrumb).to.have.been.calledOnce
    })

    it('should set the company breadcrumb', () => {
      expect(this.middlewareParameters.resMock.breadcrumb).to.be
        .calledWith('Create a large capital investor profile')
    })
  })
})
