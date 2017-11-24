const metadataMock = {
  headquarterOptions: [],
  regionOptions: [],
  sectorOptions: [],
  employeeOptions: [],
  turnoverOptions: [],
  countryOptions: [],
}

describe('Companies form middleware', function () {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.nextSpy = this.sandbox.spy()
    this.reqMock = {
      query: {},
    }
    this.resMock = {
      locals: {},
    }

    this.middleware = proxyquire('~/src/apps/companies/middleware/form', {
      '../../../lib/metadata': metadataMock,
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('populateForm()', () => {
    it('should include the required properties in the response', () => {
      this.middleware.populateForm(this.reqMock, this.resMock, this.nextSpy)

      expect(this.resMock.locals).to.have.property('regionOptions')
      expect(this.resMock.locals).to.have.property('sectorOptions')
      expect(this.resMock.locals).to.have.property('employeeOptions')
      expect(this.resMock.locals).to.have.property('turnoverOptions')
      expect(this.resMock.locals).to.have.property('headquarterOptions')
      expect(this.resMock.locals).to.have.property('countryOptions')
      expect(this.resMock.locals).to.have.property('businessType')
      expect(this.resMock.locals).to.have.property('showTradingAddress')
    })

    it('should call next with no arguments', () => {
      this.middleware.populateForm(this.reqMock, this.resMock, this.nextSpy)

      expect(this.nextSpy).to.be.calledWith()
    })

    context('when query contains business_type', () => {
      beforeEach(() => {
        this.reqMock = {
          query: {
            business_type: 'example-bussiness-type-id-12345',
          },
        }

        this.middlware = proxyquire('~/src/apps/companies/middleware/form', {
          '../../../lib/metadata': Object.assign({}, metadataMock, {
            businessTypeOptions: [{
              name: 'Charity',
              id: 'example-bussiness-type-id-12345',
            }],
          }),
        })
      })

      it('should add it to form state', () => {
        this.middlware.populateForm(this.reqMock, this.resMock, this.nextSpy)

        expect(this.resMock.locals.form.state).to.have.property('business_type', 'example-bussiness-type-id-12345')
      })
    })
  })

  describe('handleFormPost()', () => {
    const token = 'abcd1234'
    const company = {
      id: '12345abcde',
      name: 'foo',
    }
    const body = {
      id: '12345abcde',
      name: 'bar',
    }

    beforeEach(() => {
      this.flashSpy = this.sandbox.spy()
      this.breadcrumbStub = this.sandbox.stub().returnsThis()
      this.redirectSpy = this.sandbox.spy()
      this.saveCompanyFormStub = this.sandbox.stub()

      this.reqMock = {
        body,
        session: {
          token,
        },
        flash: this.flashSpy,
      }
      this.resMock = {
        locals: {},
        breadcrumb: this.breadcrumbStub,
        redirect: this.redirectSpy,
      }

      this.formMiddleware = proxyquire('~/src/apps/companies/middleware/form', {
        '../services/form': {
          saveCompanyForm: this.saveCompanyFormStub,
        },
      })
    })

    context('when save resolves', () => {
      beforeEach(() => {
        this.saveCompanyFormStub.resolves(company)
      })

      it('should call save company service', async () => {
        await this.formMiddleware.handleFormPost(this.reqMock, this.resMock, this.nextSpy)
        expect(this.saveCompanyFormStub).to.have.been.calledWith(token, body)
      })

      it('should call flash message', async () => {
        await this.formMiddleware.handleFormPost(this.reqMock, this.resMock, this.nextSpy)
        expect(this.flashSpy).to.have.been.calledOnce
      })

      it('should redirect to the entity', async () => {
        await this.formMiddleware.handleFormPost(this.reqMock, this.resMock, this.nextSpy)
        expect(this.redirectSpy).to.have.been.calledWith(`/companies/${company.id}`)
      })

      it('should not call next', async () => {
        await this.formMiddleware.handleFormPost(this.reqMock, this.resMock, this.nextSpy)
        expect(this.nextSpy).not.to.have.been.called
      })
    })

    context('when save rejects', () => {
      context('when API returns errors', () => {
        beforeEach(() => {
          this.error = {
            errors: {
              foo: 'is required',
            },
          }
          this.saveCompanyFormStub.rejects(this.error)
        })

        it('should set error on locals', async () => {
          await this.formMiddleware.handleFormPost(this.reqMock, this.resMock, this.nextSpy)
          expect(this.resMock.locals).to.have.property('errors')
        })

        it('should call next with no argument', async () => {
          await this.formMiddleware.handleFormPost(this.reqMock, this.resMock, this.nextSpy)
          expect(this.nextSpy).to.have.been.calledWith()
        })
      })

      context('when API returns errors', () => {
        beforeEach(() => {
          this.error = {
            errors: {
              errors: {
                foo: 'is required',
              },
            },
          }
          this.saveCompanyFormStub.rejects(this.error)
        })

        it('should set error on locals', async () => {
          await this.formMiddleware.handleFormPost(this.reqMock, this.resMock, this.nextSpy)
          expect(this.resMock.locals).to.have.property('errors')
        })

        it('should call next with no argument', async () => {
          await this.formMiddleware.handleFormPost(this.reqMock, this.resMock, this.nextSpy)
          expect(this.nextSpy).to.have.been.calledWith()
        })
      })

      context('when catch returns other error', () => {
        beforeEach(() => {
          this.error = {
            statusCode: 500,
          }
          this.saveCompanyFormStub.rejects(this.error)
        })

        it('should not set error on locals', async () => {
          await this.formMiddleware.handleFormPost(this.reqMock, this.resMock, this.nextSpy)
          expect(this.resMock.locals).not.to.have.property('errors')
        })

        it('should call next with error as argument', async () => {
          await this.formMiddleware.handleFormPost(this.reqMock, this.resMock, this.nextSpy)
          expect(this.nextSpy).to.have.been.calledWith(this.error)
        })
      })
    })
  })

  describe('setIsEditMode', () => {
    it('should set edit mode', () => {
      expect(this.resMock.locals.isEditMode).to.equal(undefined)
      this.middleware.setIsEditMode(this.reqMock, this.resMock, this.nextSpy)
      expect(this.resMock.locals.isEditMode).to.equal(true)
      expect(this.nextSpy).to.have.been.calledOnce
    })
  })
})
