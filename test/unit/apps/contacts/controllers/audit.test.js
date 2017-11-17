const auditLog = require('~/test/unit/data/audit/contact-audit.json')
const { contactDetailsLabels } = require('~/src/apps/contacts/labels')

describe('Contact audit controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.transformed = {}
    this.getContactAuditLogStub = this.sandbox.stub().resolves(auditLog)
    this.transformApiResponseToCollectionInnerStub = this.sandbox.stub().returns()
    this.transformApiResponseToCollectionStub = this.sandbox.stub().returns(this.transformApiResponseToCollectionInnerStub)
    this.generatedTransformer = this.sandbox.stub()
    this.transformAuditLogToListItemStub = this.sandbox.stub().returns(this.generatedTransformer)

    this.breadcrumbStub = function () {
      return this
    }

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
          expect(this.transformAuditLogToListItemStub).to.be.calledWith(contactDetailsLabels)
          done()
        },
      }, done)
    } catch (error) {
      done(error)
    }
  })
})
