import { assertLocalHeader, assertBreadcrumbs } from '../../support/assertions'
import {
  assertBadge,
  assertBadgeNotPresent,
} from '../../support/collection-list-assertions'
import fixtures from '../../fixtures'
import urls from '../../../../../src/lib/urls'
import { NOT_SET } from '../../../../../src/client/components/AuditHistory/constants'

const assertChanges = (itemNo, field, oldVal, newVal) => {
  it(`should display the changes to "${field}"`, () => {
    cy.get(`@listItem${itemNo}`)
      .should('contain', field)
      .and('contain', oldVal)
      .and('contain', newVal)
  })
}

describe('Edit History', () => {
  beforeEach(() => {
    cy.visit(urls.companies.editHistory.index(fixtures.company.venusLtd.id))
    cy.get('[data-test="collection-item"]').as('collectionItems')
    cy.get('@collectionItems').eq(0).as('listItem1')
    cy.get('@collectionItems').eq(1).as('listItem2')
    cy.get('@collectionItems').eq(2).as('listItem3')
    cy.get('@collectionItems').eq(3).as('listItem4')
    cy.get('@collectionItems').eq(4).as('listItem5')
    cy.get('@collectionItems').eq(5).as('listItem6')
    cy.get('@collectionItems').eq(6).as('listItem7')
    cy.get('@collectionItems').eq(7).as('listItem8')
    cy.get('@collectionItems').eq(8).as('listItem9')
    cy.get('@collectionItems').eq(9).as('listItem10')
  })

  context('when viewing the "Edit History" page', () => {
    it('should render the header', () => {
      assertLocalHeader('Edit history')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        Companies: urls.companies.index(),
        'Venus Ltd': urls.companies.detail(fixtures.company.venusLtd.id),
        'Business details': urls.companies.businessDetails(
          fixtures.company.venusLtd.id
        ),
        'Edit history': null,
      })
    })

    it('should render the collection header', () => {
      cy.get('[data-test="collection-header-name"]')
        .should('exist')
        .should('contain', '11 changes to company business details')
    })

    it('should render the correct badges', () => {
      assertBadge('@listItem1', '5 changes')
      assertBadge('@listItem3', '1 change')
      assertBadgeNotPresent('@listItem4')
    })
  })

  context('when viewing an address change', () => {
    it('should display the date when the update occurred and by whom', () => {
      cy.get('@listItem1').should(
        'contain',
        'Updated on 10 Dec 2019, 5:58pm by Paul Gain'
      )
    })

    assertChanges(1, 'Address line 1', '14 Wharf Road', '16 Wharf Road')
    assertChanges(1, 'Address line 2', NOT_SET, 'Westminster')
    assertChanges(1, 'Address town', 'Brentwood', 'London')
    assertChanges(1, 'Address county', 'Essex', 'Greater London')
    assertChanges(1, 'Address postcode', 'CM14 4LQ', 'SW1H 9AJ')
  })

  context('when viewing a sector, region and description change', () => {
    assertChanges(
      2,
      'Business description',
      NOT_SET,
      'Superior editing services'
    )

    assertChanges(
      2,
      'DBT sector',
      'Biotechnology and Pharmaceuticals',
      'Airports'
    )

    assertChanges(2, 'DBT region', 'South East', 'London')
  })

  context('when viewing a "Trading name" change', () => {
    assertChanges(3, 'Trading name(s)', NOT_SET, 'Edit History Enterprises')
  })

  context('when the user does not have a first or last name', () => {
    it("should display the user's email address", () => {
      cy.get('@listItem4').should(
        'contain',
        'Updated on 10 Dec 2019, 6:01pm by paul.gain@digital.trade.gov.uk'
      )
    })
  })

  context('when the user is null it must be an "Automatic update"', () => {
    it('should display that is was automatically updated', () => {
      cy.get('@listItem5').should(
        'contain',
        'Automatically updated on 9 Jan 2020, 12:00am'
      )
    })

    assertChanges(5, 'Turnover', '£2,400,000', '£1,800,000')
    assertChanges(5, 'Is turnover estimated', 'Yes', NOT_SET)
    assertChanges(5, 'Is number of employees estimated', NOT_SET, 'Yes')
  })

  context('when the user saves without making changes', () => {
    it('should display a message', () => {
      cy.get('@listItem6').should(
        'contain',
        'No changes were made to business details in this update'
      )
    })
  })

  context('when the user updates "Number of employees"', () => {
    assertChanges(7, 'Number of employees', '98771', '98772')
  })

  context('when the user has unarchived a company', () => {
    assertChanges(8, 'Archived', 'Archived', 'Not Archived')
    assertChanges(8, 'Archived reason', 'Archived by mistake', NOT_SET)
  })

  context('when the user has archived a company', () => {
    assertChanges(9, 'Archived', 'Not Archived', 'Archived')
    assertChanges(9, 'Archived reason', NOT_SET, 'Company is dissolved')
  })

  context('when a company becomes a "Global Ultimate"', () => {
    assertChanges(5, 'Global Ultimate Duns Number', NOT_SET, '561652707')
  })

  context('when viewing a HQ change', () => {
    assertChanges(7, 'Headquarter type', 'European HQ', 'UK HQ')
    assertChanges(8, 'Headquarter type', 'Global HQ', 'European HQ')
    assertChanges(10, 'Headquarter type', NOT_SET, 'Global HQ')
  })

  context('when there are more than 10 entries', () => {
    it('should display the pagination', () => {
      cy.get('[data-page-number="2"]').should('be.visible', true)
      cy.get('[data-test="pagination-summary"]').should(
        'contain',
        'Page 1 of 2'
      )
    })

    it('should render the next page when the button is clicked', () => {
      cy.get('[data-page-number="2"]').click()
      cy.url().should('include', '?page=2')
      cy.get('[data-test="pagination-summary"]').should(
        'contain',
        'Page 2 of 2'
      )
    })
  })
})
