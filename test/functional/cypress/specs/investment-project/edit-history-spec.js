const {
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')
const fixtures = require('../../fixtures')
const { editHistory } = require('../../../../selectors')
const urls = require('../../../../../src/lib/urls')

const assertChanges = (table, caption, beforeChange, afterChange) => {
  cy.get(table.caption).should('have.text', caption)
  cy.get(table.beforeChangeText).should(
    'have.text',
    'Information before change'
  )
  cy.get(table.beforeChangeValue).should('have.text', beforeChange)
  cy.get(table.afterChangeText).should('have.text', 'Information after change')
  cy.get(table.afterChangeValue).should('have.text', afterChange)
}

describe('Edit History', () => {
  before(() => {
    cy.visit(
      urls.investments.editHistory.index(fixtures.investment.newHotelFdi.id)
    )
  })

  context('when viewing the "Edit History" page', () => {
    it('should render the header', () => {
      assertLocalHeader('Edit History')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Investments: urls.investments.index(),
        Projects: urls.investments.projects.index(),
        'New hotel (FDI)': urls.investments.projects.project(
          fixtures.investment.newHotelFdi.id
        ),
        'Edit History': null,
      })
    })
  })

  context('when viewing a change', () => {
    it('should display the date when the update occurred and by whom', () => {
      cy.get(editHistory.change(1).updated).should(
        'have.text',
        'Updated on 29 Apr 2020, 4:14pm by Eloisa Ward'
      )
    })

    it('should display the changes for a boolean change', () => {
      assertChanges(
        editHistory.change(1).table(2),
        'Site decided',
        'False',
        'True'
      )
    })

    it('should display the changes for a text change', () => {
      assertChanges(
        editHistory.change(1).table(3),
        'Address 1',
        '10 Main Road',
        '20 Main Road'
      )
    })

    it('should display the changes for a previously empty field', () => {
      assertChanges(
        editHistory.change(1).table(4),
        'Address 2',
        'Not set',
        'Redford'
      )
    })

    it('should display the changes for a field allowing many options', () => {
      assertChanges(
        editHistory.change(1).table(5),
        'Delivery partners',
        'New Anglia LEP' + 'North Eastern LEP',
        'North Eastern LEP' + 'Northern Ireland (disabled)'
      )
    })
  })

  context('when viewing a change made by a user with no recorded name', () => {
    it('should display an email instead of user name', () => {
      cy.get(editHistory.change(2).updated).should(
        'have.text',
        'Updated on 29 Apr 2020, 4:13pm by Stanford.Mayert@gmail.coz'
      )
    })
  })

  context('when viewing a change log where no changes were recorded', () => {
    it('should display expected text', () => {
      cy.get(editHistory.change(3).noChanges).should(
        'have.text',
        'No changes were made to the project in this update'
      )
    })
  })
})
