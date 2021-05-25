const { forEach, isString } = require('lodash')

const buildMiddlewareParameters = require('../../../../../test/unit/helpers/middleware-parameters-builder')

const config = require('../../../../config')
const { renderSubsidiaries } = require('../subsidiaries')

const companyMock = require('../../../../../test/unit/data/companies/companies-house-company.json')
const subsidiariesMock = require('../../../../../test/unit/data/companies/subsidiaries.json')

describe('company subsidiaries controller', () => {
  const commonTests = ({
    expectedBreadcrumbs,
    expectedTemplate,
    expectedHeading,
    expectedCount,
  }) => {
    it(`should add ${expectedBreadcrumbs.length} breadcrumbs`, () => {
      expect(this.middlewareParameters.resMock.breadcrumb).to.be.callCount(
        expectedBreadcrumbs.length
      )
    })

    it('should add breadcrumbs', () => {
      const breadcrumbSpy = this.middlewareParameters.resMock.breadcrumb
      forEach(expectedBreadcrumbs, (expectedBreadcrumb) => {
        if (isString(expectedBreadcrumb)) {
          expect(breadcrumbSpy).to.be.calledWith(expectedBreadcrumb)
        } else {
          expect(breadcrumbSpy).to.be.calledWith(
            expectedBreadcrumb.name,
            expectedBreadcrumb.url
          )
        }
      })
    })

    it('should render the correct template', () => {
      const templateName =
        this.middlewareParameters.resMock.render.firstCall.args[0]
      expect(templateName).to.equal(expectedTemplate)
    })

    it('should set the heading', () => {
      const actual =
        this.middlewareParameters.resMock.render.firstCall.args[1].heading
      expect(actual).to.equal(expectedHeading)
    })

    it('should return the subsidiaries as a collection', () => {
      expect(this.subsidiaries).to.have.property('items')
      expect(this.subsidiaries).to.have.property('count', expectedCount)
    })
  }

  context('when there are subsidiaries to list', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get(
          `/v4/company?limit=10&offset=0&sortby=name&global_headquarters_id=${companyMock.id}`
        )
        .reply(200, subsidiariesMock)

      this.middlewareParameters = buildMiddlewareParameters({
        company: companyMock,
      })

      await renderSubsidiaries(
        this.middlewareParameters.reqMock,
        this.middlewareParameters.resMock,
        this.middlewareParameters.nextSpy
      )

      this.subsidiaries =
        this.middlewareParameters.resMock.render.firstCall.args[1].subsidiaries
    })

    commonTests({
      expectedBreadcrumbs: [
        {
          name: 'SAMSUNG BIOEPIS UK LIMITED',
          url: `/companies/${companyMock.id}`,
        },
        {
          name: 'Business details',
          url: `/companies/${companyMock.id}/business-details`,
        },
        'Subsidiaries',
      ],
      expectedTemplate: 'companies/views/subsidiaries',
      expectedHeading: 'Subsidiaries of SAMSUNG BIOEPIS UK LIMITED',
      expectedCount: 1,
    })

    it('should include a button to link a new subsidiary', () => {
      expect(this.subsidiaries.actionButtons).to.deep.equal([
        {
          label: 'Link a subsidiary',
          url: '/companies/72fda78f-bdc3-44dc-9c22-c8ac82f7bda4/subsidiaries/link',
        },
      ])
    })
  })

  context('when the company is archived', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get(
          `/v4/company?limit=10&offset=0&sortby=name&global_headquarters_id=${companyMock.id}`
        )
        .reply(200, subsidiariesMock)

      this.middlewareParameters = buildMiddlewareParameters({
        company: {
          ...companyMock,
          archived: true,
        },
      })

      await renderSubsidiaries(
        this.middlewareParameters.reqMock,
        this.middlewareParameters.resMock,
        this.middlewareParameters.nextSpy
      )

      this.subsidiaries =
        this.middlewareParameters.resMock.render.firstCall.args[1].subsidiaries
    })

    commonTests({
      expectedBreadcrumbs: [
        {
          name: 'SAMSUNG BIOEPIS UK LIMITED',
          url: `/companies/${companyMock.id}`,
        },
        {
          name: 'Business details',
          url: `/companies/${companyMock.id}/business-details`,
        },
        'Subsidiaries',
      ],
      expectedTemplate: 'companies/views/subsidiaries',
      expectedHeading: 'Subsidiaries of SAMSUNG BIOEPIS UK LIMITED',
      expectedCount: 1,
    })

    it('should not set actions buttons', () => {
      const props = this.middlewareParameters.resMock.render.args[0][1]

      expect(props.actionButtons).to.be.undefined
    })
  })

  context('when there are no subsidiaries', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get(
          `/v4/company?limit=10&offset=0&sortby=name&global_headquarters_id=${companyMock.id}`
        )
        .reply(200, {
          count: 0,
          next: null,
          previous: null,
          results: [],
        })

      this.middlewareParameters = buildMiddlewareParameters({
        company: companyMock,
      })

      await renderSubsidiaries(
        this.middlewareParameters.reqMock,
        this.middlewareParameters.resMock,
        this.middlewareParameters.nextSpy
      )

      this.subsidiaries =
        this.middlewareParameters.resMock.render.firstCall.args[1].subsidiaries
    })

    commonTests({
      expectedBreadcrumbs: [
        {
          name: 'SAMSUNG BIOEPIS UK LIMITED',
          url: `/companies/${companyMock.id}`,
        },
        {
          name: 'Business details',
          url: `/companies/${companyMock.id}/business-details`,
        },
        'Subsidiaries',
      ],
      expectedTemplate: 'companies/views/subsidiaries',
      expectedHeading: 'Subsidiaries of SAMSUNG BIOEPIS UK LIMITED',
      expectedCount: 0,
    })

    it('should include a button to link a new subsidiary', () => {
      expect(this.subsidiaries.actionButtons).to.deep.equal([
        {
          label: 'Link a subsidiary',
          url: '/companies/72fda78f-bdc3-44dc-9c22-c8ac82f7bda4/subsidiaries/link',
        },
      ])
    })
  })
})
