const config = require('~/config')
const hierarchiesMiddleware = require('~/src/apps/companies/middleware/hierarchies')

describe('Company hierarchies middleware', () => {
  beforeEach(() => {
    this.resMock = {
      ...globalRes,
      redirect: sinon.spy(),
    }

    this.reqMock = {
      ...globalReq,
      session: {},
      params: {},
      flash: sinon.spy(),
    }

    this.nextSpy = sinon.spy()

    this.parentCompanyId = '1'
    this.subsidiaryCompanyId = '2'
  })

  describe('#setGlobalHQ', () => {
    beforeEach(() => {
      this.reqMock.params = {
        companyId: this.subsidiaryCompanyId,
        globalHqId: this.parentCompanyId,
      }
    })

    context('company update works', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .patch(`/v3/company/${this.subsidiaryCompanyId}`, {
            global_headquarters: this.parentCompanyId,
          })
          .reply(200, { id: this.subsidiaryCompanyId })

        await hierarchiesMiddleware.setGlobalHQ(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call the API with the correct params', () => {
        expect(nock.isDone()).to.be.true
      })

      it('should redirect', () => {
        expect(this.resMock.redirect).to.have.been.calledOnce
        expect(this.resMock.redirect).to.be.calledWith(`/companies/${this.subsidiaryCompanyId}/details`)
      })

      it('should call flash', () => {
        expect(this.reqMock.flash).to.have.been.calledOnce
        expect(this.reqMock.flash).to.be.calledWith('success', 'You’ve linked the Global Headquarters')
      })
    })

    context('updateCompany returns error 500', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .patch(`/v3/company/${this.subsidiaryCompanyId}`, {
            global_headquarters: this.parentCompanyId,
          })
          .reply(500, 'Error message')

        await hierarchiesMiddleware.setGlobalHQ(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call next', () => {
        expect(this.nextSpy.calledOnce).to.be.true

        expect(this.nextSpy).to.be.calledWith(sinon.match({
          message: '500 - "Error message"',
        }))
      })

      it('should not set a flash message', () => {
        expect(this.reqMock.flash).to.not.be.called
      })
    })

    context('updateCompany returns error 400', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .patch(`/v3/company/${this.subsidiaryCompanyId}`, {
            global_headquarters: this.parentCompanyId,
          })
          .reply(400, { error: 'Error message' })

        await hierarchiesMiddleware.setGlobalHQ(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should redirect', () => {
        expect(this.resMock.redirect).to.have.been.calledOnce
        expect(this.resMock.redirect).to.be.calledWith(`/companies/${this.subsidiaryCompanyId}/details`)
      })

      it('should call flash', () => {
        expect(this.reqMock.flash).to.have.been.calledOnce
        expect(this.reqMock.flash).to.be.calledWith('error', 'There has been an error')
      })
    })
  })

  describe('#removeGlobalHQ', () => {
    beforeEach(() => {
      this.reqMock.params = {
        companyId: this.subsidiaryCompanyId,
      }
    })

    context('updateCompany resolves', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .patch(`/v3/company/${this.subsidiaryCompanyId}`, {
            global_headquarters: null,
          })
          .reply(200, { id: this.subsidiaryCompanyId })

        await hierarchiesMiddleware.removeGlobalHQ(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call the API with the correct params', () => {
        expect(nock.isDone()).to.be.true
      })

      it('should redirect', () => {
        expect(this.resMock.redirect).to.have.been.calledOnce
        expect(this.resMock.redirect).to.be.calledWith(`/companies/${this.subsidiaryCompanyId}/details`)
      })

      it('should call flash', () => {
        expect(this.reqMock.flash).to.have.been.calledOnce
        expect(this.reqMock.flash).to.be.calledWith('success', 'You’ve removed the link to Global Headquarters')
      })
    })

    context('updateCompany returns error 500', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .patch(`/v3/company/${this.subsidiaryCompanyId}`, {
            global_headquarters: null,
          })
          .reply(500, 'Error message')

        await hierarchiesMiddleware.removeGlobalHQ(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call next', () => {
        expect(this.nextSpy.calledOnce).to.be.true
        expect(this.nextSpy).to.be.calledWith(sinon.match({
          message: '500 - "Error message"',
        }))
      })
    })

    context('update company rejects with 400', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .patch(`/v3/company/${this.subsidiaryCompanyId}`, {
            global_headquarters: null,
          })
          .reply(400, { error: 'Error message' })

        await hierarchiesMiddleware.removeGlobalHQ(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should redirect', () => {
        expect(this.resMock.redirect).to.have.been.calledOnce
        expect(this.resMock.redirect).to.be.calledWith(`/companies/${this.subsidiaryCompanyId}/details`)
      })

      it('should call flash', () => {
        expect(this.reqMock.flash).to.have.been.calledOnce
        expect(this.reqMock.flash).to.be.calledWith('error', 'There has been an error')
      })
    })
  })
})
