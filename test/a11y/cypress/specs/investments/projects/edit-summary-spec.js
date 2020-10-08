const fixtures = require('../../../fixtures')
const urls = require('../../../../../../src/lib/urls')

const { greenTeaPlantation } = fixtures.investment.projects

describe('Investment projects - edit summary', () => {
  before(() => {
    cy.visit(urls.investments.projects.editDetails(greenTeaPlantation.id))
    cy.initA11y()
  })

  it('should not have any a11y violations', () => {
    cy.get('button[value=business_activities]').click()
    cy.runA11y()
  })
})
