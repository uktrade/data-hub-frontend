const fixtures = require('../../fixtures')
const { assertBreadcrumbs } = require('../../support/assertions')
const urls = require('../../../../../src/lib/urls')

describe('Investment Project Documents', () => {
  context('when there is not a document link', () => {
    before(() => {
      cy.visit(
        urls.investments.projects.documents(
          fixtures.investment.investmentWithNoLink.id
        )
      )
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        Investments: urls.investments.index(),
        Projects: urls.investments.projects.index(),
        'Green tea plantation': urls.investments.projects.project(
          'addca042-5a00-412c-9d7c-acc04552756c'
        ),
        Documents: null,
      })
    })

    it('should display appropriate message when there is not a link to a document', () => {
      cy.get('[data-test=document-header]').should('contain', 'Document')
      cy.get('[data-test=document-link]').should('not.exist')
      cy.get('[data-test=no-documents-message]').should(
        'contain',
        'There are no files or documents'
      )
    })
  })
})
