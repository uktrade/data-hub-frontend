const urls = require('../../../../../src/lib/urls')
const { assertBreadcrumbs } = require('../../support/assertions')
const {
  assertPaginationSummary,
  assertBadgeNotPresent,
} = require('../../support/collection-list-assertions')

const assertChanges = (itemNo, field, oldVal, newVal) => {
  it(`should display the changes to "${field}"`, () => {
    cy.get(`@listItem${itemNo}`)
      .should('contain', field)
      .and('contain', oldVal)
      .and('contain', newVal)
  })
}

describe('Contact audit history', () => {
  context('when viewing the audit history for a contact', () => {
    beforeEach(() => {
      cy.visit(urls.contacts.audit('64f85710-eabd-4479-829c-1fd47e3595d0'))
      cy.get('[data-test="collection-item"]').as('collectionItems')
      cy.get('@collectionItems').eq(0).as('listItem1')
      cy.get('@collectionItems').eq(1).as('listItem2')
      cy.get('@collectionItems').eq(2).as('listItem3')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Contacts: urls.contacts.index(),
        'Joseph Woof': urls.contacts.contact(
          '5e75d636-1d24-416a-aaf0-3fb220d594ce'
        ),
        'Audit history': null,
      })
    })

    it('should render the subheading', () => {
      cy.get('[data-test=audit-header]')
        .should('exist')
        .should('have.text', 'Audit history')
    })

    it('should render the result counter', () => {
      cy.get('[data-test="collection-header-name"]')
        .should('exist')
        .should('have.text', '42 contact changes')
    })

    it('should render the page counter', () => {
      assertPaginationSummary('Page 1 of 5')
    })

    it('should render the pagination component', () => {
      cy.get('[data-test=pagination]')
        .should('exist')
        .should('have.attr', 'data-total-pages', 5)
    })

    it('should display the correct number of entries', () => {
      cy.get('@collectionItems').should('have.length', 10)
    })

    context('when rendering an entry where no changes were made', () => {
      it('should only render the updated on and no changes text', () => {
        cy.get('@listItem1')
          .should('exist')
          .should('contain', 'Updated on')
          .should('contain', '19 May 2022, 1:56pm by Joseph Woof')
          .find('[data-test="metadata"]')
          .find('[data-test="metadata-label"]')
          .should(
            'contain',
            'No changes were made to the contact in this update'
          )
      })

      it('should not render a badge', () => {
        assertBadgeNotPresent('@listItem1')
      })
    })

    context('when rendering an entry where changes were made', () => {
      it('should render the adviser name and timestamp', () => {
        cy.get('@listItem2')
          .should('exist')
          .should('contain', 'Updated on 18 May 2022, 10:55am by Joseph Woof')
      })

      assertChanges(2, 'Archived', 'Archived', 'Not archived')
      assertChanges(2, 'Archived reason', 'Left the company', 'Not set')
      assertChanges(
        2,
        'Is the contact’s work address the same as the company address?',
        'Yes',
        'No'
      )
      assertChanges(2, 'Is this person a primary contact?', 'No', 'Yes')
      assertChanges(2, 'First name', 'Andras', 'Andreas')
      assertChanges(2, 'Last name', 'Old last name', 'New last name')
      assertChanges(2, 'Job title', 'Old job title', 'New job title')
      assertChanges(2, 'Full telephone number', 'Not set', '01234567890')
      assertChanges(2, 'Email', 'Not set', 'test@example.com')
      assertChanges(2, 'Address line 1', 'Not set', 'Test Line 1')
      assertChanges(2, 'Address line 2', 'Not set', 'Test Line 2')
      assertChanges(2, 'Address town', 'Not set', 'Test Town')
      assertChanges(2, 'Address county', 'Not set', 'Test county')
      assertChanges(2, 'Address country', 'Not set', 'Baker Island')
      assertChanges(2, 'Address postcode', 'Not set', 'TE5 5ST')
      assertChanges(2, 'Notes', 'Not set', 'Notes about the contact')

      it('should display the correct number of changes in the badge', () => {
        cy.get('@listItem2')
          .find('[data-test="badge"]')
          .should('contain', '16 changes')
      })
    })

    it('should display the correct badge for an item with single change', () => {
      cy.get('@listItem3')
        .find('[data-test="badge"]')
        .should('contain', '1 change')
    })
  })

  context('when viewing an audit history with no entries', () => {
    beforeEach(() => {
      cy.visit(urls.contacts.audit())
    })

    it('should render the subheading', () => {
      cy.get('[data-test=audit-header]')
        .should('exist')
        .should('have.text', 'Audit history')
    })

    it('should render the result counter', () => {
      cy.get('[data-test="collection-header-name"]')
        .should('exist')
        .should('have.text', '0 contact changes')
    })

    it('should not render the page counter', () => {
      cy.get('[data-test=pagination-summary]').should('not.exist')
    })

    it('should not render the pagination component', () => {
      cy.get('[data-test=pagination]').should('not.exist')
    })

    it('should not render any entries', () => {
      cy.get('[data-test="collection-item"]').should('not.exist')
    })
  })
})
