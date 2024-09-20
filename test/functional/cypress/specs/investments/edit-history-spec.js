import { assertLocalHeader, assertBreadcrumbs } from '../../support/assertions'
import {
  assertBadge,
  assertBadgeNotPresent,
} from '../../support/collection-list-assertions'
import fixtures from '../../fixtures'
import urls from '../../../../../src/lib/urls'

const assertChanges = (itemNo, field, oldVal, newVal) => {
  cy.get(`@listItem${itemNo}`)
    .should('contain', field)
    .and('contain', oldVal)
    .and('contain', newVal)
}

describe('Edit History', () => {
  beforeEach(() => {
    cy.visit(
      urls.investments.editHistory.index(fixtures.investment.newHotelFdi.id)
    )
    cy.get('[data-test="collection-item"]').as('collectionItems')
    cy.get('@collectionItems').eq(0).as('listItem1')
    cy.get('@collectionItems').eq(1).as('listItem2')
    cy.get('@collectionItems').eq(2).as('listItem3')
    cy.get('@collectionItems').eq(3).as('listItem4')
  })

  context('when viewing the "Edit History" page', () => {
    it('should render the header', () => {
      assertLocalHeader('Edit history')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        Investments: urls.investments.index(),
        Projects: urls.investments.projects.index(),
        'New hotel (FDI)': urls.investments.projects.details(
          fixtures.investment.newHotelFdi.id
        ),
        'Edit history': null,
      })
    })

    it('should render the collection header', () => {
      cy.get('[data-test="collection-header-name"]')
        .should('exist')
        .should('contain', '4 project changes')
    })

    it('should render the correct badges', () => {
      assertBadge('@listItem1', '8 changes')
      assertBadgeNotPresent('@listItem3')
    })
  })

  context('when viewing a change', () => {
    it('should display the date when the update occurred and by whom', () => {
      cy.get('@listItem1').should(
        'contain',
        'Updated on 29 Apr 2020, 4:14pm by Eloisa Ward'
      )
    })

    it('should display the changes for a boolean change', () => {
      assertChanges(1, 'Site decided', 'No', 'Yes')
    })

    it('should display the changes for a text change', () => {
      assertChanges(1, 'Address line 1', '10 Main Road', '20 Main Road')
    })

    it('should display the changes for a previously empty field', () => {
      assertChanges(1, 'Address line 2', 'Not set', 'Redford')
    })

    it('should display the changes for a field allowing many options', () => {
      assertChanges(
        1,
        'Delivery partners',
        'New Anglia LEP, North Eastern LEP',
        'North Eastern LEP, Northern Ireland (disabled)'
      )
    })

    it('should display the changes for a currency field', () => {
      assertChanges(4, 'Total investment', undefined, '£123,456,789')
    })
  })

  context('when viewing a change made by a user with no recorded name', () => {
    it('should display an email instead of user name', () => {
      cy.get('@listItem2').should(
        'contain',
        'Updated on 29 Apr 2020, 4:13pm by Stanford.Mayert@gmail.coz'
      )
    })
  })

  context('when viewing a change log where no changes were recorded', () => {
    it('should display expected text', () => {
      cy.get('@listItem3').should(
        'contain',
        'No changes were made to the project in this update'
      )
    })
  })
})
