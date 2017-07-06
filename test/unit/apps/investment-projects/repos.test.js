const nock = require('nock')
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
  describe('#getCompanyInvestmentProjects', () => {
    nock(config.apiRoot)
      .get(`/v3/investment/project?investor_company_id=${companyData.id}`)
      .reply(200, companyData)

    it('should return a company object', () => {
      const actual = getCompanyInvestmentProjects('token', companyData.id)

      return expect(actual).to.eventually.deep.equal(companyData)
    })
  })

  describe('#getInvestment', () => {
    nock(config.apiRoot)
      .get(`/v3/investment/${investmentData.id}`)
      .reply(200, investmentData)

    it('should return an investment object', () => {
      const actual = getInvestment('token', investmentData.id)

      return expect(actual).to.eventually.deep.equal(investmentData)
    })
  })

  describe('#createInvestmentProject', () => {
    nock(config.apiRoot)
      .post(`/v3/investment/project`)
      .reply(200, { id: '12345' })

    it('should return an investment requirements object', () => {
      const actual = createInvestmentProject('token', { foo: 'bar' })

      return expect(actual).to.eventually.deep.equal({ id: '12345' })
    })
  })

  describe('#updateInvestment', () => {
    const appendedData = { foo: 'bar' }

    nock(config.apiRoot)
      .patch(`/v3/investment/${investmentData.id}`)
      .reply(200, investmentData)

    it('should return an investment requirements object', () => {
      const actual = updateInvestment('token', investmentData.id, appendedData)

      return expect(actual).to.eventually.deep.equal(investmentData)
    })
  })

  describe('#archiveInvestmentProject', () => {
    nock(config.apiRoot)
      .post(`/v3/investment/${investmentData.id}/archive`, { reason: 'test' })
      .reply(200, investmentProjectAuditData)

    it('should call archive url and post reason', () => {
      return archiveInvestmentProject('token', investmentData.id, 'test')
    })
  })

  describe('#unarchiveInvestmentProject', () => {
    nock(config.apiRoot)
      .post(`/v3/investment/${investmentData.id}/unarchive`)
      .reply(200, investmentProjectAuditData)

    it('should call unarchive url', () => {
      return unarchiveInvestmentProject('token', investmentData.id)
    })
  })
})
