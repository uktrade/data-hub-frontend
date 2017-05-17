const company = {
  id: '12345',
  name: 'Test company',
  uk_based: false
}
const investmentProjects = {
  count: 0,
  results: []
}

describe('Investment start controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.next = this.sandbox.stub()
    this.getInflatedDitCompany = this.sandbox.stub().resolves(company)
    this.getCompanyInvestmentProjects = this.sandbox.stub().resolves(investmentProjects)

    this.controller = proxyquire(`${root}/src/controllers/investment-create.controller`, {
      '../services/company.service': {
        getInflatedDitCompany: this.getInflatedDitCompany
      },
      '../repos/investment.repo': {
        getCompanyInvestmentProjects: this.getCompanyInvestmentProjects
      }
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#getHandler', () => {
    describe('when a the company exists', () => {
      it('should render company details', (done) => {
        this.controller.getHandler({
          session: {
            token: 'abcd'
          },
          query: {
            'equity-company': '12345'
          }
        }, {
          render: (template, data) => {
            expect(this.getInflatedDitCompany).to.be.calledWith('abcd', '12345')
            expect(this.getCompanyInvestmentProjects).to.be.calledWith('abcd', '12345')

            expect(data.equityCompany).to.deep.equal(company)
            expect(data.equityCompanyInvestments).to.deep.equal(investmentProjects)
            done()
          }
        }, this.next)
      })
    })
  })
})
