
const config = require('~/config')

const {
  getInvestment,
  updateInvestment,
  getCompanyInvestmentProjects,
  createInvestmentProject,
  archiveInvestmentProject,
  unarchiveInvestmentProject,
} = require('~/src/apps/investment-projects/repos')

const companyData = require('~/test/unit/data/company.json')
const investmentData = require('~/test/unit/data/investment/investment-data.json')
const investmentProjectAuditData = require('~/test/unit/data/investment/audit-log.json')

describe('Investment repository', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#getCompanyInvestmentProjects', () => {
    beforeEach(async () => {
      this.nockScope = nock(config.apiRoot)
        .get(`/v3/investment?investor_company_id=${companyData.id}&limit=10&offset=0`)
        .reply(200, companyData)
      this.investmentProjects = await getCompanyInvestmentProjects('token', companyData.id)
    })

    it('should return a company object', () => {
      expect(this.investmentProjects).to.deep.equal(companyData)
    })

    it('nock mocked scope has been called', () => {
      expect(this.nockScope.isDone()).to.be.true
    })
  })

  describe('#getInvestment', () => {
    beforeEach(async () => {
      this.nockScope = nock(config.apiRoot)
        .get(`/v3/investment/${investmentData.id}`)
        .reply(200, investmentData)
      this.investmentProject = await getInvestment('token', investmentData.id)
    })

    it('should return an investment object', () => {
      expect(this.investmentProject).to.deep.equal(investmentData)
    })

    it('nock mocked scope has been called', () => {
      expect(this.nockScope.isDone()).to.be.true
    })
  })

  describe('#createInvestmentProject', () => {
    beforeEach(async () => {
      this.nockScope = nock(config.apiRoot)
        .post(`/v3/investment`)
        .reply(200, { id: '12345' })
      this.investmentProject = await createInvestmentProject('token', { foo: 'bar' })
    })

    it('should return an investment requirements object', () => {
      expect(this.investmentProject).to.deep.equal({ id: '12345' })
    })

    it('nock mocked scope has been called', () => {
      expect(this.nockScope.isDone()).to.be.true
    })
  })

  describe('#updateInvestment', () => {
    const appendedData = { foo: 'bar' }

    beforeEach(async () => {
      this.nockScope = nock(config.apiRoot)
        .patch(`/v3/investment/${investmentData.id}`)
        .reply(200, investmentData)
      this.investmentProject = await updateInvestment('token', investmentData.id, appendedData)
    })

    it('should return an investment requirements object', async () => {
      expect(this.investmentProject).to.deep.equal(investmentData)
    })

    it('nock mocked scope has been called', () => {
      expect(this.nockScope.isDone()).to.be.true
    })
  })

  describe('#archiveInvestmentProject', () => {
    beforeEach(async () => {
      this.nockScope = nock(config.apiRoot)
        .post(`/v3/investment/${investmentData.id}/archive`, { reason: 'test' })
        .reply(200, investmentProjectAuditData)
      this.investmentProjectAuditData = await archiveInvestmentProject('token', investmentData.id, 'test')
    })

    it('should call archive url and post reason', () => {
      expect(this.investmentProjectAuditData).to.deep.equal(investmentProjectAuditData)
    })

    it('nock mocked scope has been called', () => {
      expect(this.nockScope.isDone()).to.be.true
    })
  })

  describe('#unarchiveInvestmentProject', async () => {
    beforeEach(async () => {
      this.nockScope = nock(config.apiRoot)
        .post(`/v3/investment/${investmentData.id}/unarchive`)
        .reply(200, investmentProjectAuditData)
      this.investmentProjectAuditData = await unarchiveInvestmentProject('token', investmentData.id)
    })

    it('should call unarchive url', async () => {
      expect(this.investmentProjectAuditData).to.deep.equal(investmentProjectAuditData)
    })

    it('nock mocked scope has been called', () => {
      expect(this.nockScope.isDone()).to.be.true
    })
  })
})
