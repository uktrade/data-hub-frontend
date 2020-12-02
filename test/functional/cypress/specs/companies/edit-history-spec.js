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
    cy.visit(urls.companies.editHistory.index(fixtures.company.venusLtd.id))
  })

  context('when viewing the "Edit History" page', () => {
    it('should render the header', () => {
      assertLocalHeader('Edit History')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        'Venus Ltd': urls.companies.detail(fixtures.company.venusLtd.id),
        'Business details': urls.companies.businessDetails(
          fixtures.company.venusLtd.id
        ),
        'Edit History': null,
      })
    })
  })

  context('when viewing an address change', () => {
    it('should display the date when the update occurred and by whom', () => {
      cy.get(editHistory.change(1).updated).should(
        'have.text',
        'Updated on 10 Dec 2019, 5:58pm by Paul Gain'
      )
    })

    it('should display the changes to "Address line 1"', () => {
      assertChanges(
        editHistory.change(1).table(2),
        'Address line 1',
        '14 Wharf Road',
        '16 Wharf Road'
      )
    })

    it('should display the changes to "Address line 2 (optional)"', () => {
      assertChanges(
        editHistory.change(1).table(3),
        'Address line 2 (optional)',
        'Not set',
        'Westminster'
      )
    })

    it('should display the changes to "Address town"', () => {
      assertChanges(
        editHistory.change(1).table(4),
        'Address town',
        'Brentwood',
        'London'
      )
    })

    it('should display the changes to "Address county"', () => {
      assertChanges(
        editHistory.change(1).table(5),
        'Address county',
        'Essex',
        'Greater London'
      )
    })

    it('should display the changes to "Address postcode"', () => {
      assertChanges(
        editHistory.change(1).table(6),
        'Address postcode',
        'CM14 4LQ',
        'SW1H 9AJ'
      )
    })
  })

  context('when viewing a sector, region and description change', () => {
    it('should display the changes to "Business description (optional)"', () => {
      assertChanges(
        editHistory.change(2).table(2),
        'Business description (optional)',
        'Not set',
        'Superior editing services'
      )
    })

    it('should display the changes to "DIT sector"', () => {
      assertChanges(
        editHistory.change(2).table(3),
        'DIT sector',
        'Biotechnology and Pharmaceuticals',
        'Airports'
      )
    })

    it('should display the changes to "DIT region"', () => {
      assertChanges(
        editHistory.change(2).table(4),
        'DIT region',
        'South East',
        'London'
      )
    })
  })

  context('when viewing a "Trading name" change', () => {
    it('should display the changes to "Trading name(s)"', () => {
      assertChanges(
        editHistory.change(3).table(2),
        'Trading name(s)',
        'Not set',
        'Edit History Enterprises'
      )
    })
  })

  context('when the user does not have a first or last name', () => {
    it("should display the user's email address", () => {
      cy.get(editHistory.change(4).updated).should(
        'have.text',
        'Updated on 10 Dec 2019, 6:01pm by paul.gain@digital.trade.gov.uk'
      )
    })
  })

  context('when the user is null it must be an "Automatic update"', () => {
    it('should display that is was automatically updated', () => {
      cy.get(editHistory.change(5).updated).should(
        'have.text',
        'Automatically updated on 9 Jan 2020, 12:00am'
      )
    })

    it('should update the turnover', () => {
      assertChanges(
        editHistory.change(5).table(2),
        'Turnover',
        '£1,900,000',
        '£1,400,000'
      )
    })

    it('should show whether or not the turnover was estimated', () => {
      assertChanges(
        editHistory.change(5).table(3),
        'Is turnover estimated',
        'Yes',
        'Not set'
      )
    })

    it('should show whether or not the number of employees was estimated', () => {
      assertChanges(
        editHistory.change(5).table(4),
        'Is number of employees estimated',
        'Not set',
        'Yes'
      )
    })
  })

  context('when the user saves without making changes', () => {
    it('should display a message', () => {
      cy.get(editHistory.change(6).noChanges).should(
        'have.text',
        'No changes were made to business details in this update'
      )
    })
  })

  context('when the user updates "Number of employees (optional)"', () => {
    it('should display the number of employees', () => {
      assertChanges(
        editHistory.change(7).table(2),
        'Number of employees (optional)',
        '98771',
        '98772'
      )
    })
  })

  context('when the user has unarchived a company', () => {
    it('should show the company is no longer archived', () => {
      assertChanges(
        editHistory.change(8).table(2),
        'Archived',
        'Archived',
        'Not Archived'
      )
    })

    it('should show the reason why it was unarchived', () => {
      assertChanges(
        editHistory.change(8).table(3),
        'Archived reason',
        'Archived by mistake',
        'Not set'
      )
    })
  })

  context('when the user has archived a company', () => {
    it('should show the company is archived', () => {
      assertChanges(
        editHistory.change(9).table(2),
        'Archived',
        'Not Archived',
        'Archived'
      )
    })

    it('should show the reason why it was archived', () => {
      assertChanges(
        editHistory.change(9).table(3),
        'Archived reason',
        'Not set',
        'Company is dissolved'
      )
    })
  })

  context('when a company becomes a "Global Ultimate"', () => {
    it('should display the changes to the "Global Ultimate Duns Number"', () => {
      assertChanges(
        editHistory.change(5).table(5),
        'Global Ultimate Duns Number',
        'Not set',
        '561652707'
      )
    })
  })

  context('when there are more than 10 entries', () => {
    it('should display the pagination', () => {
      cy.get('[data-test="page-number"]').should('be.visible', true)
    })

    it('should display the pagination', () => {
      cy.get('[data-test="page-number"]').click()
      cy.url().should('include', '?page=2')
    })
  })
})
