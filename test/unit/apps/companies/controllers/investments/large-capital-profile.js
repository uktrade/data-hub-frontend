const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')

const noCompanyProfile = require('~/test/unit/data/companies/investments/large-capital-profile-empty.json')
const companyProfile = require('~/test/unit/data/companies/investments/large-capital-profile.json')
const companyMock = require('~/test/unit/data/companies/minimal-company.json')
const dnbCompanyMock = require('~/test/unit/data/companies/dnb-company.json')
const config = require('~/config')

const controller = require('~/src/apps/companies/apps/investments/large-capital-profile/controllers')

describe('Company Investments - large capital profile', () => {
  describe('#renderInvestmentsLargeCapitalProfile', () => {
    const commonTests = (view, company, companyProfile) => {
      it('should call the render function once', () => {
        expect(this.middlewareParameters.resMock.render).to.have.been.calledOnce
      })

      it('should call the render function and pass the view', () => {
        expect(this.middlewareParameters.resMock.render.args[0][0]).to.equal(view)
      })

      it('should call the render function and pass the company', () => {
        expect(this.middlewareParameters.resMock.render.args[0][1].company).to.deep.equal(company)
      })

      it('should call the render function and pass the company profile', () => {
        expect(this.middlewareParameters.resMock.render.args[0][1].companyProfile).to.deep.equal(companyProfile)
      })
    }

    context('when the company does not have a DUNS number or a company profile', () => {
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

      commonTests('companies/apps/investments/large-capital-profile/views/list-deprecated', companyMock, undefined)
    })

    context('when the company has a DUNS number and a company profile', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .get(`/v4/large-investor-profile?investor_company_id=${dnbCompanyMock.id}`)
          .reply(200, companyProfile)

        this.middlewareParameters = buildMiddlewareParameters({
          company: dnbCompanyMock,
        })

        await controller.renderLargeCapitalProfile(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      commonTests('companies/apps/investments/large-capital-profile/views/list', dnbCompanyMock, companyProfile.results[0])
    })

    context('when the company does not have a DUNS number and the companies new layout feature is enabled', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .get(`/v4/large-investor-profile?investor_company_id=${companyMock.id}`)
          .reply(200, companyProfile)

        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
          features: {
            'companies-new-layout': true,
          },
        })

        await controller.renderLargeCapitalProfile(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      commonTests('companies/apps/investments/large-capital-profile/views/list', companyMock, companyProfile.results[0])
    })
  })
})
