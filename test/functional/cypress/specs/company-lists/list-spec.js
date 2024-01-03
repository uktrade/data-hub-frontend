import '../../../../cypress/support/commands'
import { exports } from './view-spec-helper'

const { assertAriaTablistTabSelected } = require('../../support/assertions')

describe('My companies lists', () => {
  before(() => {
    cy.visit('/')
  })

  it('my companies lists tab should be selected', () =>
    assertAriaTablistTabSelected('Dashboard', 'Company lists'))

  Object.entries(exports.expectedLists).forEach(([name, expectedValues]) => {
    describe(`After selecting list "${name}"`, () => {
      before(() => cy.contains('View list').find('select').select(name))

      exports.describeSelectedList({ name, ...expectedValues })
    })
  })
})
