const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')

const config = require('~/src/config')
const companyMock = require('~/test/unit/data/companies/companies-house.json')
const coreTeamMock = require('~/test/unit/data/companies/one-list-group-core-team.json')

const { renderAdvisers } = require('~/src/apps/companies/controllers/advisers')

describe('Company contact list controller', () => {
  describe('#renderAdvisers', () => {
    beforeEach(async () => {
      this.middlewareParameters = buildMiddlewareParameters({
        company: companyMock,
      })

      nock(config.apiRoot)
        .get(`/v4/company/${companyMock.id}/one-list-group-core-team`)
        .reply(200, coreTeamMock)

      await renderAdvisers(
        this.middlewareParameters.reqMock,
        this.middlewareParameters.resMock,
        this.middlewareParameters.nextSpy,
      )
    })

    it('should add two breadcrumbs', () => {
      expect(this.middlewareParameters.resMock.breadcrumb).to.have.been.calledTwice
    })

    it('should add the company breadcrumb', () => {
      expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledWith(companyMock.name, `/companies/${companyMock.id}`)
    })

    it('should add the Advisers breadcrumb', () => {
      expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledWith('Advisers')
    })

    it('should render the correct template', () => {
      expect(this.middlewareParameters.resMock.render).to.be.calledWith('companies/views/advisers')
    })

    it('should set the company name', () => {
      expect(this.middlewareParameters.resMock.render.args[0][1].companyName).to.equal('Mercury Trading Ltd')
    })

    it('should set the core team', () => {
      expect(this.middlewareParameters.resMock.render.args[0][1].coreTeam).to.not.be.null
    })

    it('should not call next', () => {
      expect(this.middlewareParameters.nextSpy).to.not.be.called
    })
  })
})
