const auditLog = require('~/test/unit/data/audit/contact-audit.json')
const { contactAuditLabels } = require('~/src/apps/contacts/labels')

describe('Contact audit controller', () => {
  beforeEach(() => {
    this.transformed = {}
    this.getContactAuditLogStub = sandbox.stub().resolves(auditLog)
    this.transformApiResponseToCollectionInnerStub = sandbox.stub().returns()
    this.transformApiResponseToCollectionStub = sandbox.stub().returns(this.transformApiResponseToCollectionInnerStub)
    this.generatedTransformer = sandbox.stub()
    this.transformAuditLogToListItemStub = sandbox.stub().returns(this.generatedTransformer)

    this.breadcrumbStub = sandbox.stub().returnsThis()

    this.controller = proxyquire('~/src/apps/contacts/controllers/audit', {
      '../repos': {
        getContactAuditLog: this.getContactAuditLogStub,
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
        contactId: '1234',
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

  it('should call the contact audit repository', (done) => {
    try {
      this.controller.getAudit(this.req, {
        breadcrumb: this.breadcrumbStub,
        render: (template, data) => {
          expect(this.getContactAuditLogStub).to.be.calledWith(this.req.session.token, this.req.params.contactId, 1)
          done()
        },
      }, done)
    } catch (error) {
      done(error)
    }
  })

  it('should pass on any page number specified, for pagination', (done) => {
    try {
      this.req.query.page = '3'

      this.controller.getAudit(this.req, {
        breadcrumb: this.breadcrumbStub,
        render: (template, data) => {
          expect(this.getContactAuditLogStub).to.be.calledWith(this.req.session.token, this.req.params.contactId, '3')
          done()
        },
      }, done)
    } catch (error) {
      done(error)
    }
  })

  it('should transform the results returned', (done) => {
    try {
      const options = { entityType: 'audit', query: this.req.query }

      this.controller.getAudit(this.req, {
        breadcrumb: this.breadcrumbStub,
        render: (template, data) => {
          expect(this.transformApiResponseToCollectionStub).to.be.calledWith(options, this.generatedTransformer)
          expect(this.transformAuditLogToListItemStub).to.be.calledWith(contactAuditLabels)
          done()
        },
      }, done)
    } catch (error) {
      done(error)
    }
  })
})
