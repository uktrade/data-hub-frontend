const { assign } = require('lodash')
const proxyquire = require('proxyquire')

const config = require('../../../../../config')
const paths = require('../../../paths')
const investmentData = require('../../../../../../test/unit/data/investment/investment-data-account-manager.json')
const companyData = require('../../../../../../test/unit/data/company.json')
const advisorData = require('../../../../../../test/unit/data/investment/interaction/advisers.json')
const { clientRelationshipManagementLabels } = require('../../../labels')

describe('Investment form middleware - client relationship management', () => {
  describe('#populateForm', () => {
    beforeEach(() => {
      this.updateCompanyStub = sinon.stub().resolves(companyData)
      this.nextSpy = sinon.spy()
      this.reqMock = {
        session: {
          token: 'mock-token',
        },
      }
      this.resMock = {
        locals: {
          paths,
          form: {},
          investment: investmentData,
        },
      }

      this.controller = proxyquire('../client-relationship-management', {
        '../../../companies/repos': {
          updateCompany: this.updateCompanyStub,
        },
      })

      nock(config.apiRoot)
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

    context('when the global account manager is set', () => {
      it('should populate the form state with the existing client relationship management', async () => {
        const globalAccountManager =
          investmentData.investor_company.one_list_group_global_account_manager
        const expectedFormState = {
          client_relationship_manager:
            investmentData.client_relationship_manager.id,
          global_account_manager: `${globalAccountManager.first_name} ${globalAccountManager.last_name}`,
        }

        await this.controller.populateForm(this.reqMock, this.resMock, () => {
          expect(this.resMock.locals.form.state).to.deep.equal(
            expectedFormState
          )
        })
      })
    })

    context('when the global account manager is not set', () => {
      it('should populate the form state with the existing client relationship management', async () => {
        this.resMock.locals.investment.investor_company.one_list_group_global_account_manager = null

        const expectedFormState = {
          client_relationship_manager:
            investmentData.client_relationship_manager.id,
          global_account_manager: 'Not set',
        }

        await this.controller.populateForm(this.reqMock, this.resMock, () => {
          expect(this.resMock.locals.form.state).to.deep.equal(
            expectedFormState
          )
        })
      })
    })

    it('should include the investor company as a hidden field', (done) => {
      this.controller.populateForm(this.reqMock, this.resMock, () => {
        expect(this.resMock.locals.form.hiddenFields).to.deep.equal({
          investor_company: investmentData.investor_company.id,
        })
        done()
      })
    })

    it('should include labels for the form', (done) => {
      this.controller.populateForm(
        {
          session: {
            token: 'mock-token',
          },
        },
        this.resMock,
        () => {
          expect(this.resMock.locals.form.labels).to.deep.equal(
            clientRelationshipManagementLabels.edit
          )
          done()
        }
      )
    })

    it('should include button text, return link and One List email', async () => {
      await this.controller.populateForm(this.reqMock, this.resMock, () => {
        expect(this.resMock.locals.form.buttonText).to.equal('Save')
        expect(this.resMock.locals.form.returnLink).to.equal(
          `/investments/projects/${investmentData.id}/team`
        )
        expect(this.resMock.locals.form.oneListEmail).to.equal(
          config.oneList.email
        )
      })
    })

    context(
      'when the investment data contains relationship management information',
      () => {
        beforeEach(async () => {
          this.reqMock = {
            session: {
              token: 'mock-token',
            },
          }

          this.resMock = {
            locals: {
              paths,
              form: {},
              investment: assign({}, investmentData, {
                client_relationship_manager: { id: '4', name: 'Fred Smith' },
                investor_company: {},
              }),
            },
          }

          await this.controller.populateForm(
            this.reqMock,
            this.resMock,
            this.nextSpy
          )
        })

        it('includes all active adviser options for client relationship manager', () => {
          const expectedOptions = [
            { label: 'Jeff Smith', value: '1' },
            { label: 'John Smith', value: '2' },
            { label: 'Zac Smith', value: '3' },
            { label: 'Fred Smith', value: '4' },
          ]

          expect(
            this.resMock.locals.form.options.clientRelationshipManagers
          ).to.deep.equal(expectedOptions)
        })
      }
    )
  })

  describe('#handleFormpost', () => {
    beforeEach(() => {
      this.body = {
        client_relationship_manager: '1234',
        investor_company: '0909',
      }
    })

    describe('post with no errors', () => {
      beforeEach(() => {
        this.updateInvestmentStub = sinon.stub().resolves(advisorData)
        this.updateCompanyStub = sinon.stub().resolves(companyData)
        this.nextSpy = sinon.spy()
        this.resMock = {
          locals: {},
        }

        this.controller = proxyquire('../client-relationship-management', {
          '../../repos': {
            updateInvestment: this.updateInvestmentStub,
          },
          '../../../companies/repos': {
            updateCompany: this.updateCompanyStub,
          },
        })
      })

      it('updates the investment data', (done) => {
        const stubRequest = {
          ...this.reqMock,
          params: {
            investmentId: investmentData.id,
          },
          body: this.body,
        }
        this.controller.handleFormPost(stubRequest, this.resMock, () => {
          expect(this.updateInvestmentStub).to.be.calledWith(
            stubRequest,
            investmentData.id,
            {
              client_relationship_manager: this.body
                .client_relationship_manager,
            }
          )
          done()
        })
      })

      it('continues onto the next middleware with no errors', (done) => {
        const stubRequest = {
          ...this.reqMock,
          params: {
            investmentId: investmentData.id,
          },
          body: this.body,
        }
        this.controller.handleFormPost(stubRequest, this.resMock, (error) => {
          expect(error).to.equal(undefined)
          done()
        })
      })
    })

    describe('When a form is posted with errors', () => {
      beforeEach(() => {
        this.updateInvestmentStub = sinon.stub()
        this.updateCompanyStub = sinon.stub().resolves(companyData)
        this.nextSpy = sinon.spy()
        this.resMock = {
          locals: {},
        }

        this.controller = proxyquire('../client-relationship-management', {
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

        const stubRequest = {
          ...this.reqMock,
          params: {
            investmentId: investmentData.id,
          },
          body: this.body,
        }

        this.controller.handleFormPost(stubRequest, this.resMock, (error) => {
          expect(error).to.equal(undefined)
          expect(this.resMock.locals.form.state).to.deep.equal(this.body)
          expect(this.resMock.locals.form.errors).to.deep.equal(
            this.error.error
          )
          done()
        })
      })

      it('should pass a none form error to next middleware', (done) => {
        this.error = {
          statusCode: 500,
        }

        this.updateInvestmentStub.rejects(this.error)

        const stubRequest = {
          ...this.reqMock,
          params: {
            investmentId: investmentData.id,
          },
          body: this.body,
        }

        this.controller.handleFormPost(stubRequest, this.resMock, (error) => {
          expect(error).to.deep.equal(this.error)
          done()
        })
      })
    })
  })
})
