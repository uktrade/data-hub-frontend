const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')

const noCompanyProfile = require('~/test/unit/data/companies/investments/large-capital-profile-empty.json')
const companyProfile = require('~/test/unit/data/companies/investments/large-capital-profile.json')
const companyMock = require('~/test/unit/data/companies/minimal-company.json')
const config = require('~/config')

const controller = require('~/src/apps/companies/apps/investments/large-capital-profile/controllers')

describe('Company Investments - large capital profile', () => {
  describe('#renderInvestmentsLargeCapitalProfile', () => {
    const commonTests = (companyProfile) => {
      it('should call the render function once', () => {
        expect(this.middlewareParameters.resMock.render).to.have.been.calledOnce
      })

      it('should call the render function and pass the view', () => {
        expect(this.middlewareParameters.resMock.render.args[0][0]).to.equal('companies/apps/investments/large-capital-profile/views/list')
      })

      it('should call the render function and pass the company', () => {
        expect(this.middlewareParameters.resMock.render.args[0][1].company).to.deep.equal(companyMock)
      })

      it('should call the render function and pass the company profile', () => {
        expect(this.middlewareParameters.resMock.render.args[0][1].companyProfile).to.deep.equal(companyProfile)
      })
    }

    context('when the company does not have a company profile', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .get(`/v4/large-investor-profile?investor_company_id=${companyMock.id}`)
          .reply(200, noCompanyProfile)

        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
        })

        await controller.renderLargeCapitalProfile(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      commonTests(undefined)
    })

    context('when the company has a company profile', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .get(`/v4/large-investor-profile?investor_company_id=${companyMock.id}`)
          .reply(200, companyProfile)

        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
        })

        await controller.renderLargeCapitalProfile(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      commonTests(companyProfile.results[0])
    })
  })
})
