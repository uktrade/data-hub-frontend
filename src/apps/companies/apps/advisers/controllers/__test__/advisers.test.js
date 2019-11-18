const buildMiddlewareParameters = require('../../../../../../../test/unit/helpers/middleware-parameters-builder.js')
const config = require('../../../../../../config')
const companyMock = require('../../../../../../../test/unit/data/companies/companies-house.json')
const coreTeamMock = require('../../../../../../../test/unit/data/companies/one-list-group-core-team.json')

const { renderAdvisers } = require('../advisers')
const { companies } = require('../../../../../../lib/urls')

let middlewareParameters

describe('Company adviser list controller', () => {
  describe('#renderAdvisers', () => {
    describe('#renderLeadAdvisers', () => {
      context('When the company is a One List Tier D International Adviser Trade Accounts and the user has permission to add themselves as the lead ITA', () => {
        before(async () => {
          middlewareParameters = buildMiddlewareParameters({
            company: {
              ...companyMock,
              one_list_group_tier: {
                id: '1929c808-99b4-4abf-a891-45f2e187b410',
              },
              one_list_group_global_account_manager: null,
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
          expect(middlewareParameters.resMock.breadcrumb).to.be.calledWith(companyMock.name, `${companies.index()}/${companyMock.id}`)
        })
        it('should add the Lead Advisers breadcrumb', () => {
          expect(middlewareParameters.resMock.breadcrumb).to.be.calledWith('Lead adviser')
        })
        it('should render the correct template', () => {
          expect(middlewareParameters.resMock.render).to.be.calledWith('companies/views/lead-advisers')
        })
        it('should set the account manager flag', () => {
          expect(middlewareParameters.resMock.render.args[0][1].props.hasAccountManager).to.equal(false)
        })
        it('should set the name to null', () => {
          expect(middlewareParameters.resMock.render.args[0][1].props.name).to.equal(null)
        })
        it('should set the team to null', () => {
          expect(middlewareParameters.resMock.render.args[0][1].props.team).to.equal(null)
        })
        it('should set the email to null', () => {
          expect(middlewareParameters.resMock.render.args[0][1].props.email).to.equal(null)
        })
        it('should set the company name', () => {
          expect(middlewareParameters.resMock.render.args[0][1].props.companyName).to.equal('Mercury Trading Ltd')
        })
        it('should set the company id', () => {
          expect(middlewareParameters.resMock.render.args[0][1].props.companyId).to.equal(15387806)
        })
        it('should set a link to confirm the account manager', () => {
          expect(middlewareParameters.resMock.render.args[0][1].props.confirmUrl).to.equal(`${companies.advisers.confirm('15387806')}`)
        })
        it('should set a link to replace the account manager', () => {
          expect(middlewareParameters.resMock.render.args[0][1].props.replaceUrl).to.equal(`${companies.advisers.replace('15387806')}`)
        })
        it('should set the permission flag', () => {
          expect(middlewareParameters.resMock.render.args[0][1].props.hasPermissionToAddIta).to.equal(true)
        })
      })
      context('When the company is a One List Tier D International Adviser Trade Accounts and the user has not got permission to add themselves as the lead ITA', () => {
        before(async () => {
          middlewareParameters = buildMiddlewareParameters({
            company: {
              ...companyMock,
              one_list_group_tier: {
                id: '1929c808-99b4-4abf-a891-45f2e187b410',
              },
              one_list_group_global_account_manager: null,
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
        it('should set the permission flag', () => {
          expect(middlewareParameters.resMock.render.args[0][1].props.hasPermissionToAddIta).to.equal(false)
        })
      })
      context('When the company is a One List Tier D International Adviser Trade Accounts and has an allocated Account Manager', () => {
        before(async () => {
          middlewareParameters = buildMiddlewareParameters({
            company: {
              ...companyMock,
              one_list_group_tier: {
                id: '1929c808-99b4-4abf-a891-45f2e187b410',
              },
              one_list_group_global_account_manager: {
                name: 'Travis Greene',
                contact_email: 'travis@travis.com',
                dit_team: {
                  name: 'DIT Team',
                },
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
        it('should set the name', () => {
          expect(middlewareParameters.resMock.render.args[0][1].props.name).to.equal('Travis Greene')
        })
        it('should set the email', () => {
          expect(middlewareParameters.resMock.render.args[0][1].props.email).to.equal('travis@travis.com')
        })
        it('should set the team name', () => {
          expect(middlewareParameters.resMock.render.args[0][1].props.team).to.equal('DIT Team')
        })
      })
    })
    describe('#renderCoreTeamAdvisers', () => {
      context('When the company is in the One List A - D (not D - International Adviser Trade Accounts)', () => {
        before(async () => {
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
          expect(middlewareParameters.resMock.breadcrumb).to.be.calledWith(companyMock.name, `${companies.detail(companyMock.id)}`)
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
})
