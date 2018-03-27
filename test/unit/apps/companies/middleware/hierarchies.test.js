describe('Company hierarchies middleware', () => {
  beforeEach(() => {
    this.mockUpdateCompany = sandbox.stub()
    this.controller = proxyquire('~/src/apps/companies/middleware/hierarchies', {
      '../repos': {
        updateCompany: this.mockUpdateCompany,
      },
    })
    this.resMock = {
      ...globalRes,
      redirect: sandbox.spy(),
    }
    this.reqMock = {
      ...globalReq,
      session: {},
      params: {},
      flash: sandbox.spy(),
    }
    this.nextSpy = sandbox.spy()
  })

  describe('#setGlobalHQ', () => {
    beforeEach(() => {
      this.mockCompanyId = 'mock-company-id'
      this.reqMock.params = {
        companyId: this.mockCompanyId,
        globalHqId: 'mock-ghq-id',
      }
    })

    context('updateCompany resolves', () => {
      beforeEach(async () => {
        this.mockUpdateCompany.resolves({ id: this.mockCompanyId })
        await this.controller.setGlobalHQ(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should redirect', () => {
        expect(this.resMock.redirect).to.have.been.calledOnce
        expect(this.resMock.redirect).to.be.calledWith(`/companies/${this.mockCompanyId}/details`)
      })

      it('should call flash', () => {
        expect(this.reqMock.flash).to.have.been.calledOnce
        expect(this.reqMock.flash).to.be.calledWith('success', 'You’ve linked the Global HQ')
      })
    })

    context('updateCompany rejects', () => {
      beforeEach(async () => {
        this.mockUpdateCompany.rejects({ statusCode: 500, error: 'whoa!' })
        await this.controller.setGlobalHQ(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call next', () => {
        expect(this.nextSpy.calledOnce).to.be.true
        expect(this.nextSpy).to.be.calledWith()
      })
    })

    context('updateCompany rejects with 400', () => {
      beforeEach(async () => {
        this.mockErrorMsg = ['whoa something ain’t right!']
        this.mockUpdateCompany.rejects({
          statusCode: 400,
          error: {
            global_headquarters: this.mockErrorMsg,
          },
        })
        await this.controller.setGlobalHQ(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should redirect', () => {
        expect(this.resMock.redirect).to.have.been.calledOnce
        expect(this.resMock.redirect).to.be.calledWith(`/companies/${this.mockCompanyId}/details`)
      })

      it('should call flash', () => {
        expect(this.reqMock.flash).to.have.been.calledOnce
        expect(this.reqMock.flash).to.be.calledWith('error', this.mockErrorMsg[0])
      })
    })
  })

  describe('#removeGlobalHQ', () => {
    beforeEach(() => {
      this.mockCompanyId = 'mock-company-id'
      this.reqMock.params = {
        companyId: this.mockCompanyId,
        globalHqId: 'mock-ghq-id',
      }
    })

    context('updateCompany resolves', () => {
      beforeEach(async () => {
        this.mockUpdateCompany.resolves({ id: this.mockCompanyId })
        await this.controller.removeGlobalHQ(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should redirect', () => {
        expect(this.resMock.redirect).to.have.been.calledOnce
        expect(this.resMock.redirect).to.be.calledWith(`/companies/${this.mockCompanyId}/details`)
      })

      it('should call flash', () => {
        expect(this.reqMock.flash).to.have.been.calledOnce
        expect(this.reqMock.flash).to.be.calledWith('success', 'You’ve removed the link to Global HQ')
      })
    })

    context('updateCompany rejects', () => {
      beforeEach(async () => {
        this.mockUpdateCompany.rejects({ statusCode: 500, error: 'whoa!' })
        await this.controller.removeGlobalHQ(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call next', () => {
        expect(this.nextSpy.calledOnce).to.be.true
        expect(this.nextSpy).to.be.calledWith()
      })
    })

    context('update company rejects with 400', () => {
      beforeEach(async () => {
        this.mockErrorMsg = ['whoa something ain’t right!']
        this.mockUpdateCompany.rejects({
          statusCode: 400,
          error: {
            global_headquarters: this.mockErrorMsg,
          },
        })
        await this.controller.removeGlobalHQ(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should redirect', () => {
        expect(this.resMock.redirect).to.have.been.calledOnce
        expect(this.resMock.redirect).to.be.calledWith(`/companies/${this.mockCompanyId}/details`)
      })

      it('should call flash', () => {
        expect(this.reqMock.flash).to.have.been.calledOnce
        expect(this.reqMock.flash).to.be.calledWith('error', this.mockErrorMsg[0])
      })
    })
  })
})
