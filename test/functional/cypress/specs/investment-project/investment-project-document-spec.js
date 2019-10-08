const fixtures = require('../../fixtures')
const selectors = require('../../selectors')
const { assertBreadcrumbs } = require('../../support/assertions')

describe('Investment Project Documents', () => {
  context('when there is a document link', () => {
    before(() => {
      cy.visit(`/investments/projects/${fixtures.investment.investmentWithLink.id}/documents`)
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        'Home': '/',
        'Investments': '/investments',
        'New hotel (commitment to invest)': '/investments/projects/fb5b5006-56af-40e0-8615-7aba53e0e4bf',
        'Documents': null,
      })
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
      assertBreadcrumbs({
        'Home': '/',
        'Investments': '/investments',
        'Green tea plantation': '/investments/projects/addca042-5a00-412c-9d7c-acc04552756c',
        'Documents': null,
      })
    })

    it('should display appropriate message when there is not a link to a document', () => {
      cy.get(selectors.document.documentHeader).should('contain', 'Document')
      cy.get(selectors.document.documentContent).should('contain', 'There are no files or documents')
    })
  })
})
