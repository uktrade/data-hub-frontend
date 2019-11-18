const sinon = require('sinon')
const nock = require('nock')
const requestErrors = require('request-promise/errors')

const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')
const config = require('~/src/config')
const companyMock = require('~/test/unit/data/companies/companies-house.json')
const coreTeamMock = require('~/test/unit/data/companies/one-list-group-core-team.json')

const { renderAdvisers, renderAddAdviserForm, addAdviser } = require('~/src/apps/companies/controllers/advisers')

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
        expect(middlewareParameters.resMock.render.args[0][1].props.pageUrl).to.equal('/companies/15387806/advisers/add')
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

  describe('#renderAddAdviserForm', () => {
    it('Should do exactly what it does', () => {
      const res = {
        locals: {
          company: {
            id: 'foo',
            name: 'bar',
          },
          csrfToken: 'baz',
        },
        breadcrumb: sinon.stub().returnsThis(),
        render: sinon.stub(),
      }
      renderAddAdviserForm(undefined, res)
      expect(res.breadcrumb.args).to.deep.equal([
        ['bar', '/companies/foo'],
        ['Confirm you are the Lead ITA'],
      ])
      expect(res.render).to.be.calledWith(
        'companies/views/add-adviser.njk',
        {
          props: {
            csrfToken: 'baz',
          },
        },
      )
    })
  })

  describe('#addAdviser', () => {
    const fixture = status => {
      nock(config.apiRoot)
        .post('/v4/company/bar/self-assign-account-manager')
        .reply(status, {})

      return {
        req: {
          session: {
            token: 'foo',
          },
          flash: sinon.spy(),
        },
        res: {
          locals: {
            company: {
              id: 'bar',
            },
          },
          redirect: sinon.spy(),
        },
        next: sinon.spy(),
      }
    }

    it('Should show a flash message and redirect when the request is OK', async () => {
      const { req, res, next } = fixture(204)
      await addAdviser(req, res, next)
      expect(res.redirect)
        .to.have.been.calledOnceWith('/companies/bar/advisers')
      expect(req.flash).to.have.been.calledOnceWith(
        'success',
        'Lead adviser information updated',
      )
      expect(next).not.to.have.been.called
    })

    it('Should show propagate the error if the request is not OK', async () => {
      const { req, res, next } = fixture(500)
      await addAdviser(req, res, next)
      expect(res.redirect).not.to.have.been.called
      expect(req.flash).not.to.have.been.called
      expect(next).to.have.been.calledOnce
      expect(next.args[0][0]).to.be.instanceOf(requestErrors.StatusCodeError)
    })
  })
})
