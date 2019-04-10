const selectors = require('../../selectors')

describe('Contact Documents', () => {
  context('when there is a document link', () => {
    before(() => {
      cy.visit('/contacts/default-contact-with-document/documents')
    })

    it('should render breadcrumbs', () => {
      cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.text', 'Home')
      cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.attr', 'href', '/')
      cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.text', 'Contacts')
      cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.attr', 'href', '/contacts')
      cy.get(selectors.breadcrumbs.item.byNumber(3)).should('have.text', 'Joseph Woof')
      cy.get(selectors.breadcrumbs.item.byNumber(3)).should('have.attr', 'href', `/contacts/5e75d636-1d24-416a-aaf0-3fb220d594ce`)
      cy.get(selectors.breadcrumbs.item.last()).should('have.text', 'Documents')
    })

    it('should display appropriate message when there is a link to a document', () => {
      cy.get(selectors.document.documentHeader).should('contain', 'Document')
      cy.get(selectors.document.documentContent).should('contain', 'View files and documents')
      cy.get(selectors.document.documentContent).should('contain', '(will open another website)')
    })
  })

  context('when there is not a document link', () => {
    before(() => {
      cy.visit('/contacts/5555d636-1d24-416a-aaf0-3fb220d59aaa/documents')
    })

    it('should render breadcrumbs', () => {
      cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.text', 'Home')
      cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.attr', 'href', '/')
      cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.text', 'Contacts')
      cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.attr', 'href', '/contacts')
      cy.get(selectors.breadcrumbs.item.byNumber(3)).should('have.text', 'Joseph Woof')
      cy.get(selectors.breadcrumbs.item.byNumber(3)).should('have.attr', 'href', `/contacts/5555d636-1d24-416a-aaf0-3fb220d59aaa`)
      cy.get(selectors.breadcrumbs.item.last()).should('have.text', 'Documents')
    })

    it('should display appropriate message when there is not a link to a document', () => {
      cy.get(selectors.document.documentHeader).should('contain', 'Document')
      cy.get(selectors.document.documentContent).should('contain', 'There are no files or documents')
    })
  })
})
