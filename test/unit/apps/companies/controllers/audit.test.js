const buildMiddlewareParameters = require('test/unit/helpers/middleware-parameters-builder.js')

const auditLogMock = require('test/unit/data/audit/company-audit.json')
const companyMock = require('test/unit/data/companies/company-v4.json')

describe('Company audit controller', () => {
  beforeEach(() => {
    this.getCompanyAuditLogStub = sinon.stub()
    this.transformApiResponseToCollectionSpy = sinon.spy()
    this.transformAuditLogToListItemSpy = sinon.spy()

    this.controller = proxyquire('src/apps/companies/controllers/audit', {
      '../repos': {
        getCompanyAuditLog: this.getCompanyAuditLogStub,
      },
      '../../../modules/api/transformers': {
        transformApiResponseToCollection: this.transformApiResponseToCollectionSpy,
      },
      '../../audit/transformers': {
        transformAuditLogToListItem: this.transformAuditLogToListItemSpy,
      },
    })
  })

  context('when audit returns successfully', () => {
    beforeEach(async () => {
      this.middlewareParameters = buildMiddlewareParameters({
        company: companyMock,
      })

      this.getCompanyAuditLogStub.resolves(auditLogMock)

      await this.controller.renderAuditLog(
        this.middlewareParameters.reqMock,
        this.middlewareParameters.resMock,
        this.middlewareParameters.nextSpy,
      )
    })

    it('should call audit log with correct arguments', () => {
      expect(this.getCompanyAuditLogStub).to.have.been.calledWith('1234', companyMock.id, 1)
    })

    it('should call api transformer', () => {
      expect(this.transformApiResponseToCollectionSpy).to.have.been.calledOnce
    })

    it('should call list item transformer', () => {
      expect(this.transformAuditLogToListItemSpy).to.have.been.calledOnce
    })

    it('should set three breadcrumbs', () => {
      expect(this.middlewareParameters.resMock.breadcrumb).to.have.been.calledThrice
    })

    it('should set the company breadcrumb', () => {
      expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledWithExactly(companyMock.name, `/companies/${companyMock.id}`)
    })

    it('should set the business details breadcrumb', () => {
      expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledWithExactly('Business details', `/companies/${companyMock.id}/business-details`)
    })

    it('should set the audit breadcrumb', () => {
      expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledWithExactly('Audit history')
    })

    it('should render the correct template', () => {
      expect(this.middlewareParameters.resMock.render.args[0][0]).to.equal('companies/views/audit')
      expect(this.middlewareParameters.resMock.render).to.have.been.calledOnce
    })

    it('should send the correct template data', () => {
      expect(this.middlewareParameters.resMock.render.args[0][1]).to.deep.equal({
        auditLog: auditLogMock,
      })
    })
  })

  context('when audit rejects', () => {
    beforeEach(async () => {
      this.middlewareParameters = buildMiddlewareParameters({
        company: companyMock,
      })

      this.errorMock = {
        errorCode: 500,
      }

      this.getCompanyAuditLogStub.rejects(this.errorMock)

      await this.controller.renderAuditLog(
        this.middlewareParameters.reqMock,
        this.middlewareParameters.resMock,
        this.middlewareParameters.nextSpy,
      )
    })

    it('should call next with error', () => {
      expect(this.middlewareParameters.nextSpy).to.have.been.calledWith(this.errorMock)
      expect(this.middlewareParameters.nextSpy).to.have.been.calledOnce
    })
  })
})
