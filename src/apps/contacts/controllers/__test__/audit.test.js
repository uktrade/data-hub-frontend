const proxyquire = require('proxyquire')

const auditLog = require('../../../../../test/unit/data/audit/contact-audit.json')
const { contactAuditLabels } = require('../../labels')

describe('Contact audit controller', () => {
  beforeEach(() => {
    this.transformed = {}
    this.getContactAuditLogStub = sinon.stub().resolves(auditLog)
    this.transformApiResponseToCollectionInnerStub = sinon.stub().returns()
    this.transformApiResponseToCollectionStub = sinon
      .stub()
      .returns(this.transformApiResponseToCollectionInnerStub)
    this.generatedTransformer = sinon.stub()
    this.transformAuditLogToListItemStub = sinon
      .stub()
      .returns(this.generatedTransformer)

    this.breadcrumbStub = sinon.stub().returnsThis()

    this.controller = proxyquire('../audit', {
      '../repos': {
        getContactAuditLog: this.getContactAuditLogStub,
      },
      '../../../modules/api/transformers': {
        transformApiResponseToCollection: this
          .transformApiResponseToCollectionStub,
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

  it('should call the contact audit repository', (done) => {
    try {
      this.controller.getAudit(
        this.req,
        {
          breadcrumb: this.breadcrumbStub,
          render: () => {
            expect(this.getContactAuditLogStub).to.be.calledWith(
              this.req,
              this.req.params.contactId,
              1
            )
            done()
          },
        },
        done
      )
    } catch (error) {
      done(error)
    }
  })

  it('should pass on any page number specified, for pagination', (done) => {
    try {
      this.req.query.page = '3'

      this.controller.getAudit(
        this.req,
        {
          breadcrumb: this.breadcrumbStub,
          render: () => {
            expect(this.getContactAuditLogStub).to.be.calledWith(
              this.req,
              this.req.params.contactId,
              '3'
            )
            done()
          },
        },
        done
      )
    } catch (error) {
      done(error)
    }
  })

  it('should transform the results returned', (done) => {
    try {
      const options = { entityType: 'audit', query: this.req.query }

      this.controller.getAudit(
        this.req,
        {
          breadcrumb: this.breadcrumbStub,
          render: () => {
            expect(this.transformApiResponseToCollectionStub).to.be.calledWith(
              options,
              this.generatedTransformer
            )
            expect(this.transformAuditLogToListItemStub).to.be.calledWith(
              contactAuditLabels
            )
            done()
          },
        },
        done
      )
    } catch (error) {
      done(error)
    }
  })
})
