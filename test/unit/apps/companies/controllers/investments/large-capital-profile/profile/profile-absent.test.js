const absentCompanyProfile = require('test/unit/data/companies/investments/large-capital-profile-absent.json')
const companyMock = require('test/unit/data/companies/minimal-company.json')
const config = require('config')

const buildMiddlewareParameters = require('test/unit/helpers/middleware-parameters-builder.js')
const controller = require('src/apps/companies/apps/investments/large-capital-profile/controllers')

describe('Company Investments - Large capital profile', () => {
  describe('renderProfile', () => {
    context('when the company does not have a profile', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .get(`/v4/large-investor-profile?investor_company_id=${companyMock.id}`)
          .reply(200, absentCompanyProfile)

        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
        })

        await controller.renderProfile(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should call the render function once', () => {
        expect(this.middlewareParameters.resMock.render).to.have.been.calledOnce
      })

      it('should call the render function and pass the view', () => {
        const view = 'companies/apps/investments/large-capital-profile/views/profile'
        expect(this.middlewareParameters.resMock.render.args[0][0]).to.equal(view)
      })

      it('should call the render function and pass the profile', () => {
        expect(this.middlewareParameters.resMock.render.args[0][1].profile).to.deep.equal(undefined)
      })
    })
  })
})
