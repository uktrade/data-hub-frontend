const proxyquire = require('proxyquire')

const CreateController = require('../../../../controllers/create')
const companyMock = require('../../../../../../../test/unit/data/company.json')
const searchMock = require('../../../../../../../test/unit/data/search/company.json')

describe('OMIS create company controller', () => {
  beforeEach(() => {
    this.nextSpy = sinon.spy()
    this.searchCompaniesStub = sinon.stub()

    this.ControllerClass = proxyquire('../company', {
      '../../../../../modules/search/services': {
        searchCompanies: this.searchCompaniesStub,
      },
    })

    this.controller = new this.ControllerClass({ route: '/' })
  })

  describe('middlewareChecks()', () => {
    beforeEach(() => {
      sinon.stub(CreateController.prototype, 'middlewareChecks')
      sinon.stub(this.controller, 'use')

      this.controller.middlewareChecks()
    })

    it('should call parent method', () => {
      expect(CreateController.prototype.middlewareChecks).to.have.been
        .calledOnce
    })

    it('should call check skip company method', () => {
      expect(this.controller.use).to.have.been.calledWith(
        this.controller.checkSkipCompany
      )
    })
  })

  describe('middlewareLocals()', () => {
    beforeEach(() => {
      sinon.stub(CreateController.prototype, 'middlewareLocals')
      sinon.stub(this.controller, 'use')

      this.controller.middlewareLocals()
    })

    it('should call parent method', () => {
      expect(CreateController.prototype.middlewareLocals).to.have.been
        .calledOnce
    })

    it('should call set template method', () => {
      expect(this.controller.use).to.have.been.calledWith(
        this.controller.setTemplate
      )
    })

    it('should call set results method', () => {
      expect(this.controller.use).to.have.been.calledWith(
        this.controller.setResults
      )
    })
  })

  describe('checkSkipCompany()', () => {
    beforeEach(() => {
      this.reqMock = {
        sessionModel: {
          get: sinon.stub(),
          unset: sinon.stub(),
        },
      }

      sinon.stub(this.controller, 'post')
      sinon.stub(this.controller, 'successHandler')
    })

    it('should check session for skip company value', () => {
      this.controller.checkSkipCompany(this.reqMock, {}, this.nextSpy)

      expect(this.reqMock.sessionModel.get).to.have.been.calledOnce
      expect(this.reqMock.sessionModel.get).to.have.been.calledWith(
        'skip-company'
      )
    })

    context('when company exists in session', () => {
      beforeEach(() => {
        this.reqMock.sessionModel.get.returns(companyMock.id)
        this.controller.checkSkipCompany(this.reqMock, {}, this.nextSpy)
      })

      it('should unset skip session variable', () => {
        expect(this.reqMock.sessionModel.unset).to.have.been.calledOnce
        expect(this.reqMock.sessionModel.unset).to.have.been.calledWith(
          'skip-company'
        )
      })

      it('should call post method', () => {
        expect(this.controller.post).to.have.been.calledOnce
        expect(this.controller.post).to.have.been.calledWith(
          this.reqMock,
          {},
          this.nextSpy
        )
      })

      it('should not call next', () => {
        expect(this.nextSpy).not.to.have.been.called
      })
    })

    context("when company doesn't exist in session", () => {
      beforeEach(() => {
        this.reqMock.sessionModel.get.returns(false)
        this.controller.checkSkipCompany(this.reqMock, {}, this.nextSpy)
      })

      it('should not call session unset', () => {
        expect(this.reqMock.sessionModel.unset).not.to.have.been.called
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

  describe('setTemplate()', () => {
    beforeEach(() => {
      this.reqMock = {
        query: {},
        form: {
          options: {
            templatePath: '/template-path/',
            template: 'default-template',
          },
        },
        sessionModel: {
          get: sinon.stub(),
        },
      }
    })

    context('when company exists', () => {
      beforeEach(() => {
        this.reqMock.sessionModel.get.returns('company-id')
      })

      context('when search query exists', () => {
        beforeEach(() => {
          this.reqMock.query.search = 'searchQuery'
          this.controller.setTemplate(this.reqMock, {}, this.nextSpy)
        })

        it('should use default template', () => {
          expect(this.reqMock.form.options.template).to.equal(
            'default-template'
          )
        })

        it('should call next', () => {
          expect(this.nextSpy).to.have.been.calledOnce
          expect(this.nextSpy).to.have.been.calledWith()
        })
      })

      context('when no search query exists', () => {
        beforeEach(() => {
          this.controller.setTemplate(this.reqMock, {}, this.nextSpy)
        })

        it('should set edit template', () => {
          expect(this.reqMock.form.options.template).to.equal(
            '/template-path/company--edit'
          )
        })

        it('should call next', () => {
          expect(this.nextSpy).to.have.been.calledOnce
          expect(this.nextSpy).to.have.been.calledWith()
        })
      })
    })

    context('when no company exists', () => {
      beforeEach(() => {
        this.reqMock.query.search = 'searchQuery'
        this.controller.setTemplate(this.reqMock, {}, this.nextSpy)
      })

      it('should use default template', () => {
        expect(this.reqMock.form.options.template).to.equal('default-template')
      })

      it('should call next', () => {
        expect(this.nextSpy).to.have.been.calledOnce
        expect(this.nextSpy).to.have.been.calledWith()
      })
    })
  })

  describe('setResults()', () => {
    beforeEach(() => {
      this.reqMock = {
        query: {},
        session: {
          token: '12345',
        },
        form: {
          options: {
            templatePath: '/template-path/',
            template: 'default-template',
          },
        },
        sessionModel: {
          get: sinon.stub(),
        },
      }
      this.resMock = {
        locals: {},
      }
    })

    context("when search term doesn't exist", () => {
      beforeEach(async () => {
        await this.controller.setResults(
          this.reqMock,
          this.resMock,
          this.nextSpy
        )
      })

      it('should not set search results', () => {
        expect(this.resMock.locals).not.to.have.property('searchResult')
      })

      it('should call next', () => {
        expect(this.nextSpy).to.have.been.calledOnce
        expect(this.nextSpy).to.have.been.calledWith()
      })
    })

    context('when search term exists', () => {
      beforeEach(() => {
        this.reqMock.query.term = 'search term'
      })

      context('when search companies promise resolves', () => {
        beforeEach(async () => {
          this.searchCompaniesStub.resolves(searchMock)

          await this.controller.setResults(
            this.reqMock,
            this.resMock,
            this.nextSpy
          )
        })

        it('should call search', () => {
          expect(this.searchCompaniesStub).to.have.been.calledWith({
            req: this.reqMock,
            page: undefined,
            searchTerm: 'search term',
          })
        })

        it('should set search result', () => {
          expect(this.resMock.locals).to.have.property('searchResult')
        })

        it('should set search result properties', () => {
          const actual = this.resMock.locals.searchResult

          expect(actual).to.have.property('count')
          expect(actual).to.have.property('items')
          expect(actual).to.have.property('pagination')
        })

        it('should contain correct number of results', () => {
          expect(this.resMock.locals.searchResult.count).to.equal(3)
        })

        it('should call next', () => {
          expect(this.nextSpy).to.have.been.calledOnce
          expect(this.nextSpy).to.have.been.calledWith()
        })
      })

      context('when search companies promise rejects', () => {
        beforeEach(async () => {
          this.errorMock = new Error()
          this.searchCompaniesStub.rejects(this.errorMock)

          await this.controller.setResults(
            this.reqMock,
            this.resMock,
            this.nextSpy
          )
        })

        it('should not set search results', () => {
          expect(this.resMock.locals).not.to.have.property('searchResult')
        })

        it('should call next with error', () => {
          expect(this.nextSpy).to.have.been.calledOnce
          expect(this.nextSpy).to.have.been.calledWith(this.errorMock)
        })
      })
    })
  })
})
