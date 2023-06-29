const buildMiddlewareParameters = require('../../../../../../test/unit/helpers/middleware-parameters-builder')
const {
  setCompanyHierarchyLocalNav,
  setDnbHierarchyDetails,
} = require('../middleware')
const urls = require('../../../../../lib/urls')
const { mockGetDnbHierarchy } = require('./utils')

const DUNS_NUMBER = 999999

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

describe('#setDnbHierarchyDetails', async () => {
  context('when the company does have a DUNS number', async () => {
    mockGetDnbHierarchy({
      relatedCompaniesCount: 5,
      companyId: 1,
      limit: 1,
    })

    const middlewareParameters = buildSubsidiaryMiddlewareParameters({
      company: {
        id: 1,
        global_ultimate_duns_number: DUNS_NUMBER,
      },
    })

    await setDnbHierarchyDetails(
      middlewareParameters.reqMock,
      middlewareParameters.resMock,
      middlewareParameters.nextSpy
    )

    it('should set "globalUltimate"', async () => {
      expect(middlewareParameters.resMock.locals.globalUltimate).to.deep.equal({
        id: '1',
        is_global_ultimate: true,
        url: urls.companies.detail(1),
      })
    })

    it('should set "dnbHierarchyCount"', () => {
      expect(middlewareParameters.resMock.locals.dnbHierarchyCount).to.equal(5)
    })

    it('should set "dnbRelatedCompaniesCount"', () => {
      expect(
        middlewareParameters.resMock.locals.dnbRelatedCompaniesCount
      ).to.equal(5)
    })
  })

  context('when the company does not have a DUNS number', async () => {
    const middlewareParameters = buildSubsidiaryMiddlewareParameters({
      company: {
        duns_number: null,
      },
    })

    before(async () =>
      setDnbHierarchyDetails(
        middlewareParameters.reqMock,
        middlewareParameters.resMock,
        middlewareParameters.nextSpy
      )
    )

    it('should not set "globalUltimate"', async () => {
      expect(middlewareParameters.resMock.locals.globalUltimate).to.be.undefined
    })

    it('should not set "dnbHierarchyCount"', async () => {
      expect(middlewareParameters.resMock.locals.dnbHierarchyCount).to.equal(0)
    })

    it('should set "dnbRelatedCompaniesCount" equal to 0', async () => {
      expect(
        middlewareParameters.resMock.locals.dnbRelatedCompaniesCount
      ).to.equal(0)
    })
  })
})
