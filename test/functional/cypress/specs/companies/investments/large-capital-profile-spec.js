const { companyInvestment: selectors } = require('../../../../../selectors')
const fixtures = require('../../../fixtures')
const { companies } = require('../../../../../../src/lib/urls')
const {
  assertCheckboxGroupAllSelected,
  assertFieldRadios,
  assertSummaryTable,
} = require('../../../support/assertions')

const { oneListCorp, lambdaPlc } = fixtures.company
const largeCapitalProfile = companies.investments.largeCapitalProfile(
  oneListCorp.id
)
const largeCapitalProfileNew = companies.investments.largeCapitalProfile(
  lambdaPlc.id
)

describe('Company Investments and Large capital profile', () => {
  context('when viewing the tabbed area content', () => {
    beforeEach(() => cy.visit(largeCapitalProfile))

    it('should display the "Large capital investor profile" subheading', () => {
      cy.get(selectors.subHeading).should(
        'have.text',
        'Large capital investor profile'
      )
    })
  })

  context('when clicking on a profile summary', () => {
    beforeEach(() => cy.visit(largeCapitalProfile))

    it('should expand the "Investor details" summary and have an edit button', () => {
      cy.get('#investor_details_toggle-toggle-button-open')
        .click()
        .get('[data-test=investor_details_button]')
        .should('be.visible')
    })

    it('should expand the "Investor requirements" summary and have an enabled edit button', () => {
      cy.get('#investor_requirements_toggle-toggle-button-open')
        .click()
        .get('[data-test=investor_requirements_button]')
        .should('be.visible')
    })

    it('should expand the "Location" summary and have an enabled edit button', () => {
      cy.get('#location_toggle-toggle-button-open')
        .click()
        .get('[data-test=location_button]')
        .should('be.visible')
    })
  })

  context('when viewing the incomplete fields on each summary', () => {
    beforeEach(() => cy.visit(largeCapitalProfile))

    it('should display "1 field incomplete"', () => {
      cy.get('[data-test=investor_details-incomplete-fields]').should(
        'contain',
        '1 field incomplete'
      )
    })

    it('should display "9 fields incomplete"', () => {
      cy.get('[data-test=investor_requirements-incomplete-fields]').should(
        'contain',
        '9 fields incomplete'
      )
    })

    it('should display "2 fields incomplete"', () => {
      cy.get('[data-test=location-incomplete-fields]').should(
        'contain',
        '2 fields incomplete'
      )
    })
  })

  context(
    'when viewing a single incomplete field within "Investor details"',
    () => {
      beforeEach(() => cy.visit(largeCapitalProfile))

      it(`should display both Investor description and INCOMPLETE`, () => {
        cy.get('#investor_details_toggle-toggle-button-open').click()
        assertSummaryTable({
          dataTest: 'investor_details-table',
          content: {
            'Investor type': 'Asset manager',
            'Global assets under management': 1000000,
            'Investable capital': 30000,
            'Investor description': 'incomplete',
            'Has this investor cleared the required checks within the last 12 months?':
              'Cleared\nDate of most recent background checks: 29 April 2019\nPerson responsible for most recent background checks: Aaron Chan',
          },
        })
      })
    }
  )

  context(
    'when viewing all incomplete fields within "Investor details"',
    () => {
      beforeEach(() => cy.visit(largeCapitalProfileNew))

      it(`should display INCOMPLETE for all fields`, () => {
        cy.get('#investor_details_toggle-toggle-button-open').click()
        assertSummaryTable({
          dataTest: 'investor_details-table',
          content: {
            'Investor type': 'incomplete',
            'Global assets under management': 'incomplete',
            'Investable capital': 'incomplete',
            'Investor description': 'incomplete',
            'Has this investor cleared the required checks within the last 12 months?':
              'incomplete',
          },
        })
      })
    }
  )

  context(
    'when viewing all incomplete fields within "Investor requirements"',
    () => {
      beforeEach(() => cy.visit(largeCapitalProfileNew))

      it(`should display INCOMPLETE for all fields`, () => {
        cy.get('#investor_requirements_toggle-toggle-button-open').click()
        assertSummaryTable({
          dataTest: 'investor_requirements-table',
          content: {
            'Deal ticket size': 'incomplete',
            'Asset classes of interest': 'incomplete',
            'Types of investment': 'incomplete',
            'Minimum return rate': 'incomplete',
            'Time horizon / tenor': 'incomplete',
            'Restrictions / conditions': 'incomplete',
            'Construction risk': 'incomplete',
            'Minimum equity percentage': 'incomplete',
            'Desired deal role': 'incomplete',
          },
        })
      })
    }
  )

  context('when viewing all incomplete fields within "Location"', () => {
    beforeEach(() => cy.visit(largeCapitalProfileNew))

    it(`should display INCOMPLETE for all fields`, () => {
      cy.get('#location_toggle-toggle-button-open').click()
      assertSummaryTable({
        dataTest: 'location-table',
        content: {
          'UK locations of interest': 'incomplete',
          'Other countries the investor is considering': 'incomplete',
          "Notes on investor's location preferences": 'incomplete',
        },
      })
    })
  })

  context('when viewing the "Investor requirements" edit section', () => {
    beforeEach(() => {
      cy.visit(largeCapitalProfile)
      cy.get('#investor_requirements_toggle-toggle-button-open').click()
      cy.get('[data-test=investor_requirements_button]').click()
    })

    it('should display "Deal ticket size" and all 6 checkboxes should be checked', () => {
      assertCheckboxGroupAllSelected('[data-test=field-deal_ticket_size]')
    })

    it('should display "Types of investment" and all 8 checkboxes should be checked"', () => {
      assertCheckboxGroupAllSelected('[data-test=field-investment_types]')
    })

    it('should display "Minimum return rate" and the radio button "10-15%" should be checked"', () => {
      cy.get('[data-test=field-minimum_return_rate]').then((element) => {
        assertFieldRadios({
          element,
          label: 'Minimum return rate',
          optionsCount: 4,
          value: '10-15%',
        })
      })
    })

    it('should display "Time Horizon / tenor" and all 4 checkboxes should be checked"', () => {
      assertCheckboxGroupAllSelected('[data-test=field-time_horizons]')
    })

    it('should display "Restrictions / conditions" and all 6 checkboxes should be checked"', () => {
      assertCheckboxGroupAllSelected('[data-test=field-restrictions]')
    })

    it('should display "Construction risk" and all 3 checkboxes should be checked"', () => {
      assertCheckboxGroupAllSelected('[data-test=field-construction_risk]')
    })

    it('should display "Minimum equity percentage" and the radio button "20-49%"" should be checked"', () => {
      cy.get('[data-test=field-minimum_equity_percentage]').then((element) => {
        assertFieldRadios({
          element,
          label: 'Minimum equity percentage',
          optionsCount: 4,
          value: '20-49%',
        })
      })
    })

    it('should display "Desired deal role" and all 3 checkboxes should be checked"', () => {
      assertCheckboxGroupAllSelected('[data-test=field-desired_deal_role]')
    })
  })

  context('when viewing the "Investor requirements" details section', () => {
    beforeEach(() => {
      cy.visit(largeCapitalProfile)
      cy.get('#investor_requirements_toggle-toggle-button-open').click()
    })

    it('should render all the requirement fields', () => {
      assertSummaryTable({
        dataTest: 'investor_requirements-table',
        content: {
          'Deal ticket size':
            'Up to £49 million, £50-99 million, £100-249 million, £250-499 million, £500-999 million, £1 billion +',
          'Asset classes of interest':
            'Biofuel, Biomass, Direct heating, Energy from waste, Energy storage, Gas fired power, Nuclear, Regulated assets, Smart energy, Solar power, Transport, Wave and tidal, Windpower (offshore), Windpower (onshore), Upstream oil and gas, Advanced manufacturing, Commerical led, Data centre, Garden cities, Hotel, Lesuire, Life sciences, Logistics, Mixed use, Private rented sector, Regeneration, Research and development, Residential led, Retail, Smart cities, Student housing, Transport hub / rail',
          'Types of investment':
            'Direct Investment in Project Equity, Direct Investment in Project Debt, Direct Investment in Corporate Equity, Direct Investment in Corporate Debt, Mezzanine Debt (incl. preferred shares, convertibles), Venture capital funds, Energy / Infrastructure / Real Estate Funds (UKEIREFs), Private Equity / Venture Capital',
          'Minimum return rate': '10-15%',
          'Time horizon / tenor':
            'Up to 5 years, 5-9 years, 10-14 years, 15 years +',
          'Restrictions / conditions':
            'Liquidity / exchange listing, Inflation adjustment, Require FX hedge, Require board seat, Require linked technology / knowledge transfer, Will participate in competitive bids / auctions',
          'Construction risk':
            'Greenfield (construction risk), Brownfield (some construction risk), Operational (no construction risk)',
          'Minimum equity percentage': '20-49%',
          'Desired deal role':
            'Lead manager / deal structure, Co-lead manager, Co-investor / syndicate member',
        },
      })
    })
  })

  context('when viewing the "Location" details section', () => {
    beforeEach(() => {
      cy.visit(largeCapitalProfile)
      cy.get('#location_toggle-toggle-button-open').click()
    })

    it('should render all the location fields', () => {
      assertSummaryTable({
        dataTest: 'location-table',
        content: {
          'UK locations of interest': 'London, West Midlands',
          'Other countries the investor is considering': 'Japan',
          "Notes on investor's location preferences": 'Notes go here please',
        },
      })
    })
  })
})
