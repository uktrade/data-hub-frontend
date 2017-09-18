const auditLog = require('~/test/unit/data/audit/company-audit.json')
const { companyData } = require('~/test/unit/data/company.json')
const { companyDetailsLabels } = require('~/src/apps/companies/labels')

describe('Company audit controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.transformed = {}
    this.getDitCompanyStub = this.sandbox.stub().resolves(companyData)
    this.getCompanyAuditLogStub = this.sandbox.stub().resolves(auditLog)
    this.getCommonTitlesAndlinksStub = this.sandbox.stub()
    this.next = this.sandbox.stub()

    this.transformApiResponseToCollectionInnerStub = this.sandbox.stub().returns()
    this.transformApiResponseToCollectionStub = this.sandbox.stub().returns(this.transformApiResponseToCollectionInnerStub)
    this.generatedTransformer = this.sandbox.stub()
    this.transformAuditLogToListItemStub = this.sandbox.stub().returns(this.generatedTransformer)
    this.breadcrumbStub = function () {
      return this
    }

    this.controller = proxyquire('~/src/apps/companies/controllers/audit', {
      '../repos': {
        getCompanyAuditLog: this.getCompanyAuditLogStub,
        getDitCompany: this.getDitCompanyStub,
      },
      '../services/data': {
        getCommonTitlesAndlinks: this.getCommonTitlesAndlinksStub,
      },
      '../../transformers': {
        transformApiResponseToCollection: this.transformApiResponseToCollectionStub,
      },
      '../../audit/transformers': {
        transformAuditLogToListItem: this.transformAuditLogToListItemStub,
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
    try {
      this.controller.getAudit(this.req, {
        breadcrumb: this.breadcrumbStub,
        render: (template, data) => {
          expect(this.getDitCompanyStub).to.be.calledWith(this.req.session.token, this.req.params.id)
          expect(this.getCommonTitlesAndlinksStub).to.be.calledWith(sinon.match.any, sinon.match.any, companyData)
          done()
        },
      }, done)
    } catch (error) {
      done(error)
    }
  })

  it('should call the company audit repository', (done) => {
    this.controller.getAudit(this.req, {
      breadcrumb: this.breadcrumbStub,
      render: (template, data) => {
        expect(this.getCompanyAuditLogStub).to.be.calledWith(this.req.session.token, this.req.params.id, 1)
        done()
      },
    }, done)
  })

  it('should pass on any page number specified, for pagination', (done) => {
    try {
      this.req.query.page = '3'

      this.controller.getAudit(this.req, {
        breadcrumb: this.breadcrumbStub,
        render: (template, data) => {
          expect(this.getCompanyAuditLogStub).to.be.calledWith(this.req.session.token, this.req.params.id, '3')
          done()
        },
      }, this.next)
    } catch (error) {
      done(error)
    }
  })

  it('should transform the results returned', (done) => {
    try {
      const options = { entityType: 'audit' }

      this.controller.getAudit(this.req, {
        breadcrumb: this.breadcrumbStub,
        render: (template, data) => {
          expect(this.transformApiResponseToCollectionStub).to.be.calledWith(options, this.generatedTransformer)
          expect(this.transformAuditLogToListItemStub).to.be.calledWith(companyDetailsLabels)
          done()
        },
      }, done)
    } catch (error) {
      done(error)
    }
  })
})
