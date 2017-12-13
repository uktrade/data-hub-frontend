const investmentData = require('~/test/unit/data/investment/investment-data.json')

describe('Investment team middleware', () => {
  beforeEach(() => {
    this.transformBriefInvestmentSummaryStub = sandbox.stub()
    this.investmentData = Object.assign({}, investmentData, {
      team_members: [{
        adviser: {
          id: '1234',
          first_name: 'Fred',
          last_name: 'Smith',
        },
        role: 'Director',
      }],
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

    this.getAdviserStub = sandbox.stub().resolves(this.adviser)
    this.nextSpy = sandbox.spy()
    this.reqMock = {}
    this.resMock = {
      locals: {
        investmentData: this.investmentData,
      },
    }

    this.teamMiddleware = proxyquire('~/src/apps/investment-projects/middleware/team', {
      '../services/formatting': {
        transformBriefInvestmentSummary: this.transformBriefInvestmentSummaryStub,
      },
      '../../adviser/repos': {
        getAdviser: this.getAdviserStub,
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#getBriefInvestmentSummary', () => {
    it('should call brief investment summary formatter with expanded project', (done) => {
      this.teamMiddleware.getBriefInvestmentSummary({
        session: {
          token: 'mock-token',
        },
      }, this.resMock, () => {
        expect(this.transformBriefInvestmentSummaryStub).to.be.calledWith(this.investmentData)
        done()
      })
    })
  })

  describe('#expandTeamMembers', () => {
    it('should expand the team members adviser to includ team', (done) => {
      this.teamMiddleware.expandTeamMembers({
        session: {
          token: 'mock-token',
        },
      }, this.resMock, () => {
        expect(this.resMock.locals.investmentData.team_members[0].adviser).to.deep.equal(this.adviser)
        done()
      })
    })
  })
})
