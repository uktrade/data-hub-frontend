const helper = require('./view-spec-helper')

describe('My companies lists', () => {
  before(() => {
    Cypress.Cookies.preserveOnce('datahub.sid')
    cy.visit('/')
  })

  it('my companies lists tab should be selected', () =>
    cy.ariaTablistTabShouldBeSelected('Dashboard', 'My companies lists'))

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
