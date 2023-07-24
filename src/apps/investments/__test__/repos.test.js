const config = require('../../../config')

const {
  getInvestment,
  updateInvestment,
  getCompanyInvestmentProjects,
  archiveInvestmentProject,
  unarchiveInvestmentProject,
} = require('../../../apps/investments/repos')

const companyData = require('../../../../test/unit/data/company.json')
const investmentData = require('../../../../test/unit/data/investment/investment-data.json')
const investmentProjectAuditData = require('../../../../test/unit/data/investment/audit-log.json')

const stubRequest = { session: { token: 'token' } }

describe('Investment repository', () => {
  describe('#getCompanyInvestmentProjects', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get(
          `/v3/investment?investor_company_id=${companyData.id}&limit=10&offset=0`
        )
        .reply(200, companyData)
      this.investmentProjects = await getCompanyInvestmentProjects(
        stubRequest,
        companyData.id
      )
    })

    it('should return a company object', () => {
      expect(this.investmentProjects).to.deep.equal(companyData)
    })
  })

  describe('#getInvestment', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get(`/v3/investment/${investmentData.id}`)
        .reply(200, investmentData)
      this.investmentProject = await getInvestment(
        stubRequest,
        investmentData.id
      )
    })

    it('should return an investment object', () => {
      expect(this.investmentProject).to.deep.equal(investmentData)
    })
  })

  describe('#updateInvestment', () => {
    const appendedData = { foo: 'bar' }

    beforeEach(async () => {
      nock(config.apiRoot)
        .patch(`/v3/investment/${investmentData.id}`)
        .reply(200, investmentData)
      this.investmentProject = await updateInvestment(
        stubRequest,
        investmentData.id,
        appendedData
      )
    })

    it('should return an investment requirements object', async () => {
      expect(this.investmentProject).to.deep.equal(investmentData)
    })
  })

  describe('#archiveInvestmentProject', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .post(`/v3/investment/${investmentData.id}/archive`, { reason: 'test' })
        .reply(200, investmentProjectAuditData)
      this.investmentProjectAuditData = await archiveInvestmentProject(
        stubRequest,
        investmentData.id,
        'test'
      )
    })

    it('should call archive url and post reason', () => {
      expect(this.investmentProjectAuditData).to.deep.equal(
        investmentProjectAuditData
      )
    })
  })

  describe('#unarchiveInvestmentProject', async () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .post(`/v3/investment/${investmentData.id}/unarchive`)
        .reply(200, investmentProjectAuditData)
      this.investmentProjectAuditData = await unarchiveInvestmentProject(
        stubRequest,
        investmentData.id
      )
    })

    it('should call unarchive url', async () => {
      expect(this.investmentProjectAuditData).to.deep.equal(
        investmentProjectAuditData
      )
    })
  })
})
