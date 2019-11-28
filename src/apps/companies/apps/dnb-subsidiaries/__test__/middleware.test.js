const buildMiddlewareParameters = require('../../../../../../test/unit/helpers/middleware-parameters-builder')
const { setSubsidiariesLocalNav } = require('../middleware')
const urls = require('../../../../../lib/urls')

const buildSubsidiaryMiddlewareParameters = ({
  reqMock = { baseUrl: '/companies/123/subsidiaries' },
  features = { 'companies-ultimate-hq': true },
  company = {
    id: '123',
    is_global_ultimate: true,
    headquarter_type: {
      name: 'ghq',
    },
  },
  CURRENT_PATH = urls.companies.dnbSubsidiaries.index('123'),
  permissions = ['company.view_company'],
}) => buildMiddlewareParameters({
  reqMock,
  features,
  company,
  CURRENT_PATH,
  user: {
    permissions,
  },
})

describe('Subsidiaries local navigation', () => {
  let middlewareParameters

  context('when a company is both Global HQ and Ultimate HQ and the flag is ON', () => {
    before(() => {
      middlewareParameters = buildSubsidiaryMiddlewareParameters({})

      setSubsidiariesLocalNav(
        middlewareParameters.reqMock,
        middlewareParameters.resMock,
        middlewareParameters.nextSpy,
      )
    })

    it('should render local nav with D&B hierarchy and manual subsidiaries tabs', () => {
      expect(middlewareParameters.resMock.locals.localNavItems).to.be.deep.equal([
        {
          'isActive': true,
          'label': 'Dun & Bradstreet hierarchy',
          'permissions': [
            'company.view_company',
          ],
          'url': urls.companies.dnbSubsidiaries.index('123'),
        },
        {
          'isActive': false,
          'label': 'Manually linked subsidiaries',
          'permissions': [
            'company.view_company',
          ],
          'url': urls.companies.subsidiaries.index('123'),
        },
      ])
    })
  })

  context('when the flag is OFF', () => {
    before(() => {
      middlewareParameters = buildSubsidiaryMiddlewareParameters({
        features: {},
      })

      setSubsidiariesLocalNav(
        middlewareParameters.reqMock,
        middlewareParameters.resMock,
        middlewareParameters.nextSpy,
      )
    })

    it('should not render tabs', () => {
      expect(middlewareParameters.resMock.locals.localNavItems).to.be.deep.equal([])
    })
  })

  context('when the company is Global HQ but not Ultimate HQ', () => {
    before(() => {
      middlewareParameters = buildSubsidiaryMiddlewareParameters({
        company: {
          is_global_ultimate: false,
          headquarter_type: {
            name: 'ghq',
          },
        },
      })

      setSubsidiariesLocalNav(
        middlewareParameters.reqMock,
        middlewareParameters.resMock,
        middlewareParameters.nextSpy,
      )
    })

    it('should not render tabs', () => {
      expect(middlewareParameters.resMock.locals.localNavItems).to.be.deep.equal([])
    })
  })

  context('when the company is Ultimate HQ but not Global HQ', () => {
    before(() => {
      middlewareParameters = buildSubsidiaryMiddlewareParameters({
        company: {
          is_global_ultimate: true,
          headquarter_type: {
            name: '',
          },
        },
      })

      setSubsidiariesLocalNav(
        middlewareParameters.reqMock,
        middlewareParameters.resMock,
        middlewareParameters.nextSpy,
      )
    })

    it('should not render tabs', () => {
      expect(middlewareParameters.resMock.locals.localNavItems).to.be.deep.equal([])
    })
  })
})
