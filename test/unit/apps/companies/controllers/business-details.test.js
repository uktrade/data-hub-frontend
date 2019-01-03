const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')

const config = require('~/config')
const dnbCompanyMock = require('~/test/unit/data/companies/dnb-company.json')
const subsidiariesMock = require('~/test/unit/data/companies/subsidiaries.json')

const { renderBusinessDetails } = require('~/src/apps/companies/controllers/business-details')

describe('#renderBusinessDetails', () => {
  context('when rendering the view', () => {
    const commonTests = () => {
      it('should set the company breadcrumb', () => {
        const expectedName = dnbCompanyMock.name
        const expectedUrl = `/companies/${dnbCompanyMock.id}`

        expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledWithExactly(expectedName, expectedUrl)
      })

      it('should set the business details breadcrumb', () => {
        expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledWithExactly('Business details')
      })

      it('should render the business details view', () => {
        expect(this.middlewareParameters.resMock.render.firstCall.args[0]).to.equal('companies/views/business-details')
      })

      it('should set the heading', () => {
        expect(this.middlewareParameters.resMock.render.firstCall.args[1].heading).to.equal('Business details')
      })

      it('set the known as details', () => {
        expect(this.middlewareParameters.resMock.render.firstCall.args[1].knownAsDetails).to.exist
      })

      it('set the One List details', () => {
        expect(this.middlewareParameters.resMock.render.firstCall.args[1].oneListDetails).to.exist
      })

      it('set the business hierarchy details', () => {
        expect(this.middlewareParameters.resMock.render.firstCall.args[1].businessHierarchyDetails).to.exist
      })

      it('set the addresses details', () => {
        expect(this.middlewareParameters.resMock.render.firstCall.args[1].addressesDetails).to.exist
      })
    }

    context('when the company does not have archived documents', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .get(`/v3/company?limit=10&offset=0&sortby=name&global_headquarters_id=${dnbCompanyMock.id}`)
          .reply(200, subsidiariesMock)

        this.middlewareParameters = buildMiddlewareParameters({
          company: dnbCompanyMock,
        })

        await renderBusinessDetails(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      commonTests()

      it('should not set the archived documents path', () => {
        expect(this.middlewareParameters.resMock.render.firstCall.args[1].archivedDocumentPath).to.not.exist
      })
    })

    context('when the company has archived documents', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .get(`/v3/company?limit=10&offset=0&sortby=name&global_headquarters_id=${dnbCompanyMock.id}`)
          .reply(200, subsidiariesMock)

        this.middlewareParameters = buildMiddlewareParameters({
          company: {
            ...dnbCompanyMock,
            archived_documents_url_path: 'archived',
          },
        })

        await renderBusinessDetails(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      commonTests()

      it('should not set the archived documents path', () => {
        expect(this.middlewareParameters.resMock.render.firstCall.args[1].archivedDocumentPath).to.equal('archived')
      })
    })
  })
})
