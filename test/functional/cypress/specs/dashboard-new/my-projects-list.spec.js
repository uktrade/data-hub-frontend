const urls = require('../../../../../src/lib/urls')

const projectID = '5d341b34-1fc8-4638-b4b1-a0922ebf401e'

describe('Dashboard - My projects list', () => {
  before(() => {
    cy.setUserFeatures(['personalised-dashboard'])
    cy.visit('/')
  })

  after(() => {
    cy.resetUser()
  })

  beforeEach(() => {
    cy.get('[data-test="projects-list-item"]').eq(0).as('firstListItem')
  })

  it('should contain a project title which links to the project', () => {
    cy.get('@firstListItem')
      .find('[data-test="project-header"]')
      .should('have.text', 'New metro system (legacy project)')
      .find('a')
      .should('have.attr', 'href', urls.investments.projects.details(projectID))
  })

  it('should contain a status tag', () => {
    cy.get('@firstListItem')
      .find('[data-test="project-status-tag"]')
      .should('have.text', 'Won')
  })

  it('should contain a button to view interactions', () => {
    cy.get('@firstListItem')
      .find('[data-test="add-interaction"]')
      .should('have.text', 'View interactions')
      .should(
        'have.attr',
        'href',
        urls.investments.projects.interactions.index(projectID)
      )
  })
})
