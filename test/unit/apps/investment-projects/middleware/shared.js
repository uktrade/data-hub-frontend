const { merge } = require('lodash')

const investmentData = require('~/test/unit/data/investment/investment-data.json')

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

const investmentProjectStages = [
  {
    id: '8a320cc9-ae2e-443e-9d26-2f36452c2ced',
    name: 'Prospect',
    disabled_on: null,
  },
  {
    id: 'c9864359-fb1a-4646-a4c1-97d10189fc03',
    name: 'Assign PM',
    disabled_on: null,
  },
  {
    id: '7606cc19-20da-4b74-aba1-2cec0d753ad8',
    name: 'Active',
    disabled_on: null,
  },
  {
    id: '49b8f6f3-0c50-4150-a965-2c974f3149e3',
    name: 'Verify win',
    disabled_on: null,
  },
  {
    id: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
    name: 'Won',
    disabled_on: null,
  },
]

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

const createMiddleware = (investmentData, adviserData, companyData) => {
  return proxyquire('~/src/apps/investment-projects/middleware/shared', {
    '../repos': {
      getInvestment: sandbox.stub().resolves(investmentData),
    },
    '../../adviser/repos': {
      getAdviser: sandbox.stub().resolves(adviserData),
    },
    '../../companies/repos': {
      getDitCompany: sandbox.stub().resolves(companyData),
    },
    '../../../lib/metadata': {
      investmentProjectStage: investmentProjectStages,
    },
  })
}

describe('Investment shared middleware', () => {
  describe('#getInvestmentDetails', () => {
    beforeEach(() => {
      this.reqMock = {
        session: {
          token: 'abcd',
        },
        params: {
          investmentId: investmentData.id,
        },
      }

      this.resMock = {
        breadcrumb: sandbox.stub().returnsThis(),
        locals: {},
      }

      this.nextSpy = sandbox.spy()
    })

    context('when all fields are populated', () => {
      beforeEach(async () => {
        const middleware = createMiddleware(getInvestmentData(2, 3), adviserData, companyData)

        await middleware.getInvestmentDetails(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should set investment data on locals', () => {
        const expectedInvestmentData = merge({}, investmentData, {
          client_relationship_manager: adviserData,
          investor_company: {
            name: companyData.name,
          },
          uk_company: companyData,
        })

        expect(this.resMock.locals.investmentData).to.deep.equal(expectedInvestmentData)
      })
      it('should set investment data uk company on locals', () => {
        expect(this.resMock.locals.investmentData.uk_company).to.deep.equal(companyData)
      })
      it('should set investment data client relationship manager on locals', () => {
        expect(this.resMock.locals.investmentData.client_relationship_manager).to.deep.equal(adviserData)
      })
      it('should set equity company on locals', () => {
        const expectedEquityCompany = merge({}, investmentData.investor_company, {
          name: companyData.name,
        })

        expect(this.resMock.locals.equityCompany).to.deep.equal(expectedEquityCompany)
      })
      it('should set investment project stages on locals', () => {
        expect(this.resMock.locals.investmentProjectStages).to.deep.equal([
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
              url: '/investment-projects/f22ae6ac-b269-4fe5-aeba-d6a605b9a7a7/status',
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
              value: '1 Jan 1970, 12:00am',
            },
          ],
          nextStage: {
            disabled_on: null,
            id: 'c9864359-fb1a-4646-a4c1-97d10189fc03',
            name: 'Assign PM',
          },
        }

        expect(this.resMock.locals.investmentStatus).to.deep.equal(expectedInvestmentStatus)
      })
      it('should set the breadcrumb', () => {

      })
      it('should call next once', () => {
        expect(this.nextSpy).to.have.been.calledOnce
      })
      it('should call next without errors', () => {
        expect(this.nextSpy.firstCall.args.length).to.equal(0)
      })
    })

    context('when uk company is not provided', () => {
      beforeEach(async () => {
        const middleware = createMiddleware(getInvestmentData(null, 3), adviserData, companyData)

        await middleware.getInvestmentDetails(this.reqMock, this.resMock, this.nextSpy)
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

        expect(this.resMock.locals.investmentData).to.deep.equal(expectedInvestmentData)
      })
      it('should not set investment data uk company on locals', () => {
        expect(this.resMock.locals.investmentData.uk_company.id).to.be.null
      })
      it('should call next once', () => {
        expect(this.nextSpy).to.have.been.calledOnce
      })
      it('should call next without errors', () => {
        expect(this.nextSpy.firstCall.args.length).to.equal(0)
      })
    })

    context('when client relationship manager is not provided', () => {
      beforeEach(async () => {
        const middleware = createMiddleware(getInvestmentData(2, null), adviserData, companyData)

        await middleware.getInvestmentDetails(this.reqMock, this.resMock, this.nextSpy)
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

        expect(this.resMock.locals.investmentData).to.deep.equal(expectedInvestmentData)
      })
      it('should not set investment data client relationship manager on locals', () => {
        expect(this.resMock.locals.investmentData.client_relationship_manager.id).to.be.null
      })
      it('should call next once', () => {
        expect(this.nextSpy).to.have.been.calledOnce
      })
      it('should call next without errors', () => {
        expect(this.nextSpy.firstCall.args.length).to.equal(0)
      })
    })

    context('when there is an error', () => {
      beforeEach(async () => {
        this.error = new Error('error')

        const middleware = proxyquire('~/src/apps/investment-projects/middleware/shared', {
          '../repos': {
            getInvestment: sandbox.stub().throws(this.error),
          },
          '../../adviser/repos': {
            getAdviser: sandbox.stub().throws(this.error),
          },
          '../../companies/repos': {
            getDitCompany: sandbox.stub().throws(this.error),
          },
        })

        middleware.getInvestmentDetails(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call next once', () => {
        expect(this.nextSpy).to.have.been.calledOnce
      })
      it('should call next with error', () => {
        expect(this.nextSpy).to.have.been.calledWith(this.error)
      })
    })
  })
})
