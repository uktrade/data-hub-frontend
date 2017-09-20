const token = 'abcd'
const company = {
  id: '12345',
}
const investmentProjects = {
  count: 2,
  page: 1,
  results: [{
    project_code: 'I-001',
    id: 'project-1',
  }, {
    project_code: 'I-002',
    id: 'project-2',
  }],
}

describe('Company investments controller', function () {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.getDitCompanyStub = this.sandbox.stub().resolves(company)
    this.getCompanyInvestmentProjectsStub = this.sandbox.stub().resolves(investmentProjects)
    this.getCommonTitlesAndlinksStub = this.sandbox.stub()
    this.nextStub = this.sandbox.stub()
    this.breadcrumbStub = function () {
      return this
    }

    this.controller = proxyquire('~/src/apps/companies/controllers/investments', {
      '../services/data': {
        getCommonTitlesAndlinks: this.getCommonTitlesAndlinksStub,
      },
      '../../investment-projects/repos': {
        getCompanyInvestmentProjects: this.getCompanyInvestmentProjectsStub,
      },
      '../repos': {
        getDitCompany: this.getDitCompanyStub,
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#getAction', () => {
    describe('when a company id exists', () => {
      it('should render company details', (done) => {
        const reqStub = {
          session: {
            token,
          },
          query: {},
          params: {
            id: company.id,
          },
        }
        const resStub = {
          breadcrumb: this.breadcrumbStub,
          render: (template, data) => {
            try {
              expect(this.getDitCompanyStub).to.be.calledWith(token, company.id)
              expect(this.getCompanyInvestmentProjectsStub).to.be.calledWith(token, company.id)
              expect(this.getCommonTitlesAndlinksStub).to.be.calledWith(reqStub, resStub, company)

              expect(data).to.haveOwnProperty('tab')
              expect(data.tab).to.deep.equal('investments')

              expect(data).to.haveOwnProperty('company')
              expect(data.company).to.deep.equal(company)

              expect(data).to.haveOwnProperty('results')
              expect(data.results).to.haveOwnProperty('items')
              expect(data.results).to.haveOwnProperty('pagination', null)

              expect(data.results.items).to.have.length(2)
              expect(data.results.items[0]).to.have.property('meta')

              expect(this.nextStub).not.to.be.called

              done()
            } catch (error) {
              done(error)
            }
          },
        }

        this.controller.getAction(reqStub, resStub, this.nextStub)
      })
    })

    describe('when a company is not found', () => {
      beforeEach(() => {
        this.getDitCompanyStub.rejects(new Error('Company not found'))
      })

      it('should call the next function', (done) => {
        const renderStub = this.sandbox.stub()

        this.controller.getAction({
          session: {
            token,
          },
          query: {},
          params: {
            id: company.id,
          },
        }, {
          render: renderStub,
        }, (error) => {
          expect(error).to.be.an('error')
          expect(renderStub).not.to.be.called

          done()
        })
      })
    })
  })
})
