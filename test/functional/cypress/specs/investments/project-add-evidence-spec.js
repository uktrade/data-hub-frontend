const urls = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')
const { assertPayload } = require('../../support/assertions')

describe('Investment project add evidence', () => {
  context('When adding evidence for a project', () => {
    const projectId = fixtures.investment.investmentWithLink.id

    beforeEach(() => {
      cy.intercept('GET', '/api-proxy/v4/metadata/evidence-tag*').as(
        'getEvidenceTagsApiRequest'
      )
      cy.visit(urls.investments.projects.evidence.add(projectId))
      cy.wait('@getEvidenceTagsApiRequest')
    })

    context('form layout', () => {
      it('should render the heading', () => {
        cy.get('[data-test="heading"]')
          .should('exist')
          .should('have.text', 'Add evidence')
      })

      it('should render the form with the correct form fields', () => {
        cy.get('form').should('be.visible')
        cy.get('[data-test="field-file_upload"]').should('exist')
        cy.get('[data-test="criteria_field_0"]')
          .should('exist')
          .should('not.contain', 'Remove')
        cy.get('[data-test="add-another"]')
          .should('exist')
          .should('have.text', 'Add another')
        cy.get('[data-test="textarea"]').should('exist')
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
            `/investments/projects/${projectId}/evidence`
          )
          .and('have.text', 'Cancel')
      })

      it('should add a second verification criteria field when add another button is clicked', () => {
        cy.get('[data-test="add-another"]').click()
        cy.get('[data-test="criteria_field_0"]')
          .should('exist')
          .contains('Remove')
        cy.get('[data-test="criteria_field_1"]')
          .should('exist')
          .contains('Remove')
      })

      it('should remove the second verification criteria field when the corresponding remove button is clicked', () => {
        cy.get('[data-test="add-another"]').click()
        cy.get('[data-test="criteria_field_1"]').contains('Remove').click()
        cy.get('[data-test="criterial_field_1').should('not.exist')
        cy.get('[data-test="criteria_field_0"]')
          .should('exist')
          .contains('Remove')
          .should('not.exist')
      })
    })

    context('submitting form', () => {
      it('should show errors when the upload field and verification criteria do not have values and the form is submitted', () => {
        cy.get('[data-test="submit-button"').click()
        cy.get('[data-test="summary-form-errors')
          .should('exist')
          .and('contain', 'Choose a document')
          .and('contain', 'Select a criteria')
        cy.get('[data-test="field-file_upload"]').contains('Choose a document')
        cy.get('[data-test="criteria_field_0"]').contains('Select a criteria')
      })

      it('should show upload field error when just the upload field does not have a value and the form is submitted', () => {
        cy.get('[data-test="criteria_field_0"]').find('select').select(1)
        cy.get('[data-test="submit-button"').click()
        cy.get('[data-test="summary-form-errors')
          .should('exist')
          .and('contain', 'Choose a document')
        cy.get('[data-test="field-file_upload"]').contains('Choose a document')
        cy.get('[data-test="criteria_field_0"]').should(
          'not.contain',
          'Select a criteria'
        )
      })

      it('should show verification criteria field error when just the verification criteria field does not have a value and the form is submitted', () => {
        cy.get('input[type=file]').selectFile(
          'test/functional/cypress/fixtures/default.json'
        )
        cy.get('[data-test="submit-button"').click()
        cy.get('[data-test="summary-form-errors')
          .should('exist')
          .and('contain', 'Select a criteria')
        cy.get('[data-test="criteria_field_0"]').contains('Select a criteria')
        cy.get('[data-test="field-file_upload"]').should(
          'not.contain',
          'Choose a document'
        )
      })

      it('should call the endpoint with the form data when valid form is submitted and redirect to evidence page with flash message', () => {
        cy.intercept(
          'POST',
          `/api-proxy/v3/investment/${projectId}/evidence-document`
        ).as('postUpload')
        cy.intercept('PUT', 'https://s3.amazon.com/documentId', {
          statusCode: 200,
        })
        cy.get('input[type=file]').selectFile(
          'test/functional/cypress/fixtures/default.json'
        )
        cy.get('[data-test="criteria_field_0"]').find('select').select(1)
        cy.get('[data-test="submit-button"').click()
        assertPayload('@postUpload', {
          comment: '',
          original_filename: 'default.json',
          tags: ['d5145304-cacd-47ec-b808-4306a151b7d5'],
        })
        cy.get('[data-test="evidence-heading"]')
          .should('exist')
          .and('have.text', 'Evidence')
        cy.get('[data-test="status-message"]')
          .should('exist')
          .and('have.text', '1 File Uploaded')
      })

      it('should call the delete endpoint to rollback the upload if there is an error when uploading file to s3', () => {
        cy.intercept('PUT', 'https://s3.amazon.com/documentId', {
          statusCode: 404,
        })
        cy.intercept(
          'DELETE',
          `/api-proxy/v3/investment/${projectId}/evidence-document/7cbe3d94-4d02-49fb-8ccb-9f70be849206`
        ).as('rollbackUpload')
        cy.get('input[type=file]').selectFile(
          'test/functional/cypress/fixtures/default.json'
        )
        cy.get('[data-test="criteria_field_0"]').find('select').select(1)
        cy.get('[data-test="submit-button"').click()
        cy.wait('@rollbackUpload').then(({ response }) => {
          expect(response.statusCode).to.equal(200)
        })
      })

      it('should show an error if the file uploaded is greater than the max file size', () => {
        const moreThanFiftyMb = 50 * 1024 * 1024 + 1
        const bigFile = Cypress.Buffer.alloc(moreThanFiftyMb)
        bigFile.write('X', moreThanFiftyMb)
        cy.get('input[type=file]').selectFile({
          contents: bigFile,
          fileName: 'more-than50mb.txt',
          mimeType: 'text/plain',
        })

        cy.get('[data-test="criteria_field_0"]').find('select').select(1)
        cy.get('[data-test="submit-button"').click()
        cy.get('[data-test="error-dialog')
          .should('exist')
          .and('contain', 'File must be no larger than 50Mb')
      })
    })
  })
})
