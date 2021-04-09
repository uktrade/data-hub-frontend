import urls from '../../../../../src/lib/urls'
import {
  investmentProjectFaker,
  investmentProjectListFaker,
  incompleteFieldOptionFaker,
} from '../../fakers/investment-projects'

describe('Dashboard - My projects list', () => {
  const project1 = investmentProjectFaker({
    stage: {
      id: '7606cc19-20da-4b74-aba1-2cec0d753ad8',
      name: 'Active',
    },
  })
  const project2 = investmentProjectFaker({
    incomplete_fields: [incompleteFieldOptionFaker()],
  })
  const project3 = investmentProjectFaker({
    name: 'My Special Project Name',
  })
  const wonProjects = investmentProjectListFaker(3, {
    stage: {
      id: '945ea6d1-eee3-4f5b-9144-84a75b71b8e6',
      name: 'Won',
    },
  })
  const otherProjects = investmentProjectListFaker(2)

  const myProjects = [
    project1,
    project2,
    project3,
    ...wonProjects,
    ...otherProjects,
  ]

  before(() => {
    cy.setUserFeatures(['personalised-dashboard'])
    cy.intercept('POST', '/api-proxy/v3/search/investment_project', {
      body: {
        count: myProjects.length,
        results: myProjects,
      },
    }).as('apiRequest')
    cy.visit('/')
    cy.wait('@apiRequest')
    cy.get('[data-test="tablist"] span:first-child button').click()
    cy.get('[data-test="projects-list-item"]').eq(0).as('firstListItem')
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
      .should('have.text', project1.name)
      .find('a')
      .should(
        'have.attr',
        'href',
        urls.investments.projects.details(project1.id)
      )
  })

  it('should contain a status tag', () => {
    cy.get('@firstListItem')
      .find('[data-test="project-stage-tag"]')
      .should('have.text', project1.stage.name)
  })

  it('should contain a button to view interactions', () => {
    cy.get('@firstListItem')
      .find('[data-test="add-interaction"]')
      .should('have.text', 'View interactions')
      .should(
        'have.attr',
        'href',
        urls.investments.projects.interactions.index(project1.id)
      )
  })
})
