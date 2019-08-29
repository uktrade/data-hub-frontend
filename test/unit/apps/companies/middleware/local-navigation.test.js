const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')

const setCompaniesLocalNav = require('~/src/apps/companies/middleware/local-navigation')

describe('Companies local navigation', () => {
  const commonTests = (expectedItems) => {
    it('should have items', () => {
      expectedItems.forEach((label) => {
        const item = this.middlewareParameters.resMock.locals.localNavItems.find(item => item.label === label)
        expect(item, label).to.exist
      })
    })
  }

  context('default menu items', () => {
    beforeEach(() => {
      this.middlewareParameters = buildMiddlewareParameters({
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
          ],
        },
      })

      setCompaniesLocalNav(
        this.middlewareParameters.reqMock,
        this.middlewareParameters.resMock,
        this.middlewareParameters.nextSpy,
      )
    })

    commonTests([
      'Activity',
      'Company contacts',
      'Investment',
      'Export',
      'Orders',
    ])
  })

  context('when the company is on the One List', () => {
    beforeEach(() => {
      this.middlewareParameters = buildMiddlewareParameters({
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
          ],
        },
      })

      setCompaniesLocalNav(
        this.middlewareParameters.reqMock,
        this.middlewareParameters.resMock,
        this.middlewareParameters.nextSpy,
      )
    })

    commonTests([
      'Activity',
      'Company contacts',
      'Core team',
      'Investment',
      'Export',
      'Orders',
    ])
  })
})
