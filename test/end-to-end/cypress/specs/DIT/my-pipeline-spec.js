const urls = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')
const formSelectors = require('../../../../selectors/pipeline-form')

const tabPanelSelector = '[data-test="pipelineSubTabNav"] [role="tabpanel"]'

function addAssertion(assertion) {
  return (content) => ({
    assertion,
    content,
  })
}

function assertTabListItem({ contain = [], notContain = [] }) {
  const checks = [
    ...contain.map(addAssertion('contain')),
    ...notContain.map(addAssertion('not.contain')),
  ]

  checks.reduce(
    ($tab, { assertion, content }) => $tab.should(assertion, content),
    cy.get(tabPanelSelector).find('ol > li').should('have.length', 1)
  )
}

describe('My Pipeline tab on the dashboard', () => {
  context('When there are no companies on the pipeline', () => {
    it('Should show an empty pipeline message for each status', () => {
      const tabs = [
        {
          url: urls.pipeline.index(),
        },
        {
          url: urls.pipeline.active(),
        },
        {
          url: urls.pipeline.won(),
        },
      ]

      tabs.forEach((tab) => {
        cy.visit(tab.url)
        cy.contains(
          'My pipeline allows you to track the progress of your projects.'
        )
          .contains('a', 'help centre article')
          .should('have.attr', 'href', urls.external.helpCentre.pipeline())
      })
    })
  })

  context('Adding a company as a lead', () => {
    const projectName = 'Test add project'
    const company = fixtures.company.create.lambda()
    const contact = fixtures.contact.create(company.pk)

    before(() => {
      cy.loadFixture([company])
      cy.loadFixture([contact])
    })

    it('Should add the company and return to the my pipeline tab', () => {
      cy.visit(urls.companies.pipelineAdd(company.pk))

      cy.get(formSelectors.name).type(projectName)
      cy.get(formSelectors.status.prospect).click()
      cy.contains('button', 'Create project').click()

      cy.url().should('include', urls.pipeline.index())
      assertTabListItem({ contain: [projectName] })
    })

    context('Edit a company on the pipeline', () => {
      context('Change the status from Prospect to Active', () => {
        it('Should change the status and go to the active tab', () => {
          cy.visit(urls.pipeline.index())

          cy.get(tabPanelSelector).contains('a', 'Edit').click()

          cy.get(formSelectors.status.active).click()
          cy.contains('button', 'Save').click()

          cy.url().should('include', urls.pipeline.active())
          assertTabListItem({ contain: [projectName] })
        })
      })

      context(
        'Change the status from Active to Won and edit the project name',
        () => {
          it('Should change the values and go to the won tab', () => {
            const newProjectName = projectName + ' edited'

            cy.visit(urls.pipeline.active())

            cy.get(tabPanelSelector).contains('a', 'Edit').click()

            cy.get(formSelectors.name).clear().type(newProjectName)
            cy.get(formSelectors.status.won).click()
            cy.contains('button', 'Save').click()

            cy.url().should('include', urls.pipeline.won())
            assertTabListItem({ contain: [newProjectName] })
          })
        }
      )

      context('Add the optional fields', () => {
        it('should save the values and go to the won tab', () => {
          cy.visit(urls.pipeline.won())

          cy.get(tabPanelSelector).contains('a', 'Edit').click()

          cy.get(formSelectors.likelihood.low).click()
          cy.get(formSelectors.fields.sector).selectTypeaheadOption('Aero')
          cy.get(formSelectors.fields.contacts).selectTypeaheadOption('Johnny')
          cy.get(formSelectors.value).type('1000')
          cy.get(formSelectors.fields.expectedWinDate)
            .find('input')
            .then((element) => {
              cy.wrap(element[0]).type('06')
              cy.wrap(element[1]).type('2025')
            })

          cy.contains('button', 'Save').click()

          cy.url().should('include', urls.pipeline.won())
          assertTabListItem({
            contain: [
              projectName + ' edited',
              'Export sectorAerospace',
              'Company contactJohnny Cakeman',
              'Potential export value£1,000',
              'Expected date for winJun 2025',
            ],
          })
        })
      })

      context('Edit optional fields to remove the values', () => {
        it('Should remove the values and go to the won tab', () => {
          cy.visit(urls.pipeline.won())

          cy.get(tabPanelSelector).contains('a', 'Edit').click()

          cy.get(formSelectors.fields.sector).find('input').clear().blur()
          cy.get(formSelectors.fields.contacts).removeAllTypeaheadValues()
          cy.get(formSelectors.value).clear()
          cy.get(formSelectors.fields.expectedWinDate).find('input').clear()

          cy.contains('button', 'Save').click()

          cy.url().should('include', urls.pipeline.won())
          assertTabListItem({
            contain: [projectName + ' edited', 'LOW'],
            notContain: [
              'Export sector',
              'Company contact',
              'Potential export value',
              'Expected date for win',
            ],
          })
        })
      })
    })
  })
})
