const proxyquire = require('proxyquire')

const investmentData = require('../../../../../test/unit/data/investment/investment-data.json')

describe('Investment team middleware', () => {
  beforeEach(() => {
    this.transformBriefInvestmentSummaryStub = sinon.stub()
    this.investmentData = Object.assign({}, investmentData, {
      team_members: [
        {
          adviser: {
            id: '1234',
            first_name: 'Fred',
            last_name: 'Smith',
          },
          role: 'Director',
        },
      ],
    })

    this.adviser = {
      id: '1234',
      first_name: 'Fred',
      last_name: 'Smith',
      dit_team: {
        id: '4444',
        name: 'Freds Team',
      },
    }

    this.getAdviserStub = sinon.stub().resolves(this.adviser)
    this.nextSpy = sinon.spy()
    this.reqMock = {}
    this.resMock = {
      locals: {
        investment: this.investmentData,
      },
    }

    this.teamMiddleware = proxyquire('../team', {
      '../transformers': {
        transformBriefInvestmentSummary:
          this.transformBriefInvestmentSummaryStub,
      },
      '../../adviser/repos': {
        getAdviser: this.getAdviserStub,
      },
    })
  })

  describe('#getBriefInvestmentSummary', () => {
    it('should call brief investment summary formatter with expanded project', (done) => {
      this.teamMiddleware.getBriefInvestmentSummary(
        {
          session: {
            token: 'mock-token',
          },
        },
        this.resMock,
        () => {
          expect(this.transformBriefInvestmentSummaryStub).to.be.calledWith(
            this.investmentData
          )
          done()
        }
      )
    })
  })

  describe('#expandTeamMembers', () => {
    it('should expand the team members adviser to includ team', (done) => {
      this.teamMiddleware.expandTeamMembers(
        {
          session: {
            token: 'mock-token',
          },
        },
        this.resMock,
        () => {
          expect(
            this.resMock.locals.investment.team_members[0].adviser
          ).to.deep.equal(this.adviser)
          done()
        }
      )
    })
  })
})
