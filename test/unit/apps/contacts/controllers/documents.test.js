const { assign, set } = require('lodash')

const { renderDocuments } = require('~/src/apps/contacts/controllers/documents')

describe('Contacts documents controller', () => {
  beforeEach(() => {
    this.breadcrumbStub = sandbox.stub().returnsThis()
    this.resMock = assign({}, globalRes, {
      breadcrumb: this.breadcrumbStub,
      render: sandbox.spy(),
    })
    this.reqMock = assign({}, globalReq)
    this.nextSpy = sandbox.spy()
  })

  describe('#renderDocuments', () => {
    context('when documents path is undefined', () => {
      beforeEach(() => {
        renderDocuments(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call next', () => {
        expect(this.nextSpy).to.be.calledOnce
      })

      it('should pass 403 object to next', () => {
        expect(this.nextSpy).to.be.calledWith({ statusCode: 403 })
      })
    })

    context('when documents path is an empty string', () => {
      beforeEach(() => {
        set(this.resMock, 'locals.contact.archived_documents_url_path', '')
        renderDocuments(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call breadcrumb', () => {
        expect(this.resMock.breadcrumb).to.be.calledOnce
      })

      it('should call breadcrumb with', () => {
        expect(this.resMock.breadcrumb).to.be.calledWith('Documents')
      })

      it('should call render', () => {
        expect(this.resMock.render).to.be.calledOnce
      })

      it('should call render with', () => {
        expect(this.resMock.render).to.be.calledWith('contacts/views/documents', { archivedDocumentPath: '' })
      })
    })

    context('when documents path contains a url', () => {
      const mockDocumentUrl = 'mock-document-url'
      beforeEach(() => {
        set(this.resMock, 'locals.contact.archived_documents_url_path', mockDocumentUrl)
        renderDocuments(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should call breadcrumb', () => {
        expect(this.resMock.breadcrumb).to.be.calledOnce
      })

      it('should call breadcrumb with', () => {
        expect(this.resMock.breadcrumb).to.be.calledWith('Documents')
      })

      it('should call render', () => {
        expect(this.resMock.render).to.be.calledOnce
      })

      it('should call render with', () => {
        expect(this.resMock.render).to.be.calledWith('contacts/views/documents', {
          archivedDocumentPath: mockDocumentUrl,
        })
      })
    })
  })
})
