const token = 'abcd'
const apiRoot = 'http://api-root.com'
const company = {
  id: '12345',
  name: 'Test company'
}

describe('Investment repository', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.authorisedRequest = this.sandbox.stub().returns(company)

    this.controller = proxyquire(`${root}/src/repos/investment.repo`, {
      '../config': {
        apiRoot
      },
      '../lib/authorised-request': this.authorisedRequest
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#getCompanyInvestmentProjects', () => {
    it('should return a company object', () => {
      const result = this.controller.getCompanyInvestmentProjects(token, company.id)

      expect(this.authorisedRequest).to.be.calledWith(token, `${apiRoot}/v3/investment/project?investor_company_id=12345`)
      expect(result).to.deep.equal(company)
    })
  })
})
