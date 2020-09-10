const { assign } = require('lodash')
const proxyquire = require('proxyquire')

const FormController = require('../form')
const companyMock = require('../../../../../test/unit/data/company.json')

describe('OMIS CreateController', () => {
  beforeEach(() => {
    this.nextSpy = sinon.spy()
    this.errorSpy = sinon.spy()
    this.getDitCompanyStub = sinon.stub().resolves(companyMock)

    this.ControllerClass = proxyquire('../create', {
      '../../companies/repos': {
        getDitCompany: this.getDitCompanyStub,
      },
      '../../../config/logger': {
        error: this.errorSpy,
      },
    })

    this.controller = new this.ControllerClass({ route: '/' })
  })

  describe('process()', () => {
    beforeEach(() => {
      sinon.stub(FormController.prototype, 'process')

      this.reqMock = {
        query: {},
        form: {
          values: {},
        },
        sessionModel: {
          get: () => false,
        },
      }
    })

    context('when company exists in query', () => {
      beforeEach(() => {
        this.reqMock.query.company = companyMock.id
        this.controller.process(this.reqMock, {}, this.nextSpy)
      })

      it('should call parent method', () => {
        expect(FormController.prototype.process).to.have.been.calledOnce
        expect(FormController.prototype.process).to.have.been.calledWith(
          this.reqMock,
          {},
          this.nextSpy
        )
      })

      it('should set company to form value', () => {
        expect(this.reqMock.form.values).to.have.been.property('company')
        expect(this.reqMock.form.values.company).to.equal(companyMock.id)
      })
    })

    context('when company exists in session', () => {
      beforeEach(() => {
        this.reqMock.sessionModel.get = () => companyMock.id
        this.controller.process(this.reqMock, {}, this.nextSpy)
      })

      it('should call parent method', () => {
        expect(FormController.prototype.process).to.have.been.calledOnce
        expect(FormController.prototype.process).to.have.been.calledWith(
          this.reqMock,
          {},
          this.nextSpy
        )
      })

      it('should set company to form value', () => {
        expect(this.reqMock.form.values).to.have.been.property('company')
        expect(this.reqMock.form.values.company).to.equal(companyMock.id)
      })
    })

    context("when company doesn't exist", () => {
      beforeEach(() => {
        this.controller.process(this.reqMock, {}, this.nextSpy)
      })

      it('should set company to form value', () => {
        expect(this.reqMock.form.values).not.to.have.been.property('company')
      })
    })
  })

  describe('middlewareActions()', () => {
    beforeEach(() => {
      sinon.stub(FormController.prototype, 'middlewareActions')
      sinon.stub(this.controller, 'use')

      this.controller.middlewareActions()
    })

    it('should call parent method', () => {
      expect(FormController.prototype.middlewareActions).to.have.been.calledOnce
    })

    it('should call save company method', () => {
      expect(this.controller.use).to.have.been.calledWith(
        this.controller.saveCompany
      )
    })
  })

  describe('middlewareLocals()', () => {
    beforeEach(() => {
      sinon.stub(FormController.prototype, 'middlewareLocals')
      sinon.stub(this.controller, 'use')

      this.controller.middlewareLocals()
    })

    it('should call parent method', () => {
      expect(FormController.prototype.middlewareLocals).to.have.been.calledOnce
    })

    it('should call set company method', () => {
      expect(this.controller.use).to.have.been.calledWith(
        this.controller.setCompany
      )
    })
  })

  describe('middlewareChecks()', () => {
    beforeEach(() => {
      sinon.stub(FormController.prototype, 'middlewareChecks')
      sinon.stub(this.controller, 'use')

      this.controller.middlewareChecks()
    })

    it('should call parent method', () => {
      expect(FormController.prototype.middlewareChecks).to.have.been.calledOnce
    })

    it('should call skip company check method', () => {
      expect(this.controller.use).to.have.been.calledWith(
        this.controller.checkSkipCompany
      )
    })
  })

  describe('saveCompany()', () => {
    beforeEach(() => {
      sinon.stub(this.controller, '_configure')

      this.reqMock = {
        query: {},
      }
    })

    context('when company exists in query', () => {
      beforeEach(() => {
        this.reqMock.query.company = companyMock.id
        this.controller.saveCompany(this.reqMock, {}, this.nextSpy)
      })

      it('should make sure request is a post', () => {
        expect(this.reqMock).to.have.property('method')
        expect(this.reqMock.method).to.equal('POST')
      })

      it('should call form wizard configure method', () => {
        expect(this.controller._configure).to.have.been.calledOnce
        expect(this.controller._configure).to.have.been.calledWith(
          this.reqMock,
          {},
          this.nextSpy
        )
      })

      it('should not call next', () => {
        expect(this.nextSpy).not.to.have.been.called
      })
    })

    context("when company doesn't exist in query", () => {
      beforeEach(() => {
        this.controller.saveCompany(this.reqMock, {}, this.nextSpy)
      })

      it('should not call form wizard configure method', () => {
        expect(this.controller._configure).not.to.have.been.called
      })

      it('should call next', () => {
        expect(this.nextSpy).to.have.been.calledOnce
        expect(this.nextSpy).to.have.been.calledWith()
      })
    })
  })

  describe('checkSkipCompany', () => {
    beforeEach(() => {
      sinon.stub(FormController.prototype, 'process')
      sinon.stub(this.controller, 'post')
      sinon.stub(this.controller, 'successHandler')

      this.setSpy = sinon.spy()
      this.reqMock = {
        query: {},
        sessionModel: {
          set: this.setSpy,
        },
      }
    })

    context('when query contains skip company', () => {
      beforeEach(() => {
        this.reqMock.query['skip-company'] = true
        this.controller.checkSkipCompany(this.reqMock, {}, this.nextSpy)
      })

      it('should set value on session model', () => {
        expect(this.setSpy).to.have.been.calledOnce
        expect(this.setSpy).to.have.been.calledWith('skip-company', true)
      })

      it('should call next', () => {
        expect(this.nextSpy).to.have.been.calledOnce
        expect(this.nextSpy).to.have.been.calledWith()
      })
    })

    context("when query doesn't contain skip company", () => {
      beforeEach(() => {
        this.controller.checkSkipCompany(this.reqMock, {}, this.nextSpy)
      })

      it('should not set value on session model', () => {
        expect(this.setSpy).not.to.have.been.called
      })

      it('should call next', () => {
        expect(this.nextSpy).to.have.been.calledOnce
        expect(this.nextSpy).to.have.been.calledWith()
      })
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
          await this.controller.setCompany(
            this.reqMock,
            this.resMock,
            this.nextSpy
          )
        })

        it('should call get company method', () => {
          expect(this.getDitCompanyStub).to.be.calledOnce
          expect(this.getDitCompanyStub).to.be.calledWith(
            this.reqMock,
            companyMock.id
          )
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

          await this.controller.setCompany(
            this.reqMock,
            this.resMock,
            this.nextSpy
          )
        })

        it('should call get company method', () => {
          expect(this.getDitCompanyStub).to.be.calledOnce
          expect(this.getDitCompanyStub).to.be.calledWith(
            this.reqMock,
            companyMock.id
          )
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

    context("when a company doesn't exist in the session", () => {
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
