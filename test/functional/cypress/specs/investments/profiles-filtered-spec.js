const urls = require('../../../../../src/lib/urls')

const testTypeaheadFilter = ({
  selector,
  options = [],
  expectedNumberOfResults,
}) => {
  const optionsMessage = options.length
    ? `options ${options.join(', ')}`
    : `no options`

  context(`When ${optionsMessage} are selected`, () => {
    it(`There should be ${expectedNumberOfResults} items found`, () => {
      cy.visit(urls.investments.profiles.index())
      cy.get(`[data-test="${selector}"]`).within((e) =>
        options.forEach((option) => cy.wrap(e).type(`${option}{enter}`))
      )
      cy.contains(
        `${expectedNumberOfResults} Profile${
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

const testInputFilter = ({ placeholder, text, expectedNumberOfResults }) => {
  context(`When inputting text "${text}"`, () => {
    it(`There should be ${expectedNumberOfResults} items found`, () => {
      cy.visit(urls.investments.profiles.index())
      cy.get(`[placeholder="${placeholder}"]`).within((e) =>
        cy.wrap(e).type(text).blur()
      )
      cy.contains(
        `${expectedNumberOfResults} Profile${
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

const inputFilterTestCases = ({ filterName, placeholder, cases }) =>
  context(filterName, () =>
    cases.forEach((options) =>
      testInputFilter({
        placeholder,
        ...options,
      })
    )
  )

describe('Investor profiles filters', () => {
  typeaheadFilterTestCases({
    filterName: 'Country of origin',
    selector: 'country-filter',
    cases: [
      {
        expectedNumberOfResults: 10,
      },
      {
        options: ['Afghanistan'],
        expectedNumberOfResults: 3,
      },
      {
        options: ['Zimbabwe'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['Slovakia'],
        expectedNumberOfResults: 0,
      },
    ],
  })

  typeaheadFilterTestCases({
    filterName: 'Asset class of interest',
    selector: 'asset-class-of-interest-filter',
    cases: [
      {
        expectedNumberOfResults: 10,
      },
      {
        options: ['Biofuel'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['Nuclear'],
        expectedNumberOfResults: 3,
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
        expectedNumberOfResults: 10,
      },
      {
        options: ['Fund of funds'],
        expectedNumberOfResults: 1,
      },
      {
        options: ['Family office'],
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
        expectedNumberOfResults: 10,
      },
      {
        options: ['Cleared'],
        expectedNumberOfResults: 1,
      },
      {
        options: ['Issues identified'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['Cleared', 'Issues identified'],
        expectedNumberOfResults: 3,
      },
    ],
  })

  inputFilterTestCases({
    filterName: 'Company name',
    placeholder: 'Search company name',
    cases: [
      {
        text: 'foo',
        expectedNumberOfResults: 2,
      },
      {
        text: 'bar',
        expectedNumberOfResults: 1,
      },
      {
        text: 'bing',
        expectedNumberOfResults: 0,
      },
    ],
  })

  typeaheadFilterTestCases({
    filterName: 'Deal ticket size',
    selector: 'deal-ticket-size-filter',
    cases: [
      {
        expectedNumberOfResults: 10,
      },
      {
        options: ['Up to £49 million'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['£50-99 million'],
        expectedNumberOfResults: 4,
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
        expectedNumberOfResults: 10,
      },
      {
        options: ['Direct Investment in Project Equity'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['Venture capital funds'],
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
        expectedNumberOfResults: 10,
      },
      {
        options: ['5-10%'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['10-15%'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['5-10%', '10-15%'],
        expectedNumberOfResults: 4,
      },
    ],
  })

  typeaheadFilterTestCases({
    filterName: 'Time horizon tenor',
    selector: 'time-horizon-tenor-filter',
    cases: [
      {
        expectedNumberOfResults: 10,
      },
      {
        options: ['Up to 5 years'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['15 years +'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['Up to 5 years', '15 years +'],
        expectedNumberOfResults: 3,
      },
    ],
  })

  typeaheadFilterTestCases({
    filterName: 'Restrictions and Conditions',
    selector: 'restrictions-conditions-filter',
    cases: [
      {
        expectedNumberOfResults: 10,
      },
      {
        options: ['Require board seat'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['Inflation adjustment'],
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
        expectedNumberOfResults: 10,
      },
      {
        options: ['Greenfield (construction risk)'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['Brownfield (some construction risk)'],
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
        expectedNumberOfResults: 10,
      },
      {
        options: ['1-19%'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['50% +'],
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
        expectedNumberOfResults: 10,
      },
      {
        options: ['Lead manager / deal structure'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['Co-lead manager'],
        expectedNumberOfResults: 2,
      },
      {
        options: ['Lead manager / deal structure', 'Co-lead manager'],
        expectedNumberOfResults: 3,
      },
    ],
  })
})
