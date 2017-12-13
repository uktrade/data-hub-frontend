const nock = require('nock')
const { assign } = require('lodash')

const config = require('~/config')
const investmentData = require('~/test/unit/data/investment/investment-data-account-manager.json')
const companyData = require('~/test/unit/data/company.json')
const advisorData = require('~/test/unit/data/investment/interaction/advisers')
const { clientRelationshipManagementLabels } = require('~/src/apps/investment-projects/labels')

describe('Investment form middleware - client relationship management', () => {
  describe('#populateForm', () => {
    beforeEach(() => {
      this.updateCompanyStub = sandbox.stub().resolves(companyData)
      this.nextSpy = sandbox.spy()
      this.resMock = {
        locals: {
          form: {},
          investmentData,
        },
      }

      this.controller = proxyquire('~/src/apps/investment-projects/middleware/forms/client-relationship-management', {
        '../../../companies/repos': {
          updateCompany: this.updateCompanyStub,
        },
      })

      this.nockScope = nock(config.apiRoot)
        .get(`/adviser/?limit=100000&offset=0`)
        .reply(200, {
          count: 5,
          results: [
            { id: '1', name: 'Jeff Smith', is_active: true },
            { id: '2', name: 'John Smith', is_active: true },
            { id: '3', name: 'Zac Smith', is_active: true },
            { id: '4', name: 'Fred Smith', is_active: false },
            { id: '5', name: 'Jim Smith', is_active: false },
          ],
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

    context('when the investment data contains relationship management information', () => {
      beforeEach(async () => {
        this.reqMock = {
          session: {
            token: 'mock-token',
          },
        }

        this.resMock = {
          locals: {
            form: {},
            investmentData: assign({}, investmentData, {
              client_relationship_manager: { id: '4', name: 'Fred Smith' },
              investor_company: {
                account_manager: { id: '5', name: 'Jim Smith' },
              },
            }),
          },
        }

        await this.controller.populateForm(this.reqMock, this.resMock, this.nextSpy)
      })

      it('includes all active adviser options for client relationship manager', () => {
        const expectedOptions = [
          { label: 'Jeff Smith', value: '1' },
          { label: 'John Smith', value: '2' },
          { label: 'Zac Smith', value: '3' },
          { label: 'Fred Smith', value: '4' },
        ]

        expect(this.resMock.locals.form.options.clientRelationshipManagers).to.deep.equal(expectedOptions)
      })

      it('includes all active adviser options for account manager', () => {
        const expectedOptions = [
          { label: 'Jeff Smith', value: '1' },
          { label: 'John Smith', value: '2' },
          { label: 'Zac Smith', value: '3' },
          { label: 'Jim Smith', value: '5' },
        ]

        expect(this.resMock.locals.form.options.accountManagers).to.deep.equal(expectedOptions)
      })

      it('nock mocked scope has been called', () => {
        expect(this.nockScope.isDone()).to.be.true
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
        this.updateInvestmentStub = sandbox.stub().resolves(advisorData)
        this.updateCompanyStub = sandbox.stub().resolves(companyData)
        this.nextSpy = sandbox.spy()
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
        this.updateInvestmentStub = sandbox.stub()
        this.updateCompanyStub = sandbox.stub().resolves(companyData)
        this.nextSpy = sandbox.spy()
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
