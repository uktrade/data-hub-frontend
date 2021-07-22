const {
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')
const fixtures = require('../../fixtures')

const incompleteOpportunity = require('../../../../sandbox/fixtures/v4/investment/large-capital-opportunity-incomplete.json')
const completeOpportunity = require('../../../../sandbox/fixtures/v4/investment/large-capital-opportunity-complete.json')
const { investments } = require('../../../../../src/lib/urls')

const assertLocalHeaderDetails = (index, label, value) => {
  cy.get('[data-test="localHeaderDetails"]>li')
    .eq(index)
    .should('contain', label)
    .and('contain', value)
}

const assertTableValues = (values, tableElement) => {
  cy.get('#opportunity_requirements_toggle')
    .find(tableElement)
    .as('requirementElements')

  values.forEach((value, index) => {
    cy.get('@requirementElements').eq(index).should('have.text', value)
  })
}

describe('UK Opportunity with missing data', () => {
  before(() => {
    cy.visit(
      investments.opportunities.details(
        fixtures.investment.incompleteOpportunity.id
      )
    )
  })
  context('The page header', () => {
    it('should display correct breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Investments: '/investments',
        'UK opportunities': '/investments/opportunities',
        [incompleteOpportunity.name]: '',
      })
    })
    it('should display opportunity name in the header', () => {
      assertLocalHeader(incompleteOpportunity.name)
    })
    it('should display opportunity details in the header', () => {
      cy.get('[data-test="localHeaderDetails"]>li').should('have.length', '5')
      assertLocalHeaderDetails(0, 'Status', 'Unassigned')
      assertLocalHeaderDetails(1, 'Valuation', 'Not yet valued')
      assertLocalHeaderDetails(2, 'UK location', 'Not yet defined')
      assertLocalHeaderDetails(3, 'Asset class', 'Not yet defined')
      assertLocalHeaderDetails(4, 'Created on', '13 May 2019, 3:01pm')
    })
  })

  it('should display opportunity toggles', () => {
    cy.get('#opportunity_details_toggle').should(
      'contain',
      'Opportunity details'
    )
    cy.get('#opportunity_requirements_toggle').should(
      'contain',
      'Opportunity requirements'
    )
    cy.get('#opportunity_delete_toggle').should(
      'contain',
      'Need to delete this opportunity?'
    )
  })
  it('should display required field tags', () => {
    cy.get('#opportunity-details').should('contain', '7 fields required')
    cy.get('#opportunity-details').should('contain', '5 fields required')
  })
  context('The details section', () => {
    it('should display the Edit button', () => {
      cy.get('#opportunity-details').should('contain', 'Edit')
    })
  })
  context('The requirements section', () => {
    before(() => {
      cy.contains('Opportunity requirements').click({ force: true })
    })
    it('should show five rows of data', () => {
      cy.get('#opportunity_requirements_toggle')
        .find('tr')
        .should('have.length', '5')
    })
    it('should display the correct table headings', () => {
      assertTableValues(
        [
          'Total investment sought',
          'Current investment secured',
          'Types of investment',
          'Estimated return rate',
          'Timescales',
        ],
        'th'
      )
    })
    it('should only display "Incomplete" in table data', () => {
      cy.get('#opportunity_requirements_toggle')
        .find('td')
        .each((el) => {
          cy.wrap(el).should('have.text', 'incomplete')
        })
    })
    it('should display the "Edit" button', () => {
      cy.get('#opportunity_requirements_toggle').should('contain', 'Edit')
    })
  })
})

describe('UK Opportunity with complete data', () => {
  before(() => {
    cy.visit(
      investments.opportunities.details(
        fixtures.investment.completeOpportunity.id
      )
    )
  })
  context('The page header', () => {
    it('should display correct breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Investments: '/investments',
        'UK opportunities': '/investments/opportunities',
        [completeOpportunity.name]: '',
      })
    })
    it('should display opportunity name in the header', () => {
      assertLocalHeader(completeOpportunity.name)
    })
    it('should display opportunity details in the header', () => {
      cy.get('[data-test="localHeaderDetails"]>li').should('have.length', '5')
      assertLocalHeaderDetails(0, 'Status', completeOpportunity.status.name)
      assertLocalHeaderDetails(1, 'Valuation', '£12,345,789')
      assertLocalHeaderDetails(
        2,
        'UK location',
        completeOpportunity.uk_region_locations[0].name
      )
      assertLocalHeaderDetails(3, 'Asset class', 'Multiple')
      assertLocalHeaderDetails(4, 'Created on', '13 May 2019, 3:01pm')
    })
  })
  it('should display two "Completed" labels', () => {
    cy.get('label:contains("Complete")').should('have.length', '2')
  })
  context('The details section', () => {
    before(() => {
      cy.contains('Opportunity details').click({ force: true })
    })
    it('should display the Edit button', () => {
      cy.get('#opportunity_details_toggle').should('contain', 'Edit')
    })
  })
  context('The requirements section', () => {
    before(() => {
      cy.contains('Opportunity requirements').click({ force: true })
    })
    it('Should show data in all fields', () => {
      assertTableValues(
        [
          '£24,000,000',
          '£120,000',
          'Direct Investment in Project EquityVenture capital funds',
          '5-10%',
          'Up to 5 years',
        ],
        'td'
      )
    })
    it('should display the "Edit" button', () => {
      cy.get('#opportunity_requirements_toggle').should('contain', 'Edit')
    })
  })
})

describe('UK Opportunity edit details functionality', () => {
  before(() => {
    cy.visit(
      investments.opportunities.details(
        fixtures.investment.incompleteOpportunity.id
      )
    )
  })

  it('Should display the edit details form and submit the new data', () => {
    cy.get(
      '#opportunity_details_toggle > div > [data-test="toggle-section-button"]'
    ).click()
    cy.contains('Edit').click()
    cy.get('#name').type('Egg Shop')
    cy.get('#description').type('A very good description')
    cy.get('#opportunityValue').type('123456')
    cy.contains('Submit').click()
    cy.intercept(
      `PATCH', '/v4/large-capital-opportunity/${fixtures.investment.incompleteOpportunity.id}`,
      (req) => {
        expect(req.body).to.include('Egg Shop')
        expect(req.body).to.include('A very good description')
        expect(req.body).to.include('123456')
      }
    )
    cy.get('#opportunity-details').should('contain', 'Edit')
  })
})
