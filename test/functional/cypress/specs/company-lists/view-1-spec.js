const helper = require('./view-spec-helper')

describe('My companies lists', () => {
  before(() => {
    Cypress.Cookies.preserveOnce('datahub.sid')
    cy.visit('/')
  })

  Object.entries(helper.expectedLists).forEach(([name, expectedValues]) => {
    describe(`After selecting list "${name}"`, () => {
      before(() =>
        cy
          .contains('View list')
          .find('select')
          .select(name)
      )

      helper.describeSelectedList({ name, ...expectedValues })
    })
  })
})
