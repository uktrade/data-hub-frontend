const nock = require('nock')
const { assign } = require('lodash')

const config = require('~/config')
const investmentData = require('~/test/unit/data/investment/investment-data.json')
const advisorData = require('~/test/unit/data/investment/interaction/advisers')
const { projectManagementLabels } = require('~/src/apps/investment-projects/labels')

describe('Investment form middleware - project magement', () => {
  describe('#populateForm', () => {
    beforeEach(() => {
      this.getAdvisersStub = sandbox.stub().resolves(advisorData)
      this.nextSpy = sandbox.spy()
      this.resMock = {
        locals: {
          form: {},
          investmentData,
        },
      }

      this.controller = require('~/src/apps/investment-projects/middleware/forms/project-management')

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

    context('when the investment data contains project management information', () => {
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
              project_manager: { id: '4', name: 'Fred Smith' },
              project_assurance_adviser: { id: '5', name: 'Jim Smith' },
            }),
          },
        }

        await this.controller.populateForm(this.reqMock, this.resMock, this.nextSpy)
      })

      it('includes all active adviser options for project manager', () => {
        const expectedOptions = [
          { label: 'Jeff Smith', value: '1' },
          { label: 'John Smith', value: '2' },
          { label: 'Zac Smith', value: '3' },
          { label: 'Fred Smith', value: '4' },
        ]

        expect(this.resMock.locals.form.options.projectManagers).to.deep.equal(expectedOptions)
      })

      it('includes all active adviser options for project assurance advisor', () => {
        const expectedOptions = [
          { label: 'Jeff Smith', value: '1' },
          { label: 'John Smith', value: '2' },
          { label: 'Zac Smith', value: '3' },
          { label: 'Jim Smith', value: '5' },
        ]

        expect(this.resMock.locals.form.options.projectAssuranceAdvisers).to.deep.equal(expectedOptions)
      })

      it('nock mocked scope has been called', () => {
        expect(this.nockScope.isDone()).to.be.true
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
        this.updateInvestmentStub = sandbox.stub().resolves(advisorData)
        this.nextSpy = sandbox.spy()
        this.resMock = {
          locals: {},
        }

        this.controller = proxyquire('~/src/apps/investment-projects/middleware/forms/project-management', {
          '../../repos': {
            updateInvestment: this.updateInvestmentStub,
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
        this.updateInvestmentStub = sandbox.stub()
        this.nextSpy = sandbox.spy()
        this.resMock = {
          locals: {},
        }

        this.controller = proxyquire('~/src/apps/investment-projects/middleware/forms/project-management', {
          '../../repos': {
            updateInvestment: this.updateInvestmentStub,
          },
        })
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
