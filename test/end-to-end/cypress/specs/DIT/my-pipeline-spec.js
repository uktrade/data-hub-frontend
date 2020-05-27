const urls = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures/index')

const { lambdaPlc } = fixtures.company

const selectors = {
  tabPanel: '[data-auto-id="pipelineSubTabNav"] [role="tabpanel"]',
  form: {
    name: 'input[name="name"]',
    status: {
      prospect: 'input[value=leads]',
      active: 'input[value="in_progress"]',
      won: 'input[value="win"]',
    },
  },
}

function assertTabListItem(projectName) {
  cy.get(selectors.tabPanel)
    .find('ol > li')
    .should('have.length', 1)
    .contains(projectName)
}

describe('My Pipeline tab on the dashboard', () => {
  context('When there are no companies on the pipeline', () => {
    it('Should show an empty pipeline message for each status', () => {
      const tabs = [
        {
          url: urls.pipeline.index(),
          status: 'prospect',
        },
        {
          url: urls.pipeline.active(),
          status: 'active',
        },
        {
          url: urls.pipeline.won(),
          status: 'won',
        },
      ]

      tabs.forEach((tab) => {
        cy.visit(tab.url)
        cy.get(selectors.tabPanel).contains(
          `There are no companies in the ${tab.status} section of your pipeline`
        )
      })
    })
  })

  context('Adding a company as a lead', () => {
    const projectName = 'Test add project'

    it('Should add the company and return to the my pipeline tab', () => {
      cy.visit(urls.companies.pipelineAdd(lambdaPlc.id))

      cy.get(selectors.form.name).type(projectName)
      cy.get(selectors.form.status.prospect).click()
      cy.contains('button', 'Add').click()

      cy.url().should('include', urls.pipeline.index())
      assertTabListItem(projectName)
    })

    context('Edit a company on the pipeline', () => {
      context('Change the status from Prospect to Active', () => {
        it('Should change the status and go to the active tab', () => {
          cy.visit(urls.pipeline.index())

          cy.get(selectors.tabPanel)
            .contains('a', 'Edit')
            .click()

          cy.get(selectors.form.status.active).click()
          cy.contains('button', 'Update').click()

          cy.url().should('include', urls.pipeline.active())
          assertTabListItem(projectName)
        })
      })

      context(
        'Change the status from Active to Won and edit the project name',
        () => {
          it('Should change the values and go to the won tab', () => {
            const newProjectName = projectName + ' edited'

            cy.visit(urls.pipeline.active())

            cy.get(selectors.tabPanel)
              .contains('a', 'Edit')
              .click()

            cy.get(selectors.form.name)
              .clear()
              .type(newProjectName)
            cy.get(selectors.form.status.won).click()
            cy.contains('button', 'Update').click()

            cy.url().should('include', urls.pipeline.won())
            assertTabListItem(newProjectName)
          })
        }
      )
    })
  })
})
