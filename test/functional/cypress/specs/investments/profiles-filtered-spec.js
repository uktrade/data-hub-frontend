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
      cy.contains(`${expectedNumberOfResults} Profiles`)
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

const typeaheadFilterTestCases = ({ filterName, selector, cases }) =>
  context(filterName, () =>
    cases.forEach((options) =>
      testTypeaheadFilter({
        ...options,
        selector,
      })
    )
  )

describe('Investor profiles filters', () => {
  typeaheadFilterTestCases({
    filterName: 'Countries of origin',
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
})
