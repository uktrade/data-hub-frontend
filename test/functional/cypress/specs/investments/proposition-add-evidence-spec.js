const urls = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')
const {
  assertPayload,
  assertFlashMessage,
} = require('../../support/assertions')

describe('Investment project add evidence', () => {
  context('When adding evidence for a project', () => {
    const projectId = fixtures.investment.investmentWithLink.id
    const propositionId = fixtures.propositions.proposition.id

    beforeEach(() => {
      cy.visit(
        urls.investments.projects.proposition.document.index(
          projectId,
          propositionId
        )
      )
    })

    context('form layout', () => {
      it('should render the heading', () => {
        cy.get('[data-test="heading"]')
          .should('exist')
          .should('have.text', 'Add evidence')
      })

      it('should render the form with the correct field', () => {
        cy.get('form').should('be.visible')
        cy.get('[data-test="field-document_upload"]').should('exist')
      })

      it('should render an upload and cancel button', () => {
        cy.get('[data-test="submit-button"]')
          .should('exist')
          .and('have.text', 'Upload')
        cy.get('[data-test="cancel-button"]')
          .should('exist')
          .and(
            'have.attr',
            'href',
            urls.investments.projects.proposition.details(
              projectId,
              propositionId
            )
          )
          .and('have.text', 'Cancel')
      })
    })

    context('submitting form', () => {
      it('should show upload field error when just the upload field does not have a value and the form is submitted', () => {
        cy.get('[data-test="submit-button"').click()
        cy.get('[data-test="summary-form-errors')
          .should('exist')
          .and('contain', 'Choose a document')
        cy.get('[data-test="field-document_upload"]').contains(
          'Choose a document'
        )
      })

      it('should call the endpoint with the form data when valid form is submitted and redirect to evidence page with flash message', () => {
        cy.intercept(
          'POST',
          `/api-proxy/v3/investment/${projectId}/proposition/${propositionId}/document`
        ).as('postUpload')
        cy.intercept('PUT', 'https://s3.amazon.com/documentId', {
          statusCode: 200,
        })
        cy.get('input[type=file]').selectFile(
          'test/functional/cypress/fixtures/default.json'
        )
        cy.get('[data-test="submit-button"').click()
        assertPayload('@postUpload', {
          original_filename: 'default.json',
        })
        cy.location('pathname').should(
          'eq',
          urls.investments.projects.proposition.details(
            projectId,
            propositionId
          )
        )
        assertFlashMessage('File uploaded')
      })

      it('should show an error if the file uploaded is greater than the max file size', () => {
        const moreThanOneMb = 1024 * 1024 + 1
        const bigFile = Cypress.Buffer.alloc(moreThanOneMb)
        bigFile.write('X', moreThanOneMb)
        cy.get('input[type=file]').selectFile({
          contents: bigFile,
          fileName: 'more-than1mb.txt',
          mimeType: 'text/plain',
        })

        cy.get('[data-test="submit-button"').click()
        cy.get('[data-test="error-dialog')
          .should('exist')
          .and('contain', 'File must be no larger than 1Mb')
      })
    })
  })
})
