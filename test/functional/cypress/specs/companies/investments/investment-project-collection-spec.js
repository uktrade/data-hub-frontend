const qs = require('qs')

const { assertBreadcrumbs } = require('../../../support/assertions')
const {
  investmentProjectFaker,
} = require('../../../fakers/investment-projects')
const urls = require('../../../../../../src/lib/urls')
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
    cy.get(alias)
      .find('h3')
      .children()
      .should('have.text', name)
      .should('have.attr', 'href', `/investments/projects/${id}/details`)
  })

  it('should render the stage badge', () => {
    cy.get(alias)
      .find('[data-test="badge"]')
      .eq(0)
      .should('contain', stage.name)
  })

  it('should render the investment type badge', () => {
    cy.get(alias)
      .find('[data-test="badge"]')
      .eq(1)
      .should('contain', investment_type.name)
  })

  it('should render the status badge', () => {
    cy.get(alias).find('[data-test="badge"]').eq(2).should('contain', status)
  })

  it('should render the project code', () => {
    cy.get(alias).find('h4').should('have.text', `Project code ${project_code}`)
  })

  it('should render the investor name', () => {
    cy.get(alias)
      .find('[data-test="metadata-item"]')
      .eq(0)
      .should('contain', investor_company.name)
  })

  it('should render the sector', () => {
    cy.get(alias)
      .find('[data-test="metadata-item"]')
      .eq(1)
      .should('contain', `Sector ${sector.name}`)
  })

  it('should render the estimated land date', () => {
    cy.get(alias)
      .find('[data-test="metadata-item"]')
      .eq(2)
      .should('contain', `Estimated land date ${formattedEstimatedLandDate}`)
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
    cy.intercept('POST', '/v3/search/investment_project', {
      body: {
        count: investmentProjects.length,
        results: investmentProjects,
      },
    }).as('apiRequest')
    cy.visit(
      `${urls.companies.investments.companyInvestmentProjects(
        dnbCorp.id
      )}?${queryString}`
    )
  })

  context('Viewing the company investment projects collection page', () => {
    it('should render a meta title', () => {
      cy.title().should(
        'eq',
        'Investments - DnB Corp - Companies - DIT Data Hub'
      )
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        [dnbCorp.name]: urls.companies.detail(dnbCorp.id),
        Investment: null,
      })
    })

    it('should render a heading', () => {
      cy.get('h2').should('have.text', '3 investment projects')
    })

    it('should not render a "Remove all filters" button', () => {
      cy.get('[data-test="clear-filters"]').should('not.exist')
    })

    it('should render an "Add investment project" button', () => {
      cy.get('[data-test="add-collection-item-button"]').should(
        'have.text',
        'Add investment project'
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
      cy.get('[data-test="collection-list"]').should('have.length', 1)
      cy.get('[data-test="collection-item"]').should(
        'have.length',
        investmentProjects.length
      )
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
      cy.visit(
        urls.companies.investments.companyInvestmentProjects(archivedLtd.id)
      )
    })

    it('should render the archived summary', () => {
      cy.get('[data-test="archived-details"]').should(
        'contain',
        'Why can I not add an investment project?'
      )
    })

    it('should render an archived explanation', () => {
      cy.get('[data-test="archived-details"]').should(
        'contain',
        'Investment projects cannot be added to an archived company.'
      )
    })

    it('should render "Click here to unarchive"', () => {
      cy.get('[data-test="archived-details"]')
        .find('a')
        .should('have.text', 'Click here to unarchive')
        .should('have.attr', 'href', `/companies/${archivedLtd.id}/unarchive`)
    })

    it('should not render an "Add investment project" button', () => {
      cy.get('[data-test="add-collection-item-button"]').should('not.exist')
    })
  })

  context('API payload', () => {
    it('should have the correct payload', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', '/v3/search/investment_project', {
        body: {
          count: investmentProjects.length,
          results: investmentProjects,
        },
      }).as('apiRequest')
      cy.visit(
        `${urls.companies.investments.companyInvestmentProjects(
          dnbCorp.id
        )}?${queryString}`
      )
      cy.wait('@apiRequest').then(({ request }) =>
        expect(request.body).to.deep.equal({
          offset: 0,
          limit: 10,
          sortby: 'modified_on:desc',
          investor_company: [dnbCorp.id],
        })
      )
    })
  })
})
