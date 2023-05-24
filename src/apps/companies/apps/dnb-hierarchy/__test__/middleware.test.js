const buildMiddlewareParameters = require('../../../../../../test/unit/helpers/middleware-parameters-builder')
const { setCompanyHierarchyLocalNav } = require('../middleware')
const urls = require('../../../../../lib/urls')

const buildSubsidiaryMiddlewareParameters = ({
  reqMock = { baseUrl: urls.companies.subsidiaries.index('123') },
  company = {
    isUltimate: true,
    isGlobalHQ: true,
    id: '123',
  },
  CURRENT_PATH = urls.companies.dnbHierarchy.index('123'),
  permissions = ['company.view_company'],
}) =>
  buildMiddlewareParameters({
    reqMock,
    company,
    CURRENT_PATH,
    user: {
      permissions,
    },
  })

describe('D&B Hierarchy middleware', () => {
  describe('#setCompanyHierarchyLocalNav', () => {
    context(
      'when a company is both Global HQ and Ultimate HQ and the flag is ON',
      () => {
        const middlewareParameters = buildSubsidiaryMiddlewareParameters({})

        setCompanyHierarchyLocalNav(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )

        it('should render local nav with D&B hierarchy and manual subsidiaries tabs', () => {
          expect(
            middlewareParameters.resMock.locals.localNavItems
          ).to.be.deep.equal([
            {
              isActive: true,
              label: 'Dun & Bradstreet hierarchy',
              permissions: ['company.view_company'],
              url: urls.companies.dnbHierarchy.index('123'),
            },
            {
              isActive: false,
              label: 'Manually linked subsidiaries',
              permissions: ['company.view_company'],
              url: urls.companies.subsidiaries.index('123'),
            },
          ])
        })
      }
    )

    context('when the company is Global HQ but not Ultimate HQ', () => {
      const middlewareParameters = buildSubsidiaryMiddlewareParameters({
        company: {
          isGlobalHQ: true,
          isUltimate: false,
        },
      })

      setCompanyHierarchyLocalNav(
        middlewareParameters.reqMock,
        middlewareParameters.resMock,
        middlewareParameters.nextSpy
      )

      it('should not render tabs', () => {
        expect(
          middlewareParameters.resMock.locals.localNavItems
        ).to.be.deep.equal([])
      })
    })

    context('when the company is Ultimate HQ but not Global HQ', () => {
      const middlewareParameters = buildSubsidiaryMiddlewareParameters({
        company: {
          isGlobalHQ: false,
          isUltimate: true,
        },
      })

      setCompanyHierarchyLocalNav(
        middlewareParameters.reqMock,
        middlewareParameters.resMock,
        middlewareParameters.nextSpy
      )

      it('should not render tabs', () => {
        expect(
          middlewareParameters.resMock.locals.localNavItems
        ).to.be.deep.equal([])
      })
    })
  })
})
