const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')

const config = require('~/config')
const { renderSubsidiaries } = require('~/src/apps/companies/controllers/subsidiaries')

const companyMock = require('~/test/unit/data/companies/companies-house-company.json')
const dnbCompanyMock = require('~/test/unit/data/companies/dnb-company.json')
const subsidiariesMock = require('~/test/unit/data/companies/subsidiaries.json')

describe('company subsidiaries controller', () => {
  const commonTests = ({ expectedBreadcrumb, expectedTemplate, expectedHeading, expectedCount }) => {
    it('should add two breadcrumbs', () => {
      expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledTwice
    })

    it('should add a company breadcrumb', () => {
      const breadcrumbSpy = this.middlewareParameters.resMock.breadcrumb
      expect(breadcrumbSpy).to.be.calledWith(expectedBreadcrumb)
    })

    it('should add a "Subsidiaries" breadcrumb', () => {
      const breadcrumbSpy = this.middlewareParameters.resMock.breadcrumb
      expect(breadcrumbSpy).to.be.calledWith('Subsidiaries')
    })

    it('should render the correct template', () => {
      const templateName = this.middlewareParameters.resMock.render.firstCall.args[0]
      expect(templateName).to.equal(expectedTemplate)
    })

    it('should set the heading', () => {
      const actual = this.middlewareParameters.resMock.render.firstCall.args[1].heading
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
        .get(`/v3/company?limit=10&offset=0&sortby=name&global_headquarters_id=${companyMock.id}`)
        .reply(200, subsidiariesMock)

      this.middlewareParameters = buildMiddlewareParameters({
        company: companyMock,
      })

      await renderSubsidiaries(
        this.middlewareParameters.reqMock,
        this.middlewareParameters.resMock,
        this.middlewareParameters.nextSpy,
      )

      this.subsidiaries = this.middlewareParameters.resMock.render.firstCall.args[1].subsidiaries
    })

    commonTests({
      expectedBreadcrumb: 'SAMSUNG BIOEPIS UK LIMITED',
      expectedTemplate: 'companies/views/_deprecated/subsidiaries',
      expectedHeading: 'Subsidiaries of SAMSUNG BIOEPIS UK LIMITED',
      expectedCount: 1,
    })

    it('should include a button to link a new subsidiary', () => {
      expect(this.subsidiaries.actionButtons).to.deep.equal([{
        label: 'Link a subsidiary',
        url: '/companies/72fda78f-bdc3-44dc-9c22-c8ac82f7bda4/subsidiaries/link',
      }])
    })
  })

  context('when the company is archived', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get(`/v3/company?limit=10&offset=0&sortby=name&global_headquarters_id=${companyMock.id}`)
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
        this.middlewareParameters.nextSpy,
      )

      this.subsidiaries = this.middlewareParameters.resMock.render.firstCall.args[1].subsidiaries
    })

    commonTests({
      expectedBreadcrumb: 'SAMSUNG BIOEPIS UK LIMITED',
      expectedTemplate: 'companies/views/_deprecated/subsidiaries',
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
        .get(`/v3/company?limit=10&offset=0&sortby=name&global_headquarters_id=${companyMock.id}`)
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
        this.middlewareParameters.nextSpy,
      )

      this.subsidiaries = this.middlewareParameters.resMock.render.firstCall.args[1].subsidiaries
    })

    commonTests({
      expectedBreadcrumb: 'SAMSUNG BIOEPIS UK LIMITED',
      expectedTemplate: 'companies/views/_deprecated/subsidiaries',
      expectedHeading: 'Subsidiaries of SAMSUNG BIOEPIS UK LIMITED',
      expectedCount: 0,
    })

    it('should include a button to link a new subsidiary', () => {
      expect(this.subsidiaries.actionButtons).to.deep.equal([{
        label: 'Link a subsidiary',
        url: '/companies/72fda78f-bdc3-44dc-9c22-c8ac82f7bda4/subsidiaries/link',
      }])
    })
  })

  context('when the company does have a DUNS number', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get(`/v3/company?limit=10&offset=0&sortby=name&global_headquarters_id=${dnbCompanyMock.id}`)
        .reply(200, subsidiariesMock)

      this.middlewareParameters = buildMiddlewareParameters({
        company: dnbCompanyMock,
      })

      await renderSubsidiaries(
        this.middlewareParameters.reqMock,
        this.middlewareParameters.resMock,
        this.middlewareParameters.nextSpy,
      )

      this.subsidiaries = this.middlewareParameters.resMock.render.firstCall.args[1].subsidiaries
    })

    commonTests({
      expectedBreadcrumb: 'One List Corp',
      expectedTemplate: 'companies/views/subsidiaries',
      expectedHeading: 'Subsidiaries of One List Corp',
      expectedCount: 1,
    })

    it('should not set actions buttons', () => {
      const props = this.middlewareParameters.resMock.render.args[0][1]

      expect(props.actionButtons).to.be.undefined
    })
  })
})
