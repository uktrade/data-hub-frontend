const fixtures = require('../../fixtures/index.js')
const selectors = require('../../selectors')

describe('Investment Project Documents', () => {
  context('when there is a document link', () => {
    before(() => {
      cy.visit(`/investments/projects/${fixtures.investment.investmentWithLink.id}/documents`)
    })

    it('should render breadcrumbs', () => {
      cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.text', 'Home')
      cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.attr', 'href', '/')
      cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.text', 'Investments')
      cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.attr', 'href', '/investments')
      cy.get(selectors.breadcrumbs.item.byNumber(3)).should('have.text', 'New hotel (commitment to invest)')
      cy.get(selectors.breadcrumbs.item.byNumber(3)).should('have.attr', 'href', `/investments/projects/fb5b5006-56af-40e0-8615-7aba53e0e4bf`)
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
      cy.visit(`/investments/projects/${fixtures.investment.investmentWithNoLink.id}/documents`)
    })

    it('should render breadcrumbs', () => {
      cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.text', 'Home')
      cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.attr', 'href', '/')
      cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.text', 'Investments')
      cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.attr', 'href', '/investments')
      cy.get(selectors.breadcrumbs.item.byNumber(3)).should('have.text', 'Green tea plantation')
      cy.get(selectors.breadcrumbs.item.byNumber(3)).should('have.attr', 'href', `/investments/projects/addca042-5a00-412c-9d7c-acc04552756c`)
      cy.get(selectors.breadcrumbs.item.last()).should('have.text', 'Documents')
    })

    it('should display appropriate message when there is not a link to a document', () => {
      cy.get(selectors.document.documentHeader).should('contain', 'Document')
      cy.get(selectors.document.documentContent).should('contain', 'There are no files or documents')
    })
  })
})
