import urls from '../../../../../src/lib/urls'

const ADVISER_ID = 'e83a608e-84a4-11e6-ae22-56b6b6499611'
const SECTOR_ID = 'af959812-6095-e211-a939-e4115bead28a'

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
      .as('adviserTypeaheadFilter')
      .next()
      .as('sectorFilter')
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
      cy.get('@adviserTypeaheadFilter')
        .should('contain', 'Search advisers')
        .find('label')
        .should('have.text', 'Advisers')

      selectAdvisersTypeahead('@adviserTypeaheadFilter', 'puc')
      cy.get('@adviserTypeaheadFilter').should('contain', 'Puck Head')
      assertFilterIndicator(1, 'Puck Head')
    })

    it('should remove the advisers filter', () => {
      assertRemovedFilterIndicator('@adviserTypeaheadFilter', 'Search advisers')
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
          adviser: ADVISER_ID,
          sector_descends: SECTOR_ID,
          estimated_land_date_before: '2020-01-01',
          estimated_land_date_after: '2020-01-01',
        },
      })
    })
    it('should set the selected filter values and filter indicators', () => {
      assertFilterIndicator(1, 'Puck Head')
      cy.get('@adviserTypeaheadFilter').should('contain', 'Puck Head')
      assertFilterIndicator(2, 'Advanced Engineering')
      cy.get('@sectorFilter').should('contain', 'Advanced Engineering')
      assertFilterIndicator(3, 'Estimated land date before : 1 January 2020')
      cy.get('@estimatedDateBefore')
        .find('input')
        .should('have.attr', 'value', '2020-01-01')
      assertFilterIndicator(4, 'Estimated land date after : 1 January 2020')
      cy.get('@estimatedDateAfter')
        .find('input')
        .should('have.attr', 'value', '2020-01-01')
    })

    it('should clear all filters', () => {
      cy.get('main article div + div button').as('filterIndicators')
      cy.get('@filterIndicators').should('have.length', 4)
      cy.get('main article div:first-child > button').click()
      cy.get('@filterIndicators').should('have.length', 0)
    })
  })
})

//   it('should filter by country', () => {
//     const country = selectors.filter.investments.country
//     const { typeahead } = selectors.filter

//     cy.get(typeahead(country).selectedOption)
//       .click()
//       .get(typeahead(country).textInput)
//       .type('United Kingdom')
//       .get(typeahead(country).options)
//       .should('have.length', 1)
//       .get(typeahead(country).textInput)
//       .type('{enter}')
//       .type('{esc}')

//     cy.wait('@filterResults').then((xhr) => {
//       expect(xhr.url).to.contain('country=80756b9a-5d95-e211-a939-e4115bead28a')
//     })
//   })

//   it('should filter by uk region', () => {
//     const { typeahead } = selectors.filter
//     const { ukRegion } = selectors.filter.investments
//     cy.get(typeahead(ukRegion).selectedOption)
//       .click()
//       .get(typeahead(ukRegion).textInput)
//       .type('North East')
//       .get(typeahead(ukRegion).options)
//       .should('have.length', 1)
//       .get(typeahead(ukRegion).textInput)
//       .type('{enter}')
//       .type('{esc}')

//     cy.wait('@filterResults').then((xhr) => {
//       expect(xhr.url).to.contain(
//         'uk_region_location=814cd12a-6095-e211-a939-e4115bead28a'
//       )
//     })

//     cy.get(selectors.entityCollection.entities)
//       .children()
//       .should('have.length', 2)
//   })
// })
