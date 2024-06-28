import { testTypeaheadOptionsLength } from '../../support/tests'
import { ukRegionListFaker } from '../../fakers/regions'

const urls = require('../../../../../src/lib/urls')

const expandToggleSections = () =>
  cy.get('[data-test="toggle-section-button"]').click({ multiple: true })

const testTypeaheadFilter = ({
  selector,
  options = [],
  expectedNumberOfResults,
}) => {
  const optionsMessage = options.length
    ? `options ${options.join(', ')}`
    : `no options`

  context(`When ${optionsMessage} are selected`, () => {
    beforeEach(() => {
      cy.visit(urls.investments.profiles.index())
      expandToggleSections()
      cy.get(`[data-test="${selector}"]`).within((e) =>
        options.forEach((option) =>
          cy.wrap(e).find('input').clear().type(`${option}{downarrow}{enter}`)
        )
      )
    })

    it(`There should be ${expectedNumberOfResults} items found`, () => {
      cy.contains(
        `${expectedNumberOfResults} profile${
          expectedNumberOfResults > 1 ? 's' : ''
        }`
      )
      cy.get('h3').should('have.length', expectedNumberOfResults)
    })

    it('A chip should appear for each selected filter in the header', () =>
      cy
        .get('#filter-chips')
        .within((e) =>
          options.forEach((option) => cy.wrap(e).contains(option))
        ))
  })
}

const testInputFilter = ({ selector, text, expectedNumberOfResults }) => {
  context(`When inputting text "${text}"`, () => {
    beforeEach(() => {
      cy.visit(urls.investments.profiles.index())
      expandToggleSections()
      cy.get(selector).within((e) => cy.wrap(e).type(text).blur())
    })

    it(`There should be ${expectedNumberOfResults} items found`, () => {
      cy.contains(
        `${expectedNumberOfResults} profile${
          expectedNumberOfResults > 1 ? 's' : ''
        }`
      )
      cy.get('h3').should('have.length', expectedNumberOfResults)
    })

    it('A chip should appear for the selected filter in the header', () =>
      cy.get('#filter-chips').within((e) => cy.wrap(e).contains(text)))
  })
}

const typeaheadFilterTestCases = ({ filterName, selector, cases }) =>
  context(filterName, () =>
    cases.forEach((options) =>
      testTypeaheadFilter({
        selector,
        ...options,
      })
    )
  )

const inputFilterTestCases = ({ filterName, selector, cases }) =>
  context(filterName, () =>
    cases.forEach((options) =>
      testInputFilter({
        selector,
        ...options,
      })
    )
  )

describe('Investor profiles filters', () => {
  it('returns 10 cases when no options selected', () => {
    cy.visit(urls.investments.profiles.index())

    cy.contains('10 profiles')
    cy.get('h3').should('have.length', 10)
  })

  typeaheadFilterTestCases({
    filterName: 'Country of company origin',
    selector: 'country-filter',
    cases: [
      {
        options: ['Afghanistan'],
        expectedNumberOfResults: 3,
      },
    ],
  })

  typeaheadFilterTestCases({
    filterName: 'Sector of interest',
    selector: 'asset-class-filter',
    cases: [
      {
        options: ['Biofuel'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['Biofuel', 'Nuclear'],
        expectedNumberOfResults: 4,
      },
    ],
  })

  typeaheadFilterTestCases({
    filterName: 'Investor type',
    selector: 'investor-type-filter',
    cases: [
      {
        options: ['Fund of funds'],
        expectedNumberOfResults: 1,
      },
      {
        options: ['Fund of funds', 'Family office'],
        expectedNumberOfResults: 2,
      },
    ],
  })

  typeaheadFilterTestCases({
    filterName: 'Check clearance',
    selector: 'required-checks-conducted-filter',
    cases: [
      {
        options: ['Cleared'],
        expectedNumberOfResults: 1,
      },
      {
        options: ['Cleared', 'Issues identified'],
        expectedNumberOfResults: 3,
      },
    ],
  })

  inputFilterTestCases({
    filterName: 'Company name',
    selector: '[placeholder="Search company name"]',
    cases: [
      {
        text: 'foo',
        expectedNumberOfResults: 2,
      },
    ],
  })

  inputFilterTestCases({
    filterName: 'Investable capital £ min',
    selector: '[aria-label="Investable capital £ min"]',
    cases: [
      {
        text: '1000',
        expectedNumberOfResults: 3,
      },
    ],
  })

  inputFilterTestCases({
    filterName: 'Investable capital £ max',
    selector: '[aria-label="Investable capital £ max"]',
    cases: [
      {
        text: '999',
        expectedNumberOfResults: 0,
      },
    ],
  })

  inputFilterTestCases({
    filterName: 'Global assets under management £ min',
    selector: '[aria-label="Global assets under management £ min"]',
    cases: [
      {
        text: '1000',
        expectedNumberOfResults: 3,
      },
    ],
  })

  inputFilterTestCases({
    filterName: 'Global assets under management £ max',
    selector: '[aria-label="Global assets under management £ max"]',
    cases: [
      {
        text: '999',
        expectedNumberOfResults: 0,
      },
    ],
  })

  typeaheadFilterTestCases({
    filterName: 'Deal ticket size',
    selector: 'deal-ticket-size-filter',
    cases: [
      {
        options: ['Up to £49 million'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['Up to £49 million', '£50-99 million'],
        expectedNumberOfResults: 5,
      },
    ],
  })

  typeaheadFilterTestCases({
    filterName: 'Investment type',
    selector: 'types-of-investment-filter',
    cases: [
      {
        options: ['Direct Investment in Project Equity'],
        expectedNumberOfResults: 2,
      },
      {
        options: [
          'Direct Investment in Project Equity',
          'Venture capital funds',
        ],
        expectedNumberOfResults: 3,
      },
    ],
  })

  typeaheadFilterTestCases({
    filterName: 'Minimum return rate',
    selector: 'minimum-return-rate-filter',
    cases: [
      {
        options: ['5-10%'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['5-10%', '10-15%'],
        expectedNumberOfResults: 4,
      },
    ],
  })

  typeaheadFilterTestCases({
    filterName: 'Time horizon',
    selector: 'time-horizon-tenor-filter',
    cases: [
      {
        options: ['Up to 5 years'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['Up to 5 years', '15 years +'],
        expectedNumberOfResults: 3,
      },
    ],
  })

  typeaheadFilterTestCases({
    filterName: 'Restrictions and conditions',
    selector: 'restrictions-conditions-filter',
    cases: [
      {
        options: ['Require board seat'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['Require board seat', 'Inflation adjustment'],
        expectedNumberOfResults: 3,
      },
    ],
  })

  typeaheadFilterTestCases({
    filterName: 'Construction risk',
    selector: 'construction-risk-filter',
    cases: [
      {
        options: ['Greenfield (construction risk)'],
        expectedNumberOfResults: 2,
      },
      {
        options: [
          'Greenfield (construction risk)',
          'Brownfield (some construction risk)',
        ],
        expectedNumberOfResults: 3,
      },
    ],
  })

  typeaheadFilterTestCases({
    filterName: 'Minimum equity percentage',
    selector: 'minimum-equity-percentage-filter',
    cases: [
      {
        options: ['1-19%'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['1-19%', '50% +'],
        expectedNumberOfResults: 4,
      },
    ],
  })

  typeaheadFilterTestCases({
    filterName: 'Desired deal role',
    selector: 'desired-deal-role-filter',
    cases: [
      {
        options: ['Lead manager / deal structure'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['Lead manager / deal structure', 'Co-lead manager'],
        expectedNumberOfResults: 3,
      },
    ],
  })

  typeaheadFilterTestCases({
    filterName: 'UK regions of interest',
    selector: 'uk-regions-of-interest',
    cases: [
      {
        options: ['Benzonia'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['Benzonia', 'Jersey'],
        expectedNumberOfResults: 3,
      },
    ],
  })

  it('should display all UK regions (active & disabled) in the filter list', () => {
    const element = '[data-test="uk-regions-of-interest"]'
    const ukRegions = [
      ...ukRegionListFaker(2),
      ...ukRegionListFaker(2, { disabled_on: '2018-01-01' }),
    ]
    cy.intercept('GET', `${urls.metadata.ukRegion()}*`, ukRegions).as(
      'ukRegionsApiRequest'
    )
    cy.visit(urls.investments.profiles.index())
    cy.wait('@ukRegionsApiRequest')
    cy.get('[data-test="toggle-section-button"]').contains('Location').click()
    testTypeaheadOptionsLength({ element, length: ukRegions.length })
  })
})
