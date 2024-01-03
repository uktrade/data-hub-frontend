const urls = require('../../../../../src/lib/urls')
const { assertBreadcrumbs } = require('../../support/assertions')
const {
  assertPaginationSummary,
} = require('../../support/collection-list-assertions')

describe('Contact audit history', () => {
  context('when viewing the audit history for a contact', () => {
    before(() => {
      cy.visit(urls.contacts.audit('64f85710-eabd-4479-829c-1fd47e3595d0'))
    })

    beforeEach(() => {
      cy.get('[data-test="collection-item"]').as('collectionItems')
      cy.get('@collectionItems').eq(0).as('firstListItem')
      cy.get('@collectionItems').eq(1).as('secondListItem')
      cy.get('@collectionItems').eq(2).as('thirdListItem')
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
      cy.get('[data-test=audit-results]')
        .should('exist')
        .should('have.text', '42 results')
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

    context('when rendering an entry wehere no changes were made', () => {
      it('should render only the timestamp and advisor fields', () => {
        cy.get('@firstListItem')
          .should('exist')
          .should('contain', '19 May 2022, 1:56pm')
          .find('[data-test="metadata"]')
          .find('[data-test="metadata-item"]')
          .should('contain', 'Adviser Joseph Woof')
          .should('not.contain', 'Fields')
      })

      it('should render the correct badge', () => {
        cy.get('@firstListItem')
          .find('[data-test="badge"]')
          .should('contain', 'No changes saved')
      })
    })

    context('when rendering an entry where changes were made', () => {
      it('should render all fields', () => {
        cy.get('@secondListItem')
          .should('exist')
          .should('contain', '18 May 2022, 10:55am')
          .find('[data-test="metadata"]')
          .find('[data-test="metadata-item"]')
          .should('contain', 'Adviser Joseph Woof')
          .should(
            'contain',
            'Fields Archived status, Archive date, Archived reason, Archived by'
          )
      })

      it('should display the correct number of changes in the badge', () => {
        cy.get('@secondListItem')
          .find('[data-test="badge"]')
          .should('contain', '4 changes')
      })
    })

    it('should display the correct badge for an item with single change', () => {
      cy.get('@thirdListItem')
        .find('[data-test="badge"]')
        .should('contain', '1 change')
    })
  })

  context('when viewing an audit history with less than 10 entries', () => {
    before(() => {
      cy.visit(urls.contacts.audit('e74f0a25-aeee-48bd-a483-ac29c47e81a4'))
    })

    beforeEach(() => {
      cy.get('[data-test="collection-item"]').as('collectionItems')
      cy.get('@collectionItems').eq(0).as('firstListItem')
      cy.get('@collectionItems').eq(1).as('secondListItem')
    })

    it('should render the subheading', () => {
      cy.get('[data-test=audit-header]')
        .should('exist')
        .should('have.text', 'Audit history')
    })

    it('should render the result counter', () => {
      cy.get('[data-test=audit-results]')
        .should('exist')
        .should('have.text', '2 results')
    })

    it('should render the page counter', () => {
      cy.get('[data-test=pagination-summary]')
        .should('exist')
        .should('have.text', 'Page 1 of 1')
    })

    it('should not render the pagination component', () => {
      cy.get('[data-test=pagination]').should('not.exist')
    })

    it('should display the correct number of entries', () => {
      cy.get('@collectionItems').should('have.length', 2)
    })

    it('should render the first entry', () => {
      cy.get('@firstListItem')
        .should('exist')
        .should('contain', '30 Sep 2022, 4:20pm')
        .find('[data-test="metadata"]')
        .find('[data-test="metadata-item"]')
        .should('contain', 'Adviser Joseph Woof')
        .should('contain', 'Fields Address line 2, County, Postcode')

      cy.get('@firstListItem')
        .find('[data-test="badge"]')
        .should('contain', '3 changes')
    })

    it('should render the second entry', () => {
      cy.get('@secondListItem')
        .should('exist')
        .should('contain', '30 Sep 2022, 4:18pm')
        .find('[data-test="metadata"]')
        .find('[data-test="metadata-item"]')
        .should('contain', 'Adviser Joseph Woof')
        .should(
          'contain',
          'Fields Last name, Job title, primary, Phone number, Email, Address same as company, Address line 1, Town, Country, More details'
        )
      cy.get('@secondListItem')
        .find('[data-test="badge"]')
        .should('contain', '10 changes')
    })
  })

  context('when viewing an audit history with no entries', () => {
    before(() => {
      cy.visit(urls.contacts.audit())
    })

    it('should render the subheading', () => {
      cy.get('[data-test=audit-header]')
        .should('exist')
        .should('have.text', 'Audit history')
    })

    it('should render the result counter', () => {
      cy.get('[data-test=audit-results]')
        .should('exist')
        .should('have.text', '0 results')
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
