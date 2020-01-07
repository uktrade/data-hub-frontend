import { assertBreadcrumbs } from '../../support/assertions'

const selectors = require('../../../../selectors')
const fixtures = require('../../fixtures')

describe('Contacts Collections', () => {
  before(() => {
    cy.visit('/contacts/?sortby=dummy')
  })

  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: '/',
      Contacts: null,
    })
  })

  it('should display a list of contacts', () => {
    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 100)
  })

  it('should contain contacts badge', () => {
    cy.get(selectors.entityCollection.entity(1)).should('contain', 'Primary')
  })

  it('should contain contacts details', () => {
    cy.get(selectors.entityCollection.entity(1))
      .should('contain', 'Royal Haskoning UK Ltd')
      .and('contain', 'Business Group Director, UK')
      .and('contain', 'Environment and Water')
      .and('contain', 'United Kingdom')
      .and('contain', 'East of England')
      .and('contain', '(44) 01733334455')
      .and('contain', 'steven.trewhella@rhdhv.com')
  })
})

describe('Company Contacts Collections', () => {
  before(() => {
    cy.visit(`/companies/${fixtures.default.id}/contacts?sortby=collectionTest`)
  })

  it('should display a list of contacts', () => {
    cy.get(selectors.entityCollection.entities)
      .children()
      .should('have.length', 9)
  })

  it('should contain contacts badge', () => {
    cy.get(selectors.entityCollection.entity(1)).should('contain', 'Primary')
  })

  it('should contain contacts details', () => {
    cy.get(selectors.entityCollection.entity(1))
      .should('contain', 'Steven Trewhella')
      .and('contain', 'Business Group Director, UK')
      .and('contain', 'Environment and Water')
      .and('contain', 'United Kingdom')
      .and('contain', 'East of England')
      .and('contain', '(44) 01733334455')
      .and('contain', 'steven.trewhella@rhdhv.com')
  })
})
