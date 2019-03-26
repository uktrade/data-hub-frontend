const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')

const companyMock = require('~/test/unit/data/companies/minimal-company.json')
const { renderDocuments } = require('~/src/apps/companies/controllers/documents')

describe('Companies documents controller', () => {
  describe('#renderDocuments', () => {
    const commonTests = (expectedCompanyName, expectedCompanyId, expectedArchivedDocumentsPath) => {
      it('should call breadcrumb', () => {
        expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledTwice
      })

      it('should call breadcrumb with', () => {
        expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledWith(expectedCompanyName, `/companies/${expectedCompanyId}`)
      })

      it('should call breadcrumb with', () => {
        expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledWith('Documents')
      })

      it('should call render', () => {
        expect(this.middlewareParameters.resMock.render).to.be.calledOnce
      })

      it('should call render with', () => {
        expect(this.middlewareParameters.resMock.render).to.be.calledWith('companies/views/documents', {
          archivedDocumentPath: expectedArchivedDocumentsPath,
        })
      })
    }

    context('when documents path is an empty string', () => {
      beforeEach(() => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: {
            ...companyMock,
            archived_documents_url_path: '',
          },
        })

        renderDocuments(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
        )
      })

      commonTests(companyMock.name, companyMock.id, '')
    })

    context('when documents path contains a url', () => {
      const archivedDocumentsPath = 'mock-document-url'

      beforeEach(() => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: {
            ...companyMock,
            archived_documents_url_path: archivedDocumentsPath,
          },
        })

        renderDocuments(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
        )
      })

      commonTests(companyMock.name, companyMock.id, archivedDocumentsPath)
    })
  })
})
