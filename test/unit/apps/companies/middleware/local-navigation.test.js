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

  context('when the company has a DUNS number', () => {
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
              'company.view_company_timeline',
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
        'Interactions',
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
              'company.view_company_timeline',
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
        'Interactions',
        'Company contacts',
        'Core team',
        'Investment',
        'Export',
        'Orders',
      ])
    })
  })

  context('when the companies new layout flag is enabled', () => {
    context('default menu items', () => {
      beforeEach(() => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: {
            id: '1234',
            headquarter_type: null,
            company_number: null,
          },
          user: {
            permissions: [
              'company.view_company_timeline',
              'interaction.view_all_interaction',
              'company.view_contact',
              'investment.view_all_investmentproject',
              'order.view_order',
            ],
          },
          features: {
            'companies-new-layout': true,
          },
        })

        setCompaniesLocalNav(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      commonTests([
        'Interactions',
        'Company contacts',
        'Investment',
        'Export',
        'Orders',
      ])
    })
  })

  context('when the company does not have a DUNS number', () => {
    context('default menu items', () => {
      beforeEach(() => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: {
            id: '1234',
            headquarter_type: null,
            company_number: null,
          },
          user: {
            permissions: ['company.view_company_timeline'],
          },
        })

        setCompaniesLocalNav(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      commonTests([
        'Details',
        'Export',
        'Audit history',
      ])
    })

    context('when company is a global headquarters', () => {
      beforeEach(() => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: {
            id: '1234',
            headquarter_type: {
              id: '2222',
              name: 'ghq',
            },
            company_number: null,
          },
          user: {
            permissions: ['company.view_company_timeline'],
          },
        })

        setCompaniesLocalNav(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      commonTests([
        'Subsidiaries',
        'Details',
        'Export',
        'Audit history',
      ])
    })

    context('when company is a European headquarters', () => {
      beforeEach(() => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: {
            id: '1234',
            headquarter_type: {
              id: '2222',
              name: 'ehq',
            },
            company_number: null,
          },
          user: {
            permissions: ['company.view_company_timeline'],
          },
        })

        setCompaniesLocalNav(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      commonTests([
        'Details',
        'Export',
        'Audit history',
      ])
    })

    context('when company has a company number', () => {
      beforeEach(() => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: {
            id: '1234',
            headquarter_type: null,
            company_number: '1234',
          },
          user: {
            permissions: ['company.view_company_timeline'],
          },
        })

        setCompaniesLocalNav(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      commonTests([
        'Details',
        'Export',
        'Timeline',
        'Audit history',
      ])
    })

    context('when the company is on the One List', () => {
      beforeEach(() => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: {
            id: '1234',
            headquarter_type: null,
            company_number: null,
            one_list_group_tier: {
              id: '4321',
              name: 'Tier A - Strategic Account',
            },
          },
          user: {
            permissions: ['company.view_company_timeline'],
          },
        })

        setCompaniesLocalNav(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      commonTests([
        'Details',
        'Export',
        'Audit history',
        'Advisers',
      ])
    })
  })
})
