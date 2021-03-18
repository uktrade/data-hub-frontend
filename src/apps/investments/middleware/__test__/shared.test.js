const { merge, cloneDeep } = require('lodash')
const proxyquire = require('proxyquire')

const paths = require('../../paths')
const investmentData = require('../../../../../test/unit/data/investment/investment-data.json')
const investmentProjectStages = require('../../../../../test/unit/data/investment/investment-project-stages.json')

const companyData = {
  id: '6c388e5b-a098-e211-a939-e4115bead28a',
  name: 'Investor Company ltd.',
}

const adviserData = {
  id: '1234',
  first_name: 'Fred',
  last_name: 'Smith',
  dit_team: {
    id: '4444',
    name: 'Freds Team',
  },
}

const getInvestmentData = (ukCompanyId, clientRelationshipManagerId) => {
  return merge({}, investmentData, {
    uk_company: {
      id: ukCompanyId,
    },
    client_relationship_manager: {
      id: clientRelationshipManagerId,
    },
  })
}

const createMiddleware = (
  investmentData,
  adviserData,
  companyData,
  stages = investmentProjectStages
) => {
  return proxyquire('../shared', {
    '../repos': {
      getInvestment: sinon.stub().resolves(investmentData),
    },
    '../../adviser/repos': {
      getAdviser: sinon.stub().resolves(adviserData),
    },
    '../../companies/repos': {
      getDitCompany: sinon.stub().resolves(companyData),
    },
    '../../../lib/metadata': {
      investmentProjectStage: stages,
    },
  })
}

describe('Investment shared middleware', () => {
  let reqMock, resMock, nextSpy

  describe('#getInvestmentDetails', () => {
    before(() => {
      reqMock = {
        session: {
          token: 'abcd',
        },
        params: {
          investmentId: investmentData.id,
        },
      }

      resMock = {
        locals: {
          paths,
        },
        breadcrumb: sinon.stub().returnsThis(),
      }

      nextSpy = sinon.spy()
    })

    context('when all fields are populated', () => {
      before(async () => {
        const middleware = createMiddleware(
          getInvestmentData(2, 3),
          adviserData,
          companyData
        )

        await middleware.getInvestmentDetails(reqMock, resMock, nextSpy)
      })

      it('should set investment data on locals', () => {
        const expectedInvestmentData = merge({}, investmentData, {
          client_relationship_manager: adviserData,
          investor_company: {
            name: companyData.name,
          },
          uk_company: companyData,
        })

        expect(resMock.locals.investment).to.deep.equal(expectedInvestmentData)
      })
      it('should set investment data uk company on locals', () => {
        expect(resMock.locals.investment.uk_company).to.deep.equal(companyData)
      })
      it('should set investment data client relationship manager on locals', () => {
        expect(
          resMock.locals.investment.client_relationship_manager
        ).to.deep.equal(adviserData)
      })
      it('should set equity company on locals', () => {
        const expectedEquityCompany = merge(
          {},
          investmentData.investor_company,
          {
            name: companyData.name,
          }
        )

        expect(resMock.locals.equityCompany).to.deep.equal(
          expectedEquityCompany
        )
      })
      it('should set investment project stages on locals', () => {
        expect(resMock.locals.investmentProjectStages).to.deep.equal([
          'Prospect',
          'Assign PM',
          'Active',
          'Verify win',
          'Won',
        ])
      })
      it('should set investment status on locals', () => {
        const expectedInvestmentStatus = {
          company: {
            name: 'Investor Company ltd.',
            url: '/companies/6c388e5b-a098-e211-a939-e4115bead28a',
          },
          currentStage: {
            incompleteFields: [],
            isComplete: false,
            messages: [],
            name: 'Prospect',
          },
          id: 'f22ae6ac-b269-4fe5-aeba-d6a605b9a7a7',
          meta: [
            {
              label: 'Status',
              url:
                '/investments/projects/f22ae6ac-b269-4fe5-aeba-d6a605b9a7a7/status',
              urlLabel: 'change',
              value: '',
            },
            {
              label: 'Project code',
              value: 'DHP-00000003',
            },
            {
              label: 'Valuation',
              value: 'Not yet valued',
            },
            {
              label: 'Created on',
              value: null,
            },
          ],
          nextStage: {
            name: 'Assign PM',
            disabled_on: null,
            exclude_from_investment_flow: false,
            id: 'c9864359-fb1a-4646-a4c1-97d10189fc03',
          },
        }

        expect(resMock.locals.investmentStatus).to.deep.equal(
          expectedInvestmentStatus
        )
      })
      it('should set the breadcrumb', () => {
        expect(resMock.breadcrumb).to.be.calledWithExactly(
          investmentData.name,
          `/investments/projects/${investmentData.id}`
        )
        expect(resMock.breadcrumb).to.have.been.calledTwice
      })
      it('should call next once', () => {
        expect(nextSpy).to.have.been.calledOnce
      })
      it('should call next without errors', () => {
        expect(nextSpy.firstCall.args.length).to.equal(0)
      })
    })

    context('when uk company is not provided', () => {
      before(async () => {
        const middleware = createMiddleware(
          getInvestmentData(null, 3),
          adviserData,
          companyData
        )

        await middleware.getInvestmentDetails(reqMock, resMock, nextSpy)
      })

      it('should set investment data on locals', () => {
        const expectedInvestmentData = merge({}, investmentData, {
          client_relationship_manager: adviserData,
          investor_company: {
            name: companyData.name,
          },
          uk_company: {
            id: null,
          },
        })

        expect(resMock.locals.investment).to.deep.equal(expectedInvestmentData)
      })
      it('should not set investment data uk company on locals', () => {
        expect(resMock.locals.investment.uk_company.id).to.be.null
      })
      it('should call next', () => {
        expect(nextSpy).to.have.been.called
      })
      it('should call next without errors', () => {
        expect(nextSpy.firstCall.args.length).to.equal(0)
      })
    })

    context('when client relationship manager is not provided', () => {
      before(async () => {
        const middleware = createMiddleware(
          getInvestmentData(2, null),
          adviserData,
          companyData
        )

        await middleware.getInvestmentDetails(reqMock, resMock, nextSpy)
      })

      it('should set investment data on locals', () => {
        const expectedInvestmentData = merge({}, investmentData, {
          client_relationship_manager: {
            id: null,
          },
          investor_company: {
            name: companyData.name,
          },
          uk_company: companyData,
        })

        expect(resMock.locals.investment).to.deep.equal(expectedInvestmentData)
      })
      it('should not set investment data client relationship manager on locals', () => {
        expect(resMock.locals.investment.client_relationship_manager.id).to.be
          .null
      })
      it('should call next', () => {
        expect(nextSpy).to.have.been.called
      })
      it('should call next without errors', () => {
        expect(nextSpy.firstCall.args.length).to.equal(0)
      })
    })

    context('when there is an error', () => {
      before(async () => {
        const middleware = proxyquire('../shared', {
          '../repos': {
            getInvestment: sinon.stub().throws(),
          },
          '../../adviser/repos': {
            getAdviser: sinon.stub().throws(),
          },
          '../../companies/repos': {
            getDitCompany: sinon.stub().throws(),
          },
        })

        middleware.getInvestmentDetails(reqMock, resMock, nextSpy)
      })

      it('should throw render', () => {
        expect(resMock.render).to.have.been.thrown
      })

      it('should call next', () => {
        expect(nextSpy).to.have.been.called
      })
    })

    context(
      'when the streamlined-investment-flow feature flag is set to true',
      () => {
        before(async () => {
          const stages = cloneDeep(investmentProjectStages)

          // Exclude the Assign PM stage.
          stages[1].exclude_from_investment_flow = true

          resMock = {
            breadcrumb: sinon.stub().returnsThis(),
            locals: {
              features: {
                'streamlined-investment-flow': true,
              },
            },
          }
          const middleware = createMiddleware(
            getInvestmentData(2, null),
            adviserData,
            companyData,
            stages
          )

          await middleware.getInvestmentDetails(reqMock, resMock, nextSpy)
        })
        it('should remove the Assign PM stage from the investmentProjectStages array on locals', () => {
          expect(resMock.locals.investmentProjectStages).to.deep.equal([
            'Prospect',
            'Active',
            'Verify win',
            'Won',
          ])
        })
      }
    )
  })
})
