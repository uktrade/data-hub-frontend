const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')

const config = require('~/config')
const companyMock = require('~/test/unit/data/companies/companies-house-company.json')
const dnbCompanyMock = require('~/test/unit/data/companies/dnb-company.json')
const timelineMock = require('~/test/unit/data/companies/timeline.json')

const { renderTimeline } = require('~/src/apps/companies/controllers/timeline')

describe('Company timeline controller', () => {
  describe('#renderTimeline', () => {
    context('when timeline api returns valid data', () => {
      const commonTests = (expectedBreadcrumbs, expectedTemplate) => {
        it('return a transformed list of entries', () => {
          const timeline = this.middlewareParameters.resMock.render.args[0][1].timeline

          expect(timeline).to.exist
        })

        it('should set the breadcrumbs', () => {
          expect(this.middlewareParameters.resMock.breadcrumb).to.have.been.calledTwice
          expect(this.middlewareParameters.resMock.breadcrumb).to.have.been.calledWith(expectedBreadcrumbs[0].text, expectedBreadcrumbs[0].href)
          expect(this.middlewareParameters.resMock.breadcrumb).to.have.been.calledWith(expectedBreadcrumbs[1].text)
        })

        it('should render the correct template', () => {
          expect(this.middlewareParameters.resMock.render.args[0][0]).to.equal(expectedTemplate)
          expect(this.middlewareParameters.resMock.render).to.have.been.calledOnce
        })
      }

      context('when rendering for a company without a DUNS number', () => {
        beforeEach(async () => {
          nock(config.apiRoot)
            .get(`/v3/company/${companyMock.id}/timeline?limit=10&offset=0`)
            .reply(200, timelineMock)

          this.middlewareParameters = buildMiddlewareParameters({
            company: companyMock,
          })

          await renderTimeline(
            this.middlewareParameters.reqMock,
            this.middlewareParameters.resMock,
            this.middlewareParameters.nextSpy,
          )
        })

        commonTests([
          { text: companyMock.name, href: `/companies/${companyMock.id}` },
          { text: 'Timeline' },
        ], 'companies/views/_deprecated/timeline')
      })

      context('when rendering for a company with a DUNS number', () => {
        beforeEach(async () => {
          nock(config.apiRoot)
            .get(`/v3/company/${dnbCompanyMock.id}/timeline?limit=10&offset=0`)
            .reply(200, timelineMock)

          this.middlewareParameters = buildMiddlewareParameters({
            company: dnbCompanyMock,
          })

          await renderTimeline(
            this.middlewareParameters.reqMock,
            this.middlewareParameters.resMock,
            this.middlewareParameters.nextSpy,
          )
        })

        commonTests([
          { text: dnbCompanyMock.name, href: `/companies/${dnbCompanyMock.id}` },
          { text: 'Timeline' },
        ], 'companies/views/timeline')
      })
    })

    context('when timeline api returns error', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .get(`/v3/company/${companyMock.id}/timeline?limit=10&offset=0`)
          .reply(500)

        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
        })

        await renderTimeline(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should call next with error', () => {
        expect(this.middlewareParameters.nextSpy).to.have.been.calledOnce
        expect(this.middlewareParameters.nextSpy.firstCall.args).to.have.length(1)
      })
    })
  })
})
