describe('OMIS View middleware', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.setHomeBreadcrumbReturnSpy = this.sandbox.spy()
    this.setHomeBreadcrumbStub = this.sandbox.stub().returns(this.setHomeBreadcrumbReturnSpy)

    this.middleware = proxyquire('~/src/apps/omis/apps/view/middleware', {
      '../../../middleware': {
        setHomeBreadcrumb: this.setHomeBreadcrumbStub,
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('setOrderBreadcrumb()', () => {
    it('should call setHomeBreadcrumb with order reference', () => {
      const resMock = {
        locals: {
          order: {
            reference: '12345/AS',
          },
        },
      }
      const nextSpy = this.sandbox.spy()

      this.middleware.setOrderBreadcrumb({}, resMock, nextSpy)

      expect(this.setHomeBreadcrumbStub).to.have.been.calledOnce
      expect(this.setHomeBreadcrumbStub).to.have.been.calledWith('12345/AS')

      expect(this.setHomeBreadcrumbReturnSpy).to.have.been.calledOnce
      expect(this.setHomeBreadcrumbReturnSpy).to.have.been.calledWith({}, resMock, nextSpy)
    })
  })
})
