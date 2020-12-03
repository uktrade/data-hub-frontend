import urls from '../../../../../src/lib/urls'

const PUCK_ADVISER_ID = 'e83a608e-84a4-11e6-ae22-56b6b6499611'
const ADVANCED_ENGINEERING_SECTOR_ID = 'af959812-6095-e211-a939-e4115bead28a'
const UK_COUNTRY_ID = '80756b9a-5d95-e211-a939-e4115bead28a'
const SOUTH_EAST_UK_REGION_ID = '884cd12a-6095-e211-a939-e4115bead28a'

const selectAdvisersTypeahead = (fieldName, input) =>
  cy.get(fieldName).within(() => {
    cy.server()
    cy.route('/api-proxy/adviser/?*').as('adviserResults')
    cy.get('div').eq(0).type(input)
    cy.wait('@adviserResults')
    cy.get('[class*="menu"] > div').click()
  })

const assertTypehead = (element, label, placeholder, input, selectedOption) => {
  cy.get(element)
    .find('label')
    .should('have.text', label)
    .next()
    .should('contain', placeholder)
    .find('div')
    .eq(0)
    .type(input)
  cy.get(element).find('[class*="menu"] > div').click()
  cy.get(element).click()
  cy.get(element).should('contain', selectedOption)
}

const assertFilterIndicator = (count, label) => {
  cy.get(`main article div + div button:nth-child(${count})`).should((el) => {
    expect(el.text()).to.contain(label)
  })
}

const assertRemovedFilterIndicator = (element, placeholder = null) => {
  cy.get('main article div + div button').click()
  cy.get('main article div + div').should('be.empty')
  placeholder && cy.get(element).should('contain', placeholder)
}

describe('Investments Collections Filter', () => {
  beforeEach(() => {
    cy.get('aside button')
      .next()
      .find('#field-advisers')
      .as('adviserFilter')
      .next()
      .as('sectorFilter')
      .next()
      .as('countryFilter')
      .next()
      .as('ukRegionFilter')
      .next()
      .as('estimatedDateBefore')
      .next()
      .as('estimatedDateAfter')
  })
  context('when the url contains no state', () => {
    before(() => {
      cy.visit(urls.investments.projects.index())
    })

    it('should filter by advisers', () => {
      cy.get('@adviserFilter')
        .should('contain', 'Search advisers')
        .find('label')
        .should('have.text', 'Advisers')

      selectAdvisersTypeahead('@adviserFilter', 'puc')
      cy.get('@adviserFilter').should('contain', 'Puck Head')
      assertFilterIndicator(1, 'Puck Head')
    })

    it('should remove the advisers filter', () => {
      assertRemovedFilterIndicator('@adviserFilter', 'Search advisers')
    })

    it('should filter by sector', () => {
      assertTypehead(
        '@sectorFilter',
        'Sector',
        'Search sectors',
        'adv',
        'Advanced Engineering'
      )
    })
    it('should remove the sector filter', () => {
      assertRemovedFilterIndicator('@sectorFilter', 'Search sectors')
    })

    it('should filter by country', () => {
      assertTypehead(
        '@countryFilter',
        'Country of origin',
        'Search countries',
        'sin',
        'Singapore'
      )
    })
    it('should remove the country filter', () => {
      assertRemovedFilterIndicator('@countryFilter', 'Search countries')
    })

    it('should filter by uk region', () => {
      assertTypehead(
        '@ukRegionFilter',
        'UK Region',
        'Search UK regions',
        'sou',
        'South East'
      )
    })
    it('should remove the country filter', () => {
      assertRemovedFilterIndicator('@countryFilter', 'Search countries')
    })

    it('should filter the estimated land date before', () => {
      cy.get('@estimatedDateBefore')
        .find('label')
        .should('have.text', 'Estimated land date before')
        .next()
        .click()
        .type('2020-01-01')
      assertFilterIndicator(1, 'Estimated land date before : 1 January 2020')
    })

    it('should remove the estimated land date before filter', () => {
      assertRemovedFilterIndicator('@estimatedDateBefore')
    })

    it('should filter the estimated land date after', () => {
      cy.get('@estimatedDateAfter')
        .find('label')
        .should('have.text', 'Estimated land date after')
        .next()
        .click()
        .type('2020-01-01')
      assertFilterIndicator(1, 'Estimated land date after : 1 January 2020')
    })

    it('should remove the estimated land date before filter', () => {
      assertRemovedFilterIndicator('@estimatedDateBefore')
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
          estimated_land_date_after: '2020-01-01',
        },
      })
    })
    it('should set the selected filter values and filter indicators', () => {
      assertFilterIndicator(1, 'Puck Head')
      cy.get('@adviserFilter').should('contain', 'Puck Head')
      assertFilterIndicator(2, 'Advanced Engineering')
      cy.get('@sectorFilter').should('contain', 'Advanced Engineering')
      assertFilterIndicator(3, 'United Kingdom')
      cy.get('@countryFilter').should('contain', 'United Kingdom')
      assertFilterIndicator(4, 'South East')
      cy.get('@ukRegionFilter').should('contain', 'South East')
      assertFilterIndicator(5, 'Estimated land date before : 1 January 2020')
      cy.get('@estimatedDateBefore')
        .find('input')
        .should('have.attr', 'value', '2020-01-01')
      assertFilterIndicator(6, 'Estimated land date after : 1 January 2020')
      cy.get('@estimatedDateAfter')
        .find('input')
        .should('have.attr', 'value', '2020-01-01')
    })

    it('should clear all filters', () => {
      cy.get('main article div + div button').as('filterIndicators')
      cy.get('@filterIndicators').should('have.length', 6)
      cy.get('main article div:first-child > button').click()
      cy.get('@filterIndicators').should('have.length', 0)
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
