const buildMiddlewareParameters = require('../../../../../test/unit/helpers/middleware-parameters-builder')
const { setLocalNav } = require('../../../middleware')
const { LOCAL_NAV } = require('../../constants')

const localNavigation = setLocalNav(LOCAL_NAV)

let middlewareParameters

describe('Companies local navigation', () => {
  const commonTests = (expectedItems) => {
    it('should have items', () => {
      expectedItems.forEach((label) => {
        const item = middlewareParameters.resMock.locals.localNavItems.find(
          (item) => item.label === label
        )
        expect(item, label).to.exist
      })
    })
  }

  context('default menu items', () => {
    beforeEach(() => {
      middlewareParameters = buildMiddlewareParameters({
        company: {
          id: '1234',
          headquarter_type: null,
          company_number: null,
          duns_number: '123456',
        },
        user: {
          permissions: [
            'interaction.view_all_interaction',
            'company.view_contact',
            'investment.view_all_investmentproject',
            'order.view_order',
            'company.view_companyexportcountry',
          ],
        },
      })

      localNavigation(
        middlewareParameters.reqMock,
        middlewareParameters.resMock,
        middlewareParameters.nextSpy
      )
    })

    commonTests(['Activity', 'Contacts', 'Investment', 'Export', 'Orders'])
  })

  context('when the company is on the One List', () => {
    beforeEach(() => {
      middlewareParameters = buildMiddlewareParameters({
        company: {
          id: '1234',
          headquarter_type: null,
          company_number: null,
          duns_number: '123456',
          one_list_group_tier: {
            id: '4321',
            name: 'Tier A - Strategic Account',
          },
        },
        user: {
          permissions: [
            'interaction.view_all_interaction',
            'company.view_contact',
            'investment.view_all_investmentproject',
            'order.view_order',
            'company.view_companyexportcountry',
          ],
        },
      })

      localNavigation(
        middlewareParameters.reqMock,
        middlewareParameters.resMock,
        middlewareParameters.nextSpy
      )
    })

    commonTests([
      'Activity',
      'Contacts',
      'Account management',
      'Investment',
      'Export',
      'Orders',
    ])
  })

  context(
    'when the company is on the One List and is a Tier D - International Trade Adviser Accounts',
    () => {
      beforeEach(() => {
        middlewareParameters = buildMiddlewareParameters({
          company: {
            id: '1234',
            headquarter_type: null,
            company_number: null,
            duns_number: '123456',
            one_list_group_tier: {
              id: '1929c808-99b4-4abf-a891-45f2e187b410',
            },
          },
          user: {
            permissions: [
              'interaction.view_all_interaction',
              'company.view_contact',
              'investment.view_all_investmentproject',
              'order.view_order',
              'company.view_companyexportcountry',
            ],
          },
        })

        localNavigation(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })
      commonTests([
        'Activity',
        'Contacts',
        'Account management',
        'Investment',
        'Export',
        'Orders',
      ])
    }
  )
  context('when the company is not on the One List', () => {
    beforeEach(() => {
      middlewareParameters = buildMiddlewareParameters({
        company: {
          id: '1234',
          headquarter_type: null,
          company_number: null,
          duns_number: '123456',
          one_list_group_tier: null,
        },
        user: {
          permissions: [
            'interaction.view_all_interaction',
            'company.view_contact',
            'investment.view_all_investmentproject',
            'order.view_order',
            'company.view_companyexportcountry',
          ],
        },
      })

      localNavigation(
        middlewareParameters.reqMock,
        middlewareParameters.resMock,
        middlewareParameters.nextSpy
      )
    })
    commonTests([
      'Activity',
      'Contacts',
      'Account management',
      'Investment',
      'Export',
      'Orders',
    ])
  })
})
