import urls from '../../../../../src/lib/urls'

const PUCK_ADVISER_ID = 'e83a608e-84a4-11e6-ae22-56b6b6499611'
const ADVANCED_ENGINEERING_SECTOR_ID = 'af959812-6095-e211-a939-e4115bead28a'
const UK_COUNTRY_ID = '80756b9a-5d95-e211-a939-e4115bead28a'
const SOUTH_EAST_UK_REGION_ID = '884cd12a-6095-e211-a939-e4115bead28a'

/**
 * Enter `input` into an advisers typeahead `element` and select the first result
 *
 * This waits for the adviser api request to complete before selecting the
 * first option.
 */
const selectFirstAdvisersTypeaheadOption = ({ element, input }) =>
  cy.get(element).within(() => {
    cy.server()
    cy.route('/api-proxy/adviser/?*').as('adviserResults')
    cy.get('div').eq(0).type(input)
    cy.wait('@adviserResults')
    cy.get('[class*="menu"] > div').click()
  })

/**
 * Enter `input` into a typeahead `element` and select the first result
 */
const selectFirstTypeaheadOption = ({ element, input }) => {
  cy.get(element).type(input)
  cy.get(element).find('[class*="menu"] > div').click()
  cy.get(element).click()
}

/**
 * Asserts that a typeahead `element` has the given `label` and `placeholder`
 */
const assertTypeaheadHasLabelAndPlaceholder = ({
  element,
  label,
  placeholder,
}) => {
  cy.get(element)
    .find('label')
    .should('have.text', label)
    .next()
    .should('contain', placeholder)
}

/**
 * Asserts that the typeahead `element` has the `expectedOption` selected
 */
const assertTypeaheadOptionSelected = ({ element, expectedOption }) => {
  cy.get(element).should('contain', expectedOption)
}

/**
 * Asserts that a chip indicator exists in the specified position
 */
const assertChipExists = ({ label, position }) => {
  cy.get(`#filter-chips button:nth-child(${position})`).should((el) => {
    expect(el.text()).to.contain(label)
  })
}

/**
 * Tests that a typeahead functions correctly by inputing a value and selecting
 */
const testTypeahead = ({
  element,
  label,
  placeholder,
  input,
  expectedOption,
}) => {
  assertTypeaheadHasLabelAndPlaceholder({ element, label, placeholder })
  selectFirstTypeaheadOption({ element, input })
  assertTypeaheadOptionSelected({ element, expectedOption })
}

/**
 * Tests that clicking the first indicator button clears a filter element
 */
const testRemoveChip = ({ element, placeholder = null }) => {
  cy.get('#filter-chips').as('filterChips').find('button').click()
  cy.get('@filterChips').should('be.empty')
  placeholder && cy.get(element).should('contain', placeholder)
}

describe('Investments Collections Filter', () => {
  beforeEach(() => {
    cy.get('#field-advisers').as('adviserFilter')
    cy.get('#field-sector').as('sectorFilter')
    cy.get('#field-country').as('countryFilter')
    cy.get('#field-uk_region').as('ukRegionFilter')
    cy.get('#field-estimated_land_date_before').as('estimatedDateBefore')
    cy.get('#field-estimated_land_date_after').as('estimatedDateAfter')
    cy.get('#field-actual_land_date_before').as('actualDateBefore')
    cy.get('#field-actual_land_date_after').as('actualDateAfter')
  })

  context('when the url contains no state', () => {
    before(() => {
      cy.visit(urls.investments.projects.index())
    })

    it('should contain filter fields in the right order', () => {
      cy.get('#company-information-filters')
        .should('exist')
        .find('button')
        .should('exist')
        .next()
        .should('exist')
        .find('*')
        .should('have.id', 'field-advisers')
        .next()
        .should('have.id', 'field-sector')
        .next()
        .should('have.id', 'field-country')
        .next()
        .should('have.id', 'field-uk_region')
        .next()
        .should('have.id', 'field-estimated_land_date_before')
        .next()
        .should('have.id', 'field-estimated_land_date_after')
        .next()
        .should('have.id', 'field-actual_land_date_before')
        .next()
        .should('have.id', 'field-actual_land_date_after')
    })

    it('should filter by advisers', () => {
      cy.get('@adviserFilter')
        .should('contain', 'Search advisers')
        .find('label')
        .should('have.text', 'Advisers')

      selectFirstAdvisersTypeaheadOption({
        element: '@adviserFilter',
        input: 'puc',
      })
      cy.get('@adviserFilter').should('contain', 'Puck Head')
      assertChipExists({ label: 'Puck Head', position: 1 })
    })

    it('should remove the advisers filter', () => {
      testRemoveChip({
        element: '@adviserFilter',
        placeholder: 'Search advisers',
      })
    })

    it('should filter by sector', () => {
      testTypeahead({
        element: '@sectorFilter',
        label: 'Sector',
        placeholder: 'Search sectors',
        input: 'adv',
        expectedOption: 'Advanced Engineering',
      })
    })

    it('should remove the sector filter', () => {
      testRemoveChip({
        element: '@sectorFilter',
        placeholder: 'Search sectors',
      })
    })

    it('should filter by country', () => {
      testTypeahead({
        element: '@countryFilter',
        label: 'Country of origin',
        placeholder: 'Search countries',
        input: 'sin',
        expectedOption: 'Singapore',
      })
    })

    it('should remove the country filter', () => {
      testRemoveChip({
        element: '@countryFilter',
        placeholder: 'Search countries',
      })
    })

    it('should filter by uk region', () => {
      testTypeahead({
        element: '@ukRegionFilter',
        label: 'UK Region',
        placeholder: 'Search UK region',
        input: 'sou',
        expectedOption: 'South East',
      })
    })

    it('should remove the uk region filter', () => {
      testRemoveChip({
        element: '@ukRegionFilter',
        placeholder: 'Search UK regions',
      })
    })

    it('should filter the estimated land date before', () => {
      cy.get('@estimatedDateBefore')
        .find('label')
        .should('have.text', 'Estimated land date before')
        .next()
        .click()
        .type('2020-01-01')
      assertChipExists({
        label: 'Estimated land date before : 1 January 2020',
        position: 1,
      })
    })

    it('should remove the estimated land date before filter', () => {
      testRemoveChip({ element: '@estimatedDateBefore' })
    })

    it('should filter the estimated land date after', () => {
      cy.get('@estimatedDateAfter')
        .find('label')
        .should('have.text', 'Estimated land date after')
        .next()
        .click()
        .type('2020-01-02')
      assertChipExists({
        label: 'Estimated land date after : 2 January 2020',
        position: 1,
      })
    })

    it('should remove the estimated land date before filter', () => {
      testRemoveChip({ element: '@estimatedDateBefore' })
    })

    it('should filter the actual land date before', () => {
      cy.get('@actualDateBefore')
        .find('label')
        .should('have.text', 'Actual land date before')
        .next()
        .click()
        .type('2020-02-01')
      assertChipExists({
        label: 'Actual land date before : 1 February 2020',
        position: 1,
      })
    })

    it('should remove the actual land date before filter', () => {
      testRemoveChip({ element: '@actualDateBefore' })
    })

    it('should filter the actual land date after', () => {
      cy.get('@actualDateAfter')
        .find('label')
        .should('have.text', 'Actual land date after')
        .next()
        .click()
        .type('2020-02-02')
      assertChipExists({
        label: 'Actual land date after : 2 February 2020',
        position: 1,
      })
    })

    it('should remove the actual land date before filter', () => {
      testRemoveChip({ element: '@actualDateBefore' })
    })
  })

  context('when the url contains state', () => {
    before(() => {
      cy.visit(urls.investments.projects.index(), {
        qs: {
          adviser: PUCK_ADVISER_ID,
          sector_descends: ADVANCED_ENGINEERING_SECTOR_ID,
          country: UK_COUNTRY_ID,
          uk_region: SOUTH_EAST_UK_REGION_ID,
          estimated_land_date_before: '2020-01-01',
          estimated_land_date_after: '2020-01-02',
          actual_land_date_before: '2020-02-01',
          actual_land_date_after: '2020-02-02',
        },
      })
    })
    it('should set the selected filter values and filter indicators', () => {
      assertChipExists({ position: 1, label: 'Puck Head' })
      cy.get('@adviserFilter').should('contain', 'Puck Head')
      assertChipExists({ position: 2, label: 'Advanced Engineering' })
      cy.get('@sectorFilter').should('contain', 'Advanced Engineering')
      assertChipExists({ position: 3, label: 'United Kingdom' })
      cy.get('@countryFilter').should('contain', 'United Kingdom')
      assertChipExists({ position: 4, label: 'South East' })
      cy.get('@ukRegionFilter').should('contain', 'South East')
      assertChipExists({
        label: 'Estimated land date before : 1 January 2020',
        position: 5,
      })
      cy.get('@estimatedDateBefore')
        .find('input')
        .should('have.attr', 'value', '2020-01-01')
      assertChipExists({
        label: 'Estimated land date after : 2 January 2020',
        position: 6,
      })
      cy.get('@estimatedDateAfter')
        .find('input')
        .should('have.attr', 'value', '2020-01-02')
      assertChipExists({
        label: 'Actual land date before : 1 February 2020',
        position: 7,
      })
      cy.get('@actualDateBefore')
        .find('input')
        .should('have.attr', 'value', '2020-02-01')
      assertChipExists({
        label: 'Actual land date after : 2 February 2020',
        position: 8,
      })
      cy.get('@actualDateAfter')
        .find('input')
        .should('have.attr', 'value', '2020-02-02')
    })

    it('should clear all filters', () => {
      cy.get('#filter-chips').find('button').as('chips')
      cy.get('#clear-filters').as('clearFilters')
      cy.get('@chips').should('have.length', 8)
      cy.get('@clearFilters').click()
      cy.get('@chips').should('have.length', 0)
      cy.get('@estimatedDateBefore')
        .find('input')
        .should('have.attr', 'value', '')
      cy.get('@estimatedDateAfter')
        .find('input')
        .should('have.attr', 'value', '')
      cy.get('@adviserFilter').should('contain', 'Search advisers...')
      cy.get('@sectorFilter').should('contain', 'Search sectors...')
      cy.get('@countryFilter').should('contain', 'Search countries...')
      cy.get('@ukRegionFilter').should('contain', 'Search UK regions...')
    })
  })
})
