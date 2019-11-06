const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')

const config = require('~/src/config')
const companyMock = require('~/test/unit/data/companies/companies-house.json')
const coreTeamMock = require('~/test/unit/data/companies/one-list-group-core-team.json')

const { renderAdvisers } = require('~/src/apps/companies/controllers/advisers')

let middlewareParameters

describe('Company contact list controller', () => {
  describe('#renderAdvisers', () => {
    context('When the company is a One List Tier D International Adviser Trade Accounts and the user has permission to add themselves as the lead ITA', () => {
      beforeEach(async () => {
        middlewareParameters = buildMiddlewareParameters({
          company: {
            ...companyMock,
            one_list_group_tier: {
              id: '1929c808-99b4-4abf-a891-45f2e187b410',
            },
          },
          user: {
            permissions: ['company.change_regional_account_manager'],
          },
          features: {
            lead_advisers: true,
          },
        })

        await renderAdvisers(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy,
        )
      })
      it('should add two breadcrumbs', () => {
        expect(middlewareParameters.resMock.breadcrumb).to.have.been.calledTwice
      })
      it('should add the company breadcrumb', () => {
        expect(middlewareParameters.resMock.breadcrumb).to.be.calledWith(companyMock.name, `/companies/${companyMock.id}`)
      })
      it('should add the Lead Advisers breadcrumb', () => {
        expect(middlewareParameters.resMock.breadcrumb).to.be.calledWith('Lead Advisers')
      })
      it('should render the correct template', () => {
        expect(middlewareParameters.resMock.render).to.be.calledWith('companies/views/lead-advisers')
      })
      it('should set the company name', () => {
        expect(middlewareParameters.resMock.render.args[0][1].props.company).to.equal('Mercury Trading Ltd')
      })
      it('should set the button link for the next page', () => {
        expect(middlewareParameters.resMock.render.args[0][1].props.pageUrl).to.equal('/companies/15387806/advisers/confirm')
      })
      it('should set the permission flag', () => {
        expect(middlewareParameters.resMock.render.args[0][1].props.hasPermission).to.equal(true)
      })
      it('should set the isItaTierDAccount flag', () => {
        expect(middlewareParameters.resMock.render.args[0][1].props.isItaTierDAccount).to.equal(true)
      })
    })
    context('When the company is a One List Tier D International Adviser Trade Accounts and the user has not got permission to add themselves as the lead ITA', () => {
      beforeEach(async () => {
        middlewareParameters = buildMiddlewareParameters({
          company: {
            ...companyMock,
            one_list_group_tier: {
              id: '1929c808-99b4-4abf-a891-45f2e187b410',
            },
          },
          user: {
            permissions: [],
          },
          features: {
            lead_advisers: true,
          },
        })

        await renderAdvisers(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy,
        )
      })
      it('should set the permission to true', () => {
        expect(middlewareParameters.resMock.render.args[0][1].props.hasPermission).to.equal(false)
      })
    })
    context('When the company is not a One List Tier D International Adviser Trade Accounts', () => {
      beforeEach(async () => {
        middlewareParameters = buildMiddlewareParameters({
          company: {
            ...companyMock,
          },
        })

        nock(config.apiRoot)
          .get(`/v4/company/${companyMock.id}/one-list-group-core-team`)
          .reply(200, coreTeamMock)

        await renderAdvisers(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy,
        )
      })

      it('should add two breadcrumbs', () => {
        expect(middlewareParameters.resMock.breadcrumb).to.have.been.calledTwice
      })

      it('should add the company breadcrumb', () => {
        expect(middlewareParameters.resMock.breadcrumb).to.be.calledWith(companyMock.name, `/companies/${companyMock.id}`)
      })

      it('should add the Advisers breadcrumb', () => {
        expect(middlewareParameters.resMock.breadcrumb).to.be.calledWith('Advisers')
      })

      it('should render the correct template', () => {
        expect(middlewareParameters.resMock.render).to.be.calledWith('companies/views/advisers')
      })

      it('should set the company name', () => {
        expect(middlewareParameters.resMock.render.args[0][1].companyName).to.equal('Mercury Trading Ltd')
      })

      it('should set the core team', () => {
        expect(middlewareParameters.resMock.render.args[0][1].coreTeam).to.not.be.null
      })

      it('should not call next', () => {
        expect(middlewareParameters.nextSpy).to.not.be.called
      })
    })
  })
})
