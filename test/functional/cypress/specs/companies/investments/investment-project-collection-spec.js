const qs = require('qs')

const {
  assertCompanyCollectionBreadcrumbs,
  assertRemoveAllFiltersNotPresent,
  assertAddItemButton,
  assertAddItemButtonNotPresent,
  assertListLength,
  assertBadge,
  assertMetadataItem,
  assertItemLink,
  assertArchiveMessage,
  assertArchiveSummary,
  assertUnarchiveLink,
  assertTitle,
} = require('../../../support/collection-list-assertions')
const { collectionListRequest } = require('../../../support/actions')
const {
  investmentProjectFaker,
} = require('../../../fakers/investment-projects')
const { companies, investments } = require('../../../../../../src/lib/urls')
const fixtures = require('../../../fixtures')

const { dnbCorp, archivedLtd } = fixtures.company

function assertListItem({
  alias,
  name,
  id,
  stage,
  investment_type,
  status,
  project_code,
  investor_company,
  sector,
  formattedEstimatedLandDate,
}) {
  it('should have a link with the investment project name', () => {
    assertItemLink(alias, name, `/investments/projects/${id}/details`)
  })

  it('should render the stage badge', () => {
    assertBadge(alias, stage.name)
  })

  it('should render the investment type badge', () => {
    assertBadge(alias, investment_type.name)
  })

  it('should render the status badge', () => {
    assertBadge(alias, status)
  })

  it('should render the project code', () => {
    cy.get(alias).find('h4').should('have.text', `Project code ${project_code}`)
  })

  it('should render the investor name', () => {
    assertMetadataItem(alias, investor_company.name)
  })

  it('should render the sector', () => {
    assertMetadataItem(alias, `Sector ${sector.name}`)
  })

  it('should render the estimated land date', () => {
    assertMetadataItem(
      alias,
      `Estimated land date ${formattedEstimatedLandDate}`
    )
  })
}

describe('Company Investments Collection Page', () => {
  const commitmentToInvest = investmentProjectFaker({
    investment_type: { name: 'Commitment to invest' },
    estimated_land_date: '2022-01-01',
  })
  const nonFDI = investmentProjectFaker({
    investment_type: { name: 'Non-FDI' },
    estimated_land_date: '2022-02-01',
  })
  const fdi = investmentProjectFaker({
    investment_type: { name: 'FDI' },
    estimated_land_date: '2022-03-01',
  })

  const investmentProjects = [commitmentToInvest, nonFDI, fdi]

  const buildQueryString = () =>
    qs.stringify({
      sortby: 'modified_on:desc',
    })

  before(() => {
    const queryString = buildQueryString()
    collectionListRequest(
      'v3/search/investment_project',
      investmentProjects,
      `${companies.investments.companyInvestmentProjects(
        dnbCorp.id
      )}?${queryString}`
    )
  })

  context('Viewing the company investment projects collection page', () => {
    it('should render a meta title', () => {
      cy.title().should(
        'eq',
        'Investments - DnB Corp - Companies - DBT Data Hub'
      )
    })

    assertCompanyCollectionBreadcrumbs(dnbCorp, 'Investment')
    assertTitle('3 investment projects')
    assertRemoveAllFiltersNotPresent()

    it('should render an "Add investment project" button', () => {
      assertAddItemButton(
        'Add investment project',
        investments.projects.create(dnbCorp.id)
      )
    })

    it('should render the sort options', () => {
      cy.get('[data-test="sortby"] option').then((options) => {
        const sortOptions = [...options].map((o) => ({
          value: o.value,
          label: o.label,
        }))
        expect(sortOptions).to.deep.eq([
          { value: 'created_on:desc', label: 'Recently created' },
          { value: 'estimated_land_date:asc', label: 'Earliest land date' },
          { value: 'estimated_land_date:desc', label: 'Latest land date' },
          { value: 'name:asc', label: 'Project name A-Z' },
        ])
      })
    })

    it('should display a list of investment projects', () => {
      assertListLength(investmentProjects)
    })
  })

  context('Commitment to Invest', () => {
    beforeEach(() => {
      cy.get('[data-test="collection-item"]').eq(0).as('firstListItem')
    })
    assertListItem({
      alias: '@firstListItem',
      ...commitmentToInvest,
      formattedEstimatedLandDate: 'January 2022',
    })
  })

  context('Non-FDI project', () => {
    beforeEach(() => {
      cy.get('[data-test="collection-item"]').eq(1).as('secondListItem')
    })
    assertListItem({
      alias: '@secondListItem',
      ...nonFDI,
      formattedEstimatedLandDate: 'February 2022',
    })
  })

  context('FDI project', () => {
    beforeEach(() => {
      cy.get('[data-test="collection-item"]').eq(2).as('thirdListItem')
    })
    assertListItem({
      alias: '@thirdListItem',
      ...fdi,
      formattedEstimatedLandDate: 'March 2022',
    })
  })

  context('when viewing investments projects for an archived company', () => {
    before(() => {
      cy.visit(companies.investments.companyInvestmentProjects(archivedLtd.id))
    })

    assertArchiveSummary('investment project')
    assertArchiveMessage('Investment projects')
    assertUnarchiveLink(`/companies/${archivedLtd.id}/unarchive`)

    it('should not render an "Add investment project" button', () => {
      assertAddItemButtonNotPresent()
    })
  })

  context('API payload', () => {
    it('should have the correct payload', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', '/api-proxy/v3/search/investment_project', {
        body: {
          count: investmentProjects.length,
          results: investmentProjects,
        },
      }).as('apiRequest')
      cy.visit(
        `${companies.investments.companyInvestmentProjects(
          dnbCorp.id
        )}?${queryString}`
      )
      cy.wait('@apiRequest').then(({ request }) =>
        expect(request.body).to.deep.equal({
          offset: 0,
          limit: 10,
          sortby: 'modified_on:desc',
          investor_company: [dnbCorp.id],
          include_parent_companies: false,
          include_subsidiary_companies: false,
        })
      )
    })
  })
})
