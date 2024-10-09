const {
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')
const { interactionFaker } = require('../../fakers/interactions')

const incompleteOpportunity = require('../../../../sandbox/fixtures/v4/investment/large-capital-opportunity-incomplete.json')
const completeOpportunity = require('../../../../sandbox/fixtures/v4/investment/large-capital-opportunity-complete.json')
const { investments } = require('../../../../../src/lib/urls')

const interaction = interactionFaker()

const assertLocalHeaderDetails = (index, label, value) => {
  cy.get('[data-test="localHeaderDetails"]>ul>li')
    .eq(index)
    .should('contain', label)
    .and('contain', value)
}

const assertRequirementTableValues = (values, tableElement) => {
  cy.get('#opportunity_requirements_toggle')
    .find(tableElement)
    .as('requirementElements')

  values.forEach((value, index) => {
    cy.get('@requirementElements').eq(index).should('have.text', value)
  })
}

const assertDetailsTableValues = (values, tableElement) => {
  cy.get('#opportunity_details_toggle').find(tableElement).as('detailsElements')

  values.forEach((value, index) => {
    cy.get('@detailsElements').eq(index).should('have.text', value)
  })
}

describe('UK Opportunity with missing data', () => {
  beforeEach(() => {
    cy.visit(investments.opportunities.details(incompleteOpportunity.id))
  })
  context('The page header', () => {
    it('should display correct breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Investments: investments.index(),
        'UK opportunities': '/investments/opportunities',
        [incompleteOpportunity.name]: `/investments/opportunities/${incompleteOpportunity.id}/details`,
        Details: '',
      })
    })
    it('should display opportunity name in the header', () => {
      assertLocalHeader(incompleteOpportunity.name)
    })
    it('should display opportunity details in the header', () => {
      cy.get('[data-test="localHeaderDetails"]>ul>li')
        .should('have.length', '5')
        // Assert that there's the change status link in the first item
        .eq(0)
        .within(() =>
          cy
            .contains('change')
            .should(
              'have.attr',
              'href',
              `/investments/opportunities/${incompleteOpportunity.id}/status`
            )
        )
      assertLocalHeaderDetails(0, 'Status', 'Seeking investment')
      assertLocalHeaderDetails(1, 'Valuation', 'Not yet valued')
      assertLocalHeaderDetails(2, 'UK location', 'Not yet defined')
      assertLocalHeaderDetails(3, 'Asset class', 'Not yet defined')
      assertLocalHeaderDetails(4, 'Created on', '13 May 2019, 3:01pm')
    })
  })
  context('The tab navigation', () => {
    it('should display two tabs with correct text', () => {
      cy.get('[data-test="tab-item"]').eq(0).should('have.text', 'Details')
      cy.get('[data-test="tab-item"]').eq(1).should('have.text', 'Interactions')
    })
    it('should show details when the details tab is selected', () => {
      cy.get('[data-test="tablist"] button').contains('Details').click()
      cy.get('#opportunity_details_toggle').should('be.visible')
      cy.get('#opportunity_requirements_toggle').should('be.visible')
    })
    it('should show interactions when the interactions tab is selected', () => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/interaction?large_capital_opportunity_id=${incompleteOpportunity.id}&limit=10&offset=0`,
        {
          body: {
            count: 1,
            results: [interaction],
          },
        }
      ).as('apiRequest')
      cy.get('[data-test="tablist"] button').contains('Interactions').click()
      cy.wait('@apiRequest')
      cy.get('[data-test="collection-header').should(
        'have.text',
        '1 interaction'
      )
    })
  })
  context('The details tab', () => {
    beforeEach(() => {
      cy.get('button').contains('Details').click()
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
    })
    it('should display required field tags', () => {
      cy.get('#opportunity_details_toggle').should(
        'contain',
        '7 fields incomplete'
      )
      cy.get('#opportunity_requirements_toggle').should(
        'contain',
        '5 fields incomplete'
      )
    })
    context('The details section', () => {
      beforeEach(() => {
        cy.contains('Opportunity details').click({ force: true })
      })
      it('should show ten rows of data', () => {
        cy.get('#opportunity_details_toggle')
          .find('tr')
          .should('have.length', '10')
      })
      it('should display the correct table headings', () => {
        assertDetailsTableValues(
          [
            'Opportunity name',
            'Opportunity description',
            'UK location',
            'Promoters',
            'Has this opportunity cleared the required checks?',
            'Lead DBT relationship manager',
            'Other DBT contacts',
            'Asset classes',
            'Opportunity value',
            'Construction risk',
          ],
          'th'
        )
      })
      it('should display the name only, with all other rows incomplete', () => {
        cy.get('#opportunity_details_toggle')
          .find('td:contains("incomplete")')
          .should('have.length', '9')
        cy.get('#opportunity_details_toggle')
          .find('td:contains("Battersea power station regeneration")')
          .should('exist')
      })
      it('should display the "Edit" button', () => {
        cy.get('#opportunity_details_toggle').should('contain', 'Edit')
      })
    })
    context('The requirements section', () => {
      beforeEach(() => {
        cy.contains('Opportunity requirements').click({ force: true })
      })
      it('should show five rows of data', () => {
        cy.get('#opportunity_requirements_toggle')
          .find('tr')
          .should('have.length', '5')
      })
      it('should display the correct table headings', () => {
        assertRequirementTableValues(
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
})

describe('UK Opportunity with complete data', () => {
  beforeEach(() => {
    cy.visit(investments.opportunities.details(completeOpportunity.id))
  })
  context('The page header', () => {
    it('should display correct breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Investments: investments.index(),
        'UK opportunities': '/investments/opportunities',
        [completeOpportunity.name]: `/investments/opportunities/${completeOpportunity.id}/details`,
        Details: '',
      })
    })
    it('should display opportunity name in the header', () => {
      assertLocalHeader(completeOpportunity.name)
    })
    it('should display opportunity details in the header', () => {
      cy.get('[data-test="localHeaderDetails"]>ul>li').should(
        'have.length',
        '5'
      )
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
  context('The details tab', () => {
    it('should display two "Completed" labels', () => {
      cy.get('label:contains("Complete")').should('have.length', '2')
    })
    context('The details section', () => {
      beforeEach(() => {
        cy.contains('Opportunity details').click({ force: true })
      })
      it('Should show data in all fields', () => {
        assertDetailsTableValues(
          [
            'Battersea power station regeneration',
            'Here is a lengthy description of an investment opportunity.',
            'Benzonia',
            'Lambda plc',
            'Cleared',
            'Travis Greene',
            'John Rogers',
            'BiofuelNuclear',
            '£12,345,789',
            'Greenfield (construction risk)',
          ],
          'td'
        )
      })
      it('should display the Edit button', () => {
        cy.get('#opportunity_details_toggle').should('contain', 'Edit')
      })
    })
    context('The requirements section', () => {
      beforeEach(() => {
        cy.contains('Opportunity requirements').click({ force: true })
      })
      it('Should show data in all fields', () => {
        assertRequirementTableValues(
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
})
