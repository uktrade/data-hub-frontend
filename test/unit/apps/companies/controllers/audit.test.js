const auditLogMock = require('~/test/unit/data/audit/company-audit.json')
const companyMock = require('~/test/unit/data/companies/company.json')
const tokenMock = '12345abcde'

describe('Company audit controller', () => {
  beforeEach(() => {
    this.getCompanyAuditLogStub = sandbox.stub()
    this.transformApiResponseToCollectionSpy = sandbox.spy()
    this.transformAuditLogToListItemSpy = sandbox.spy()
    this.breadcrumbStub = sandbox.stub().returnsThis()
    this.renderSpy = sandbox.spy()
    this.nextSpy = sandbox.spy()

    this.controller = proxyquire('~/src/apps/companies/controllers/audit', {
      '../repos': {
        getCompanyAuditLog: this.getCompanyAuditLogStub,
      },
      '../../transformers': {
        transformApiResponseToCollection: this.transformApiResponseToCollectionSpy,
      },
      '../../audit/transformers': {
        transformAuditLogToListItem: this.transformAuditLogToListItemSpy,
      },
    })

    this.reqMock = {
      query: {},
      session: {
        token: tokenMock,
      },
    }
    this.resMock = {
      breadcrumb: this.breadcrumbStub,
      render: this.renderSpy,
      locals: {
        company: companyMock,
      },
    }
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  context('when audit returns successfully', () => {
    beforeEach(() => {
      this.getCompanyAuditLogStub.resolves(auditLogMock)
    })

    context('with default page number', () => {
      beforeEach(async () => {
        await this.controller.renderAuditLog(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call audit log with correct arguments', () => {
        expect(this.getCompanyAuditLogStub).to.have.been.calledWith(tokenMock, companyMock.id, 1)
      })

      it('should call api transformer', () => {
        expect(this.transformApiResponseToCollectionSpy).to.have.been.calledOnce
      })

      it('should call list item transformer', () => {
        expect(this.transformAuditLogToListItemSpy).to.have.been.calledOnce
      })

      it('should set the correct number of breadcrumbs', () => {
        expect(this.breadcrumbStub).to.have.been.calledTwice
      })

      it('should render the correct template', () => {
        expect(this.renderSpy.args[0][0]).to.equal('companies/views/audit')
        expect(this.renderSpy).to.have.been.calledOnce
      })

      it('should send the correct template data', () => {
        expect(this.renderSpy.args[0][1]).to.deep.equal({
          auditLog: auditLogMock,
        })
      })
    })

    context('when a custom page number', () => {
      beforeEach(async () => {
        this.reqMock.query.page = 2

        await this.controller.renderAuditLog(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call audit log with custom page number', () => {
        expect(this.getCompanyAuditLogStub).to.have.been.calledWith(tokenMock, companyMock.id, 2)
      })
    })
  })

  context('when audit rejects', () => {
    beforeEach(async () => {
      this.errorMock = {
        errorCode: 500,
      }
      this.getCompanyAuditLogStub.rejects(this.errorMock)

      await this.controller.renderAuditLog(this.reqMock, this.resMock, this.nextSpy)
    })

    it('should call next with error', () => {
      expect(this.nextSpy).to.have.been.calledWith(this.errorMock)
      expect(this.nextSpy).to.have.been.calledOnce
    })
  })
})
