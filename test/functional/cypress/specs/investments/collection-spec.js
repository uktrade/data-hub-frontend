// const selectors = require('../../../../selectors')
// const {
//   assertTabbedLocalNav,
//   assertBreadcrumbs,
// } = require('../../support/assertions')
// const { dashboard, investments } = require('../../../../../src/lib/urls')

// describe('Investment Project Collections', () => {
//   before(() => {
//     cy.visit(investments.projects.index())
//   })

//   it('should render breadcrumbs', () => {
//     assertBreadcrumbs({
//       Home: dashboard(),
//       Investments: investments.index(),
//       Projects: null,
//     })
//   })

//   it('should render the local navigation', () => {
//     assertTabbedLocalNav('Projects')
//     assertTabbedLocalNav('Investor profiles')
//   })

//   it('should display a list of investments', () => {
//     cy.get(selectors.entityCollection.entities)
//       .children()
//       .should('have.length', 10)
//   })

//   it('should contain investment badge', () => {
//     cy.get(selectors.entityCollection.entityBadge(1)).should('contain', 'Won')
//     cy.get(selectors.entityCollection.entityBadge(1)).should('contain', 'FDI')
//     cy.get(selectors.entityCollection.entityBadge(1)).should(
//       'contain',
//       'ongoing'
//     )
//   })

//   it('should contain investor and sector', () => {
//     cy.get(selectors.entityCollection.entity(1))
//       .should('contain', 'Venus Ltd')
//       .and('contain', 'Renewable Energy : Wind : Onshore')
//   })
// })
