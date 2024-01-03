const buildMiddlewareParameters = require('../../../../../test/unit/helpers/middleware-parameters-builder')
const companyMock = require('../../../../../test/unit/data/companies/company-v4.json')
const urls = require('../../../../lib/urls')
const { renderDetails } = require('../details')

describe('Companies details controller', () => {
  describe('#renderDetails', () => {
    context('when query string params are included', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          reqMock: { protocol: 'http', get: () => 'localhost' },
          requestQuery: { param1: 'a', param2: 'b' },
          company: companyMock,
        })

        await renderDetails(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy
        )
      })
      it('should permanently redirect to interactions with query string params', () => {
        expect(
          this.middlewareParameters.resMock.redirect
        ).to.have.been.calledWith(
          301,
          sinon.match({
            pathname: urls.companies.interactions.index(companyMock.id),
            search: '?param1=a&param2=b',
          })
        )
        expect(this.middlewareParameters.resMock.redirect).to.have.been
          .calledOnce
      })
    })

    context('when query string params do not exist', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          reqMock: { protocol: 'http', get: () => 'localhost' },
          company: companyMock,
        })

        await renderDetails(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy
        )
      })

      it('should permanently redirect to interactions without query string params', () => {
        expect(
          this.middlewareParameters.resMock.redirect
        ).to.have.been.calledWith(
          301,
          sinon.match({
            pathname: urls.companies.interactions.index(companyMock.id),
            search: '',
          })
        )
        expect(this.middlewareParameters.resMock.redirect).to.have.been
          .calledOnce
      })

      it('should not render a template', () => {
        expect(this.middlewareParameters.resMock.render).to.not.be.called
      })
    })
  })
})
