const investmentData = require('~/test/unit/data/investment/investment-data.json')
const advisorData = require('~/test/unit/data/investment/interaction/advisers')
const { projectManagementLabels } = require('~/src/apps/investment-projects/labels')

describe('Investment form middleware - project magement', () => {
  describe('#populateForm', () => {
    beforeEach(() => {
      this.sandbox = sinon.sandbox.create()
      this.getAdvisersStub = this.sandbox.stub().resolves(advisorData.results)
      this.nextSpy = this.sandbox.spy()
      this.resMock = {
        locals: {
          form: {},
          investmentData,
        },
      }

      this.controller = proxyquire('~/src/apps/investment-projects/middleware/forms/project-management', {
        '../../../adviser/repos': {
          getAdvisers: this.getAdvisersStub,
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

    it('should populate the form state with the existing project management team if there is data', (done) => {
      const expectedFormState = {
        project_manager: investmentData.project_manager.id,
        project_assurance_adviser: investmentData.project_assurance_adviser.id,
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
        expect(this.resMock.locals.form.labels).to.deep.equal(projectManagementLabels.edit)
        done()
      })
    })
  })

  describe('#handleFormpost', () => {
    beforeEach(() => {
      this.body = {
        project_manager: '1234',
        project_assurance_adviser: '4321',
      }
    })

    describe('post with no errors', () => {
      beforeEach(() => {
        this.sandbox = sinon.sandbox.create()
        this.updateInvestmentStub = this.sandbox.stub().resolves(advisorData)
        this.nextSpy = this.sandbox.spy()
        this.resMock = {
          locals: {},
        }

        this.controller = proxyquire('~/src/apps/investment-projects/middleware/forms/project-management', {
          '../../repos': {
            updateInvestment: this.updateInvestmentStub,
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
          expect(this.updateInvestmentStub).to.be.calledWith('mock-token', investmentData.id, this.body)
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

    describe('post with form errors', () => {
      beforeEach(() => {
        this.sandbox = sinon.sandbox.create()

        this.updateInvestmentStub = this.sandbox.stub()
        this.nextSpy = this.sandbox.spy()
        this.resMock = {
          locals: {},
        }

        this.controller = proxyquire('~/src/apps/investment-projects/middleware/forms/project-management', {
          '../../repos': {
            updateInvestment: this.updateInvestmentStub,
          },
        })
      })

      afterEach(() => {
        this.sandbox.restore()
      })

      it('sets form error data for the following controllers if form error', (done) => {
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

      it('passes a none form error to next middleware', (done) => {
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
