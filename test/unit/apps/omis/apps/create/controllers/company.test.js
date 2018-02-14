const CreateController = require('~/src/apps/omis/controllers/create')
const searchMock = require('~/test/unit/data/search/company.json')

describe('OMIS create company controller', () => {
  beforeEach(() => {
    this.nextSpy = sandbox.spy()
    this.searchCompaniesStub = sandbox.stub()

    this.ControllerClass = proxyquire('~/src/apps/omis/apps/create/controllers/company', {
      '../../../../search/services': {
        searchCompanies: this.searchCompaniesStub,
      },
    })

    this.controller = new this.ControllerClass({ route: '/' })
  })

  describe('middlewareLocals()', () => {
    beforeEach(() => {
      sandbox.stub(CreateController.prototype, 'middlewareLocals')
      sandbox.stub(this.controller, 'use')

      this.controller.middlewareLocals()
    })

    it('should call parent method', () => {
      expect(CreateController.prototype.middlewareLocals).to.have.been.calledOnce
    })

    it('should call set template method', () => {
      expect(this.controller.use).to.have.been.calledWith(this.controller.setTemplate)
    })

    it('should call set results method', () => {
      expect(this.controller.use).to.have.been.calledWith(this.controller.setResults)
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
          get: sandbox.stub(),
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
          expect(this.reqMock.form.options.template).to.equal('default-template')
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
          expect(this.reqMock.form.options.template).to.equal('/template-path/company--edit')
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
          get: sandbox.stub(),
        },
      }
      this.resMock = {
        locals: {},
      }
    })

    context('when search term doesn\'t exist', () => {
      beforeEach(async () => {
        await this.controller.setResults(this.reqMock, this.resMock, this.nextSpy)
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

          await this.controller.setResults(this.reqMock, this.resMock, this.nextSpy)
        })

        it('should call search', () => {
          expect(this.searchCompaniesStub).to.have.been.calledWith({
            token: '12345',
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

          await this.controller.setResults(this.reqMock, this.resMock, this.nextSpy)
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
