const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')

const companyMock = require('~/test/unit/data/companies/minimal-company.json')
const dnbCompanyMock = require('~/test/unit/data/companies/dnb-company.json')
const { renderDocuments } = require('~/src/apps/companies/controllers/documents')

describe('Companies documents controller', () => {
  describe('#renderDocuments', () => {
    const commonTests = (expectedCompanyName, expectedCompanyId, expectedTemplate, expectedArchivedDocumentsPath) => {
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
        expect(this.middlewareParameters.resMock.render).to.be.calledWith(expectedTemplate, {
          archivedDocumentPath: expectedArchivedDocumentsPath,
        })
      })
    }

    context('when the company does not have a DUNS number', () => {
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

        commonTests(companyMock.name, companyMock.id, 'companies/views/_deprecated/documents', '')
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

        commonTests(companyMock.name, companyMock.id, 'companies/views/_deprecated/documents', archivedDocumentsPath)
      })
    })

    context('when the company does have a DUNS number', () => {
      const archivedDocumentsPath = 'mock-document-url'

      beforeEach(() => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: {
            ...dnbCompanyMock,
            archived_documents_url_path: archivedDocumentsPath,
          },
        })

        renderDocuments(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
        )
      })

      commonTests(dnbCompanyMock.name, dnbCompanyMock.id, 'companies/views/documents', archivedDocumentsPath)
    })

    context('when the company does not have a DUNS number and the companies new layout feature is enabled', () => {
      const archivedDocumentsPath = 'mock-document-url'

      beforeEach(() => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: {
            ...companyMock,
            archived_documents_url_path: archivedDocumentsPath,
          },
          features: {
            'companies-new-layout': true,
          },
        })

        renderDocuments(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
        )
      })

      commonTests(companyMock.name, companyMock.id, 'companies/views/documents', archivedDocumentsPath)
    })
  })
})
