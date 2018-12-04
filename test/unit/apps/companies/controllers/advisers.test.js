const { assign } = require('lodash')

const config = require('~/config')
const companyMock = require('~/test/unit/data/companies/companies-house.json')
const coreTeamMock = require('~/test/unit/data/companies/one-list-group-core-team.json')

describe('Company contact list controller', () => {
  beforeEach(() => {
    this.reqMock = assign({}, globalReq, {
      session: {
        token: 'abcd',
      },
    })
    this.resMock = assign({}, globalRes, {
      locals: {
        company: companyMock,
        features: {},
      },
      breadcrumb: sinon.stub().returnsThis(),
      render: sinon.spy(),
      query: {},
    })
    this.nextSpy = sinon.spy()

    this.controller = require('~/src/apps/companies/controllers/advisers')
  })

  describe('#renderAdvisers', () => {
    context('when the feature flag is enabled', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .get(`/v3/company/${companyMock.id}/one-list-group-core-team`)
          .reply(200, coreTeamMock)

        this.resMock.locals.features['companies-advisers'] = true

        await this.controller.renderAdvisers(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should add two breadcrumbs', () => {
        expect(this.resMock.breadcrumb).to.have.been.calledTwice
      })

      it('should add the company breadcrumb', () => {
        expect(this.resMock.breadcrumb).to.be.calledWith('Mercury Trading Ltd', '/companies/15387806')
      })

      it('should add the Advisers breadcrumb', () => {
        expect(this.resMock.breadcrumb).to.be.calledWith('Advisers')
      })

      it('should render the correct template', () => {
        expect(this.resMock.render).to.be.calledWith('companies/views/advisers')
      })

      it('should set the company name', () => {
        expect(this.resMock.render.args[0][1].companyName).to.equal('Mercury Trading Ltd')
      })

      it('should set the core team', () => {
        expect(this.resMock.render.args[0][1].coreTeam).to.not.be.null
      })

      it('should not call next', () => {
        expect(this.nextSpy).to.not.be.called
      })
    })

    context('when the feature flag is not enabled', () => {
      beforeEach(() => {
        this.controller.renderAdvisers(this.reqMock, this.resMock, this.nextSpy)
      })

      it('should not add breadcrumbs', () => {
        expect(this.resMock.breadcrumb).to.not.be.called
      })

      it('should not render the template', () => {
        expect(this.resMock.render).to.not.be.called
      })

      it('should call next with an error', () => {
        expect(this.nextSpy).to.have.been.calledOnce
        expect(this.nextSpy).to.be.calledWith(sinon.match.instanceOf(Error).and(sinon.match.has('message', 'Not Found')))
      })
    })
  })
})
