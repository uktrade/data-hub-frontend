const next = function (error) {
  throw Error(error)
}

describe('Search controller #viewCompanyResult', function () {
  beforeEach(() => {
    this.breadcrumbStub = function () { return this }
  })

  it('should route a uk private ltd company', function (done) {
    const appsController = proxyquire('~/src/apps/controllers', {
      './companies/repos': {
        getDitCompany: sinon.stub().resolves({
          id: '9999',
          uk_based: true,
          business_type: {
            id: '9bd14e94-5d95-e211-a939-e4115bead28a',
            name: 'Private limited company',
          },
        }),
      },
    })
    const req = {
      session: {
        token: '1234',
      },
      params: {
        id: '9999',
      },
    }
    const res = {
      locals: {},
      breadcrumb: this.breadcrumbStub,
      redirect: function (url) {
        expect(url).to.equal('/companies/9999')
        done()
      },
    }
    appsController.viewCompanyResult(req, res, next)
  })

  it('should route a uk public ltd company', function (done) {
    const appsController = proxyquire('~/src/apps/controllers', {
      './companies/repos': {
        getDitCompany: sinon.stub().resolves({
          id: '9999',
          uk_based: true,
          business_type: {
            id: '9bd14e94-5d95-e211-a939-e4115bead28a',
            name: 'Public limited company',
          },
        }),
      },
    })
    const req = {
      session: {
        token: '1234',
      },
      params: {
        id: '9999',
      },
    }
    const res = {
      locals: {},
      breadcrumb: this.breadcrumbStub,
      redirect: function (url) {
        expect(url).to.equal('/companies/9999')
        done()
      },
    }
    appsController.viewCompanyResult(req, res, next)
  })

  it('should route a uk public other company', function (done) {
    const appsController = proxyquire('~/src/apps/controllers', {
      './companies/repos': {
        getDitCompany: sinon.stub().resolves({
          id: '9999',
          uk_based: true,
          business_type: {
            id: '9bd14e94-5d95-e211-a939-e4115bead28a',
            name: 'Partnership',
          },
        }),
      },
    })
    const req = {
      session: {
        token: '1234',
      },
      params: {
        id: '9999',
      },
    }
    const res = {
      locals: {},
      breadcrumb: this.breadcrumbStub,
      redirect: function (url) {
        expect(url).to.equal('/companies/9999')
        done()
      },
    }
    appsController.viewCompanyResult(req, res, next)
  })

  it('should route a foreign company', function (done) {
    const appsController = proxyquire('~/src/apps/controllers', {
      './companies/repos': {
        getDitCompany: sinon.stub().resolves({
          id: '9999',
          uk_based: false,
          business_type: {
            id: '9bd14e94-5d95-e211-a939-e4115bead28a',
            name: 'Company',
          },
        }),
      },
    })
    const req = {
      session: {
        token: '1234',
      },
      params: {
        id: '9999',
      },
    }
    const res = {
      locals: {},
      breadcrumb: this.breadcrumbStub,
      redirect: function (url) {
        expect(url).to.equal('/companies/9999')
        done()
      },
    }
    appsController.viewCompanyResult(req, res, next)
  })

  it('should call next if no company is found', function (done) {
    const appsController = proxyquire('~/src/apps/controllers', {
      './companies/repos': {
        getDitCompany: sinon.stub().resolves(undefined),
      },
    })
    const req = {
      session: {
        token: '1234',
      },
      params: {
        id: '9999',
      },
    }
    const res = {
      locals: {},
      breadcrumb: this.breadcrumbStub,
    }
    const nextStub = (error) => {
      try {
        expect(() => {
          throw error
        }).to.throw()
        done()
      } catch (e) {
        done(e)
      }
    }
    appsController.viewCompanyResult(req, res, nextStub)
  })
})
