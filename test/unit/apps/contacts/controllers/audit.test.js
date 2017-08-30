const auditLog = require('~/test/unit/data/audit/contact-audit.json')
const { contactDetailsLabels } = require('~/src/apps/contacts/labels')

describe('Contact audit controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.transformed = {}
    this.getContactAuditLogStub = this.sandbox.stub().resolves(auditLog)
    this.transformAuditLogToCollectionStub = this.sandbox.stub().returns(this.transformed)

    this.next = this.sandbox.stub()

    this.breadcrumbStub = function () { return this }

    this.controller = proxyquire('~/src/apps/contacts/controllers/audit', {
      '../repos': {
        getContactAuditLog: this.getContactAuditLogStub,
      },
      '../../audit/transformers': {
        transformAuditLogToCollection: this.transformAuditLogToCollectionStub,
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
    this.controller.getAudit(this.req, {
      breadcrumb: this.breadcrumbStub,
      render: (template, data) => {
        expect(this.getContactAuditLogStub).to.be.calledWith(this.req.session.token, this.req.params.contactId, 1)
        done()
      },
    }, this.next)
  })

  it('should pass on any page number specified, for pagination', (done) => {
    this.req.query.page = '3'

    this.controller.getAudit(this.req, {
      breadcrumb: this.breadcrumbStub,
      render: (template, data) => {
        expect(this.getContactAuditLogStub).to.be.calledWith(this.req.session.token, this.req.params.contactId, '3')
        done()
      },
    }, this.next)
  })

  it('should transform the results returns', (done) => {
    this.controller.getAudit(this.req, {
      breadcrumb: this.breadcrumbStub,
      render: (template, data) => {
        expect(this.transformAuditLogToCollectionStub).to.be.calledWith(auditLog, contactDetailsLabels)
        done()
      },
    }, this.next)
  })
})
