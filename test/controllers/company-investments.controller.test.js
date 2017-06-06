const token = 'abcd'
const company = {
  id: '12345',
}
const investmentProjects = [{
  id: 'project-1',
}, {
  id: 'project-2',
}]

describe('Company investments controller', function () {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.getInflatedDitCompanyStub = this.sandbox.stub().resolves(company)
    this.getCompanyInvestmentProjectsStub = this.sandbox.stub().resolves(investmentProjects)
    this.nextStub = this.sandbox.stub()

    this.controller = proxyquire('~/src/controllers/company-investments.controller', {
      '../services/company.service': {
        getInflatedDitCompany: this.getInflatedDitCompanyStub,
      },
      '../repos/investment.repo': {
        getCompanyInvestmentProjects: this.getCompanyInvestmentProjectsStub,
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#getAction', () => {
    describe('when a company id exists', () => {
      it('should render company details', (done) => {
        this.controller.getAction({
          session: {
            token,
          },
          params: {
            id: company.id,
          },
        }, {
          render: (template, data) => {
            try {
              expect(this.getInflatedDitCompanyStub).to.be.calledWith(token, company.id)
              expect(this.getCompanyInvestmentProjectsStub).to.be.calledWith(token, company.id)

              expect(data).to.haveOwnProperty('tab')
              expect(data.tab).to.deep.equal('investments')

              expect(data).to.haveOwnProperty('company')
              expect(data.company).to.deep.equal(company)

              expect(data).to.haveOwnProperty('projects')
              expect(data.projects).to.deep.equal(investmentProjects)

              expect(this.nextStub).not.to.be.called

              done()
            } catch (error) {
              done(error)
            }
          },
        }, this.nextStub)
      })
    })

    describe('when a company is not found', () => {
      beforeEach(() => {
        this.getInflatedDitCompanyStub.rejects(new Error('Company not found'))
      })

      it('should call the next function', (done) => {
        const renderStub = this.sandbox.stub()

        this.controller.getAction({
          session: {
            token,
          },
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
