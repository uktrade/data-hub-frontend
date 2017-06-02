const investmentProjectSummaryData = require('../data/investment/project-summary.json')
const investmentValueData = require('../data/investment/project-value.json')
const investmentRequirements = require('../data/investment/project-requirements.json')

const token = 'abcd'

describe('Investment details controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.next = this.sandbox.stub()
    this.getInvestmentProjectSummary = this.sandbox.stub().resolves(investmentProjectSummaryData)
    this.getInvestmentValue = this.sandbox.stub().resolves(investmentValueData)
    this.getInvestmentRequirements = this.sandbox.stub().resolves(investmentRequirements)

    this.controller = proxyquire('~/src/controllers/investment-details.controller', {
      '../repos/investment.repo': {
        getInvestmentProjectSummary: this.getInvestmentProjectSummary,
        getInvestmentValue: this.getInvestmentValue,
        getInvestmentRequirements: this.getInvestmentRequirements
      }
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#getDetails', () => {
    it('should return investment summary for investmentId', (done) => {
      const expected = {
        'currentNavItem': 'details',
        'localNavItems': [
          { label: 'Project details', slug: 'details' },
          { label: 'Client', slug: 'client' },
          { label: 'Project team', slug: 'team' },
          { label: 'Interactions', slug: 'interactions' },
          { label: 'Documents', slug: 'documents' },
          { label: 'Evaluation', slug: 'evaluation' },
          { label: 'Audit history', slug: 'audit' }
        ],
        project: {
          'Anonymous description': null,
          'Business activity': undefined,
          'Client': {
            name: 'Wonka Industries',
            url: '/company/view/foreign/6c388e5b-a098-e211-a939-e4115bead28a'
          },
          'Estimated land date': 'May 2018',
          'Non-disclosure agreement': 'Not signed',
          'Primary sector': null,
          'Project description': 'Stark Industries wishes to build in a new part of Manchester expanding its existing premises',
          'Shareable with UK partners': null,
          'Sub-sector': null,
          'Type of investment': 'Commitment to invest'
        },
        projectMeta: {
          id: 'f22ae6ac-b269-4fe5-aeba-d6a605b9a7a7',
          name: 'Skyscraper project for Stark Industries',
          phaseName: 'Prospect',
          projectCode: 'DHP-00000003'
        },
        requirements: {
          'Client requirements': null,
          'Competitor countries': [],
          'Investment location': null,
          'Main strategic drivers': [],
          'Possible UK locations': [],
          'UK recipient company': null
        },
        value: {
          'Average salary': null,
          'Export revenue': null,
          'Foreign equity investment': null,
          'Government assistance': null,
          'New jobs': null,
          'New-to-world tech': null,
          'Non-FDI R&D project': null,
          'R&D budget': null,
          'Safeguarded jobs': null,
          'Total investment': null
        }
      }

      this.controller.getDetails({
        session: {
          token
        },
        params: {
          id: investmentProjectSummaryData.id
        }
      }, {
        render: (template, data) => {
          try {
            expect(this.getInvestmentProjectSummary).to.be.calledWith(token, investmentProjectSummaryData.id)
            expect(data).to.haveOwnProperty('projectMeta')
            expect(data).to.haveOwnProperty('project')
            expect(data).to.haveOwnProperty('value')
            expect(data).to.haveOwnProperty('requirements')
            expect(data).to.haveOwnProperty('localNavItems')
            expect(data).to.deep.equal(expected)
            done()
          } catch (error) {
            done(error)
          }
        }
      }, this.next)
    })
  })
})
