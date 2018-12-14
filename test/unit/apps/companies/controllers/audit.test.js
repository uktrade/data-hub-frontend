const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')

const auditLogMock = require('~/test/unit/data/audit/company-audit.json')
const companyMock = require('~/test/unit/data/companies/company.json')
const dnbCompanyMock = require('~/test/unit/data/companies/dnb-company.json')

describe('Company audit controller', () => {
  beforeEach(() => {
    this.getCompanyAuditLogStub = sinon.stub()
    this.transformApiResponseToCollectionSpy = sinon.spy()
    this.transformAuditLogToListItemSpy = sinon.spy()

    this.controller = proxyquire('~/src/apps/companies/controllers/audit', {
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
    const commonTests = (expectedCompanyId, expectedTemplate) => {
      it('should call audit log with correct arguments', () => {
        expect(this.getCompanyAuditLogStub).to.have.been.calledWith('1234', expectedCompanyId, 1)
      })

      it('should call api transformer', () => {
        expect(this.transformApiResponseToCollectionSpy).to.have.been.calledOnce
      })

      it('should call list item transformer', () => {
        expect(this.transformAuditLogToListItemSpy).to.have.been.calledOnce
      })

      it('should set the correct number of breadcrumbs', () => {
        expect(this.middlewareParameters.resMock.breadcrumb).to.have.been.calledTwice
      })

      it('should render the correct template', () => {
        expect(this.middlewareParameters.resMock.render.args[0][0]).to.equal(expectedTemplate)
        expect(this.middlewareParameters.resMock.render).to.have.been.calledOnce
      })

      it('should send the correct template data', () => {
        expect(this.middlewareParameters.resMock.render.args[0][1]).to.deep.equal({
          auditLog: auditLogMock,
        })
      })
    }

    context('when the company does not have a DUNS number', () => {
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

      commonTests(companyMock.id, 'companies/views/_deprecated/audit')
    })

    context('when the company does have a DUNS number', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: dnbCompanyMock,
        })

        this.getCompanyAuditLogStub.resolves(auditLogMock)

        await this.controller.renderAuditLog(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      commonTests(dnbCompanyMock.id, 'companies/views/audit')
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
