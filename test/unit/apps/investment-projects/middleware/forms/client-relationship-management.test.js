const investmentData = require('~/test/unit/data/investment/investment-data-account-manager.json')
const companyData = require('~/test/unit/data/company.json')
const advisorData = require('~/test/unit/data/investment/interaction/advisers')
const { clientRelationshipManagementLabels } = require('~/src/apps/investment-projects/labels')

describe('Investment form middleware - client relationship management', () => {
  describe('#populateForm', () => {
    beforeEach(() => {
      this.sandbox = sinon.sandbox.create()
      this.getAdvisersStub = this.sandbox.stub().resolves(advisorData)
      this.updateCompanyStub = this.sandbox.stub().resolves(companyData)
      this.nextSpy = this.sandbox.spy()
      this.resMock = {
        locals: {
          form: {},
          investmentData,
        },
      }

      this.controller = proxyquire('~/src/apps/investment-projects/middleware/forms/client-relationship-management', {
        '../../../adviser/repos': {
          getAdvisers: this.getAdvisersStub,
        },
        '../../../companies/repos': {
          updateCompany: this.updateCompanyStub,
        },
      })
    })

    afterEach(() => {
      this.sandbox.restore()
    })

    it('should generate a list of advisers to use for adviser dropdowns', (done) => {
      const mockAdviser = advisorData.results[0]
      const expectedAdvisors = [{
        value: mockAdviser.id,
        label: mockAdviser.name,
      }]

      this.controller.populateForm({
        session: {
          token: 'mock-token',
        },
      }, this.resMock, () => {
        expect(this.resMock.locals.form.options.advisers).to.deep.equal(expectedAdvisors)
        done()
      })
    })

    it('should populate the form state with the existing client relationship management if there is data', (done) => {
      const expectedFormState = {
        client_relationship_manager: investmentData.client_relationship_manager.id,
        account_manager: investmentData.investor_company.account_manager.id,
      }

      this.controller.populateForm({
        session: {
          token: 'mock-token',
        },
      }, this.resMock, () => {
        expect(this.resMock.locals.form.state).to.deep.equal(expectedFormState)
        done()
      })
    })

    it('should include the investor company as a hidden field', (done) => {
      this.controller.populateForm({
        session: {
          token: 'mock-token',
        },
      }, this.resMock, () => {
        expect(this.resMock.locals.form.hiddenFields).to.deep.equal({ investor_company: investmentData.investor_company.id })
        done()
      })
    })

    it('should not throw an error if you render a form for a company with no account manager', (done) => {
      this.resMock.locals.investmentData.investor_company.account_manager = null

      const expectedFormState = {
        client_relationship_manager: investmentData.client_relationship_manager.id,
        account_manager: null,
      }

      this.controller.populateForm({
        session: {
          token: 'mock-token',
        },
      }, this.resMock, () => {
        expect(this.resMock.locals.form.state).to.deep.equal(expectedFormState)
        done()
      })
    })

    it('should include labels for the form', (done) => {
      this.controller.populateForm({
        session: {
          token: 'mock-token',
        },
      }, this.resMock, () => {
        expect(this.resMock.locals.form.labels).to.deep.equal(clientRelationshipManagementLabels.edit)
        done()
      })
    })

    it('should include button text and a return link', (done) => {
      this.controller.populateForm({
        session: {
          token: 'mock-token',
        },
      }, this.resMock, () => {
        expect(this.resMock.locals.form.buttonText).to.equal('Save')
        expect(this.resMock.locals.form.returnLink).to.equal(`/investment-projects/${investmentData.id}/team`)
        done()
      })
    })
  })

  describe('#handleFormpost', () => {
    beforeEach(() => {
      this.body = {
        client_relationship_manager: '1234',
        account_manager: '4321',
        investor_company: '0909',
      }
    })

    describe('post with no errors', () => {
      beforeEach(() => {
        this.sandbox = sinon.sandbox.create()
        this.updateInvestmentStub = this.sandbox.stub().resolves(advisorData)
        this.updateCompanyStub = this.sandbox.stub().resolves(companyData)
        this.nextSpy = this.sandbox.spy()
        this.resMock = {
          locals: {},
        }

        this.controller = proxyquire('~/src/apps/investment-projects/middleware/forms/client-relationship-management', {
          '../../repos': {
            updateInvestment: this.updateInvestmentStub,
          },
          '../../../companies/repos': {
            updateCompany: this.updateCompanyStub,
          },
        })
      })

      afterEach(() => {
        this.sandbox.restore()
      })

      it('updates the investment data', (done) => {
        this.controller.handleFormPost({
          session: {
            token: 'mock-token',
          },
          params: {
            investmentId: investmentData.id,
          },
          body: this.body,
        }, this.resMock, () => {
          expect(this.updateInvestmentStub).to.be.calledWith('mock-token', investmentData.id, { client_relationship_manager: this.body.client_relationship_manager })
          done()
        })
      })

      it('updates the company data', (done) => {
        this.controller.handleFormPost({
          session: {
            token: 'mock-token',
          },
          params: {
            investmentId: investmentData.id,
          },
          body: this.body,
        }, this.resMock, () => {
          expect(this.updateCompanyStub).to.be.calledWith('mock-token', this.body.investor_company, { account_manager: this.body.account_manager })
          done()
        })
      })

      it('continues onto the next middleware with no errors', (done) => {
        this.controller.handleFormPost({
          session: {
            token: 'mock-token',
          },
          params: {
            investmentId: investmentData.id,
          },
          body: this.body,
        }, this.resMock, (error) => {
          expect(error).to.equal(undefined)
          done()
        })
      })
    })

    describe('When a form is posted with errors', () => {
      beforeEach(() => {
        this.sandbox = sinon.sandbox.create()

        this.updateInvestmentStub = this.sandbox.stub()
        this.updateCompanyStub = this.sandbox.stub().resolves(companyData)
        this.nextSpy = this.sandbox.spy()
        this.resMock = {
          locals: {},
        }

        this.controller = proxyquire('~/src/apps/investment-projects/middleware/forms/client-relationship-management', {
          '../../../adviser/repos': {
            getAdvisers: this.getAdvisersStub,
          },
          '../../repos': {
            updateInvestment: this.updateInvestmentStub,
          },
          '../../../companies/repos': {
            updateCompany: this.updateCompanyStub,
          },
        })
      })

      afterEach(() => {
        this.sandbox.restore()
      })

      it('should set form error data for the following controllers if form error', (done) => {
        this.error = {
          statusCode: 400,
          error: {
            project_assurance_adviser: 'Cannot be null',
          },
        }

        this.updateInvestmentStub.rejects(this.error)

        this.controller.handleFormPost({
          session: {
            token: 'mock-token',
          },
          params: {
            investmentId: investmentData.id,
          },
          body: this.body,
        }, this.resMock, (error) => {
          expect(error).to.equal(undefined)
          expect(this.resMock.locals.form.state).to.deep.equal(this.body)
          expect(this.resMock.locals.form.errors).to.deep.equal(this.error.error)
          done()
        })
      })

      it('should pass a none form error to next middleware', (done) => {
        this.error = {
          statusCode: 500,
        }

        this.updateInvestmentStub.rejects(this.error)

        this.controller.handleFormPost({
          session: {
            token: 'mock-token',
          },
          params: {
            investmentId: investmentData.id,
          },
          body: this.body,
        }, this.resMock, (error) => {
          expect(error).to.deep.equal(this.error)
          done()
        })
      })
    })
  })
})
