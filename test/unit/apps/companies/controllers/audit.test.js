const auditLog = require('~/test/unit/data/audit/company-audit.json')
const { companyData } = require('~/test/unit/data/company.json')
const { companyDetailsLabels } = require('~/src/apps/companies/labels')

describe('Company audit controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.transformed = {}
    this.getDitCompanyStub = this.sandbox.stub().resolves(companyData)
    this.getCompanyAuditLogStub = this.sandbox.stub().resolves(auditLog)
    this.transformAuditLogToCollectionStub = this.sandbox.stub().returns(this.transformed)
    this.getCommonTitlesAndlinksStub = this.sandbox.stub()
    this.next = this.sandbox.stub()
    this.breadcrumbStub = function () { return this }

    this.controller = proxyquire('~/src/apps/companies/controllers/audit', {
      '../repos': {
        getCompanyAuditLog: this.getCompanyAuditLogStub,
        getDitCompany: this.getDitCompanyStub,
      },
      '../services/data': {
        getCommonTitlesAndlinks: this.getCommonTitlesAndlinksStub,
      },
      '../../audit/transformers': {
        transformAuditLogToCollection: this.transformAuditLogToCollectionStub,
      },
    })

    this.req = {
      params: {
        id: '1234',
      },
      query: {},
      session: {
        token: '9999',
      },
    }
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  it('should get the company details and generate heading data', (done) => {
    this.controller.getAudit(this.req, {
      breadcrumb: this.breadcrumbStub,
      render: (template, data) => {
        expect(this.getDitCompanyStub).to.be.calledWith(this.req.session.token, this.req.params.id)
        expect(this.getCommonTitlesAndlinksStub).to.be.calledWith(sinon.match.any, sinon.match.any, companyData)
        done()
      },
    }, this.next)
  })

  it('should call the company audit repository', (done) => {
    this.controller.getAudit(this.req, {
      breadcrumb: this.breadcrumbStub,
      render: (template, data) => {
        expect(this.getCompanyAuditLogStub).to.be.calledWith(this.req.session.token, this.req.params.id, 1)
        done()
      },
    }, this.next)
  })

  it('should pass on any page number specified, for pagination', (done) => {
    this.req.query.page = '3'

    this.controller.getAudit(this.req, {
      breadcrumb: this.breadcrumbStub,
      render: (template, data) => {
        expect(this.getCompanyAuditLogStub).to.be.calledWith(this.req.session.token, this.req.params.id, '3')
        done()
      },
    }, this.next)
  })

  it('should transform the results returns', (done) => {
    this.controller.getAudit(this.req, {
      breadcrumb: this.breadcrumbStub,
      render: (template, data) => {
        expect(this.transformAuditLogToCollectionStub).to.be.calledWith(auditLog, companyDetailsLabels)
        done()
      },
    }, this.next)
  })
})
