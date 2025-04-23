const urls = require('../../../../../src/lib/urls')

describe('Dashboard - no taskss', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api-proxy/v4/search/task', {
      body: {
        count: 0,
        results: [],
      },
    }).as('apiRequest')
    cy.visit(urls.dashboard.myTasks())
    cy.wait('@apiRequest')
    cy.get('[data-test="tablist"]').as('tabList')
    cy.get('[data-test="tabpanel"]').as('tabPanel')
  })

  context('Tabbed navigation', () => {
    it("should have a heading of `You don't currently have any tasks`", () => {
      cy.get('@tabPanel')
        .find('h2')
        .should('have.text', "You don't currently have any tasks")
    })

    it('should have a heading paragraph', () => {
      cy.get('@tabPanel')
        .find('p')
        .eq(0)
        .should(
          'have.text',
          'You can create your own tasks or collaborate with colleagues and assign tasks to other users.'
        )
    })

    it('should have an image of a list of tasks', () => {
      cy.get('@tabPanel').find('img').should('have.attr', 'alt', '')
    })

    it('should have a button to add a task', () => {
      cy.get('@tabPanel')
        .find('a')
        .should('have.text', 'Add a task')
        .and('have.attr', 'href', urls.tasks.create())
    })
  })
})
