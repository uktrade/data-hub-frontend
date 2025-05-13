import {
  assertLocalHeader,
  assertBreadcrumbs,
  assertErrorSummary,
  assertTextVisible,
  assertUrl,
} from '../../../cypress/support/assertions'

import urls from '../../../../../src/lib/urls'

import {
  DOCUMENT_TYPES,
  RELATED_OBJECT_TYPES,
} from '../../../../../src/client/modules/Files/CollectionList/constants'
import { companyFaker } from '../../fakers/companies'
import { uploadableDocumentFaker } from '../../fakers/generic-documents'
import {
  FILE_SIZES,
  MAX_FILE_SIZE_ERR_MSG,
} from '../../../../../src/client/utils/file-upload-size'

describe('SharePoint link file create for company', () => {
  const company = companyFaker()
  beforeEach(() => {
    cy.intercept('POST', '/api-proxy/v4/document', {
      statusCode: 201,
    }).as('fileHttpRequest')
    cy.visit(
      `/files/create?related_object_id=${company.id}&related_object_type=${RELATED_OBJECT_TYPES.COMPANY}&document_type=${DOCUMENT_TYPES.SHAREPOINT.type}`
    )
  })

  it('should render the SharePoint link header', () => {
    assertLocalHeader('Add a new SharePoint link')
  })

  it('should render add SharePoint link breadcrumb', () => {
    assertBreadcrumbs({
      Home: '/',
      Companies: urls.companies.index(),
      'Zboncak Group|271eb29e-425b-4cd8-b386-3208c3a5f978': `/companies/${company.id}`,
      Files: `/companies/${company.id}/files`,
      'Add a new SharePoint link': null,
    })
  })

  context('when verifying SharePoint link inputs', () => {
    it('should validate an empty form', () => {
      cy.contains('button', 'Add SharePoint link').click()
      assertErrorSummary(['You must enter a SharePoint share link'])
    })

    it('should validate a valid URL is added to the form', () => {
      cy.get('#url').type('INVALID_URL')
      cy.contains('button', 'Add SharePoint link').click()
      assertErrorSummary(['You must enter a valid SharePoint share link'])
    })
  })

  context('when filling in a valid SharePoint form', () => {
    it('should save with expected values and endpoint', () => {
      const testUrl = 'http://somevalidurl.com'
      const testTitle = 'Some test title'

      cy.get('#url').type(testUrl)
      cy.get('#title').type(testTitle)

      cy.contains('button', 'Add SharePoint link').click()

      const expectedBody = {
        related_object_id: company.id,
        related_object_type: RELATED_OBJECT_TYPES.COMPANY,
        document_type: DOCUMENT_TYPES.SHAREPOINT.type,
        document_data: {
          title: testTitle,
          url: testUrl,
        },
      }

      cy.wait('@fileHttpRequest').then((xhr) => {
        expect(xhr.request.body).to.deep.equal(expectedBody)
        assertUrl(urls.companies.files.index(company.id))
        assertTextVisible(`SharePoint link added successfully`)
      })
    })
  })

  context('when a user cancels', () => {
    it('should return without saving and return to the correct endpoint', () => {
      cy.contains('Cancel').click()
      assertUrl(urls.companies.files.index(company.id))
    })
  })
})

describe('Upload file for company', () => {
  const company = companyFaker()
  const uploadableDocument = uploadableDocumentFaker()
  const uploadURL = 'https://example.com/upload'
  beforeEach(() => {
    cy.intercept('POST', '/api-proxy/v4/document', {
      statusCode: 201,
      body: {
        ...uploadableDocument,
        signed_upload_url: uploadURL,
      },
    }).as('createRequest')
    cy.intercept('PUT', uploadURL, {
      statusCode: 200,
    }).as('uploadRequest')
    cy.intercept(
      'POST',
      `/api-proxy/v4/document/${uploadableDocument.id}/upload-complete`,
      {
        statusCode: 200,
      }
    ).as('uploadCompleteRequest')
    cy.visit(
      `/files/create?related_object_id=${company.id}&related_object_type=${RELATED_OBJECT_TYPES.COMPANY}&document_type=${DOCUMENT_TYPES.UPLOADABLE.type}`
    )
  })

  it('should render the Upload new file header', () => {
    assertLocalHeader('Upload a new file')
  })

  it('should render add upload new file breadcrumb', () => {
    assertBreadcrumbs({
      Home: '/',
      Companies: urls.companies.index(),
      'Zboncak Group|271eb29e-425b-4cd8-b386-3208c3a5f978': `/companies/${company.id}`,
      Files: `/companies/${company.id}/files`,
      'Upload a new file': null,
    })
  })

  it('should validate an empty form', () => {
    cy.contains('button', 'Upload file').click()
    assertErrorSummary(['Choose file'])
  })

  it('should return to the collection page without saving', () => {
    cy.contains('Cancel').click()
    assertUrl(urls.companies.files.index(company.id))
  })

  context('when uploading a file', () => {
    it('should handle the file upload with the expected values and redirect to collection page', () => {
      const title = 'Project timeline'
      const fileName = 'default.json' // Name of fixture file below

      cy.get('input[type=file]').selectFile(
        'test/functional/cypress/fixtures/default.json'
      )
      cy.get('#title').type(title)
      cy.contains('button', 'Upload file').click()

      const expectedBody = {
        related_object_id: company.id,
        related_object_type: RELATED_OBJECT_TYPES.COMPANY,
        document_type: DOCUMENT_TYPES.UPLOADABLE.type,
        document_data: {
          original_filename: fileName,
          title: title,
        },
      }
      cy.wait('@createRequest')
        .its('request.body')
        .should('deep.include', expectedBody)
      cy.wait('@uploadCompleteRequest')
      assertUrl(urls.companies.files.index(company.id))
      assertTextVisible('File uploaded successfully')
    })

    it('should show an error if the file uploaded is greater than the max file size', () => {
      const moreThanFiftyMb = FILE_SIZES['50Mb'] + 1
      const bigFile = Cypress.Buffer.alloc(moreThanFiftyMb)
      bigFile.write('X', moreThanFiftyMb)
      cy.get('input[type=file]').selectFile({
        contents: bigFile,
        fileName: 'more-than50mb.txt',
        mimeType: 'text/plain',
      })
      cy.get('[data-test="submit-button"').click()
      cy.get('[data-test="error-dialog')
        .should('exist')
        .and('contain', [MAX_FILE_SIZE_ERR_MSG])
    })
  })
})
