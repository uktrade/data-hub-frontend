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

  describe('process()', () => {
    beforeEach(() => {
      sandbox.stub(FormController.prototype, 'process')

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
        expect(FormController.prototype.process).to.have.been.calledWith(this.reqMock, {}, this.nextSpy)
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
        expect(FormController.prototype.process).to.have.been.calledWith(this.reqMock, {}, this.nextSpy)
      })

      it('should set company to form value', () => {
        expect(this.reqMock.form.values).to.have.been.property('company')
        expect(this.reqMock.form.values.company).to.equal(companyMock.id)
      })
    })

    context('when company doesn\'t exist', () => {
      beforeEach(() => {
        this.controller.process(this.reqMock, {}, this.nextSpy)
      })

      it('should set company to form value', () => {
        expect(this.reqMock.form.values).not.to.have.been.property('company')
      })
    })
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

  describe('middlewareChecks()', () => {
    beforeEach(() => {
      sandbox.stub(FormController.prototype, 'middlewareChecks')
      sandbox.stub(this.controller, 'use')

      this.controller.middlewareChecks()
    })

    it('should call parent method', () => {
      expect(FormController.prototype.middlewareChecks).to.have.been.calledOnce
    })

    it('should call save company check method', () => {
      expect(this.controller.use).to.have.been.calledWith(this.controller.checkSaveCompany)
    })

    it('should call skip company check method', () => {
      expect(this.controller.use).to.have.been.calledWith(this.controller.checkSkipCompany)
    })
  })

  describe('checkSaveCompany()', () => {
    beforeEach(() => {
      sandbox.stub(this.controller, 'post')
      sandbox.stub(this.controller, 'successHandler')

      this.reqMock = {
        query: {},
      }
    })

    context('when company exists in query', () => {
      beforeEach(() => {
        this.reqMock.query.company = companyMock.id
      })

      context('when post is a function', () => {
        beforeEach(() => {
          this.controller.checkSaveCompany(this.reqMock, {}, this.nextSpy)
        })

        it('should call post method', () => {
          expect(this.controller.post).to.have.been.calledOnce
          expect(this.controller.post).to.have.been.calledWith(this.reqMock, {}, this.nextSpy)
        })

        it('should not call successHandler method', () => {
          expect(this.controller.successHandler).not.to.have.been.called
        })

        it('should not call next', () => {
          expect(this.nextSpy).not.to.have.been.called
        })
      })

      context('when post is not a function', () => {
        beforeEach(() => {
          this.controller.post = null
          this.controller.checkSaveCompany(this.reqMock, {}, this.nextSpy)
        })

        it('should call successHandler method', () => {
          expect(this.controller.successHandler).to.have.been.calledOnce
          expect(this.controller.successHandler).to.have.been.calledWith(this.reqMock, {}, this.nextSpy)
        })

        it('should not call next', () => {
          expect(this.nextSpy).not.to.have.been.called
        })
      })
    })

    context('when company doesn\'t exist in query', () => {
      beforeEach(() => {
        this.controller.checkSaveCompany(this.reqMock, {}, this.nextSpy)
      })

      it('should not call post method', () => {
        expect(this.controller.post).not.to.have.been.called
      })

      it('should not call successHandler method', () => {
        expect(this.controller.successHandler).not.to.have.been.called
      })

      it('should call next', () => {
        expect(this.nextSpy).to.have.been.calledOnce
        expect(this.nextSpy).to.have.been.calledWith()
      })
    })
  })

  describe('checkSkipCompany', () => {
    beforeEach(() => {
      sandbox.stub(FormController.prototype, 'process')
      sandbox.stub(this.controller, 'post')
      sandbox.stub(this.controller, 'successHandler')

      this.setSpy = sandbox.spy()
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

    context('when query doesn\'t contain skip company', () => {
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
