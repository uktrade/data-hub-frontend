const { assign } = require('lodash')

const FormController = require('~/src/apps/omis/controllers/form')
const companyMock = require('~/test/unit/data/company.json')

describe('OMIS CreateController', () => {
  beforeEach(() => {
    this.nextSpy = sandbox.spy()
    this.errorSpy = sandbox.spy()
    this.getDitCompanyStub = sandbox.stub().resolves(companyMock)

    this.ControllerClass = proxyquire('~/src/apps/omis/controllers/create', {
      '../../companies/repos': {
        getDitCompany: this.getDitCompanyStub,
      },
      '../../../../config/logger': {
        error: this.errorSpy,
      },
    })

    this.controller = new this.ControllerClass({ route: '/' })
  })

  describe('middlewareLocals()', () => {
    beforeEach(() => {
      sandbox.stub(FormController.prototype, 'middlewareLocals')
      sandbox.stub(this.controller, 'use')

      this.controller.middlewareLocals()
    })

    it('should call parent method', () => {
      expect(FormController.prototype.middlewareLocals).to.have.been.calledOnce
    })

    it('should call set company method', () => {
      expect(this.controller.use).to.have.been.calledWith(this.controller.setCompany)
    })
  })

  describe('setCompany()', () => {
    context('when a company exists in the session', () => {
      beforeEach(async () => {
        this.reqMock = assign({}, globalReq, {
          session: {
            token: '12345',
          },
          sessionModel: {
            get: () => companyMock.id,
          },
        })
        this.resMock = {
          locals: {},
        }
      })

      context('when company promise is resolved', () => {
        beforeEach(async () => {
          await this.controller.setCompany(this.reqMock, this.resMock, this.nextSpy)
        })

        it('should call get company method', () => {
          expect(this.getDitCompanyStub).to.be.calledOnce
          expect(this.getDitCompanyStub).to.be.calledWith('12345', companyMock.id)
        })

        it('should set company property on locals', () => {
          expect(this.resMock.locals).to.have.property('company')
          expect(this.resMock.locals.company).to.deep.equal(companyMock)
        })

        it('should not log an error', () => {
          expect(this.errorSpy).not.to.be.called
        })

        it('should call next', () => {
          expect(this.nextSpy).to.be.calledOnce
          expect(this.nextSpy).to.be.calledWith()
        })
      })

      context('when company promise is rejected', () => {
        beforeEach(async () => {
          this.errorMock = new Error()
          this.getDitCompanyStub.rejects(this.errorMock)

          await this.controller.setCompany(this.reqMock, this.resMock, this.nextSpy)
        })

        it('should call get company method', () => {
          expect(this.getDitCompanyStub).to.be.calledOnce
          expect(this.getDitCompanyStub).to.be.calledWith('12345', companyMock.id)
        })

        it('should not set company property on locals', () => {
          expect(this.resMock.locals).not.to.have.property('company')
        })

        it('should log an error', () => {
          expect(this.errorSpy).to.be.calledOnce
          expect(this.errorSpy).to.be.calledWith(this.errorMock)
        })

        it('should call next', () => {
          expect(this.nextSpy).to.be.calledOnce
          expect(this.nextSpy).to.be.calledWith()
        })
      })
    })

    context('when a company doesn\'t exist in the session', () => {
      beforeEach(async () => {
        const reqMock = assign({}, globalReq, {
          sessionModel: {
            get: () => false,
          },
        })

        await this.controller.setCompany(reqMock, {}, this.nextSpy)
      })

      it('should not call get company promise', () => {
        expect(this.getDitCompanyStub).not.to.be.called
      })

      it('should not log an error', () => {
        expect(this.errorSpy).not.to.be.called
      })

      it('should call next', () => {
        expect(this.nextSpy).to.be.calledOnce
        expect(this.nextSpy).to.be.calledWith()
      })
    })
  })
})
