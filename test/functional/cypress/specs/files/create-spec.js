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

describe('SharePoint link file create for company', () => {
  const companyId = '4cd4128b-1bad-4f1e-9146-5d4678c6a018'
  beforeEach(() => {
    cy.intercept('POST', '/api-proxy/v4/document', {
      statusCode: 201,
    }).as('fileHttpRequest')
    cy.visit(
      `/files/create?related_object_id=${companyId}&related_object_type=${RELATED_OBJECT_TYPES.COMPANY}&document_type=${DOCUMENT_TYPES.SHAREPOINT.type}`
    )
  })

  it('should render the SharePoint link header', () => {
    assertLocalHeader('Add a new SharePoint link')
  })

  it('should render add SharePoint link breadcrumb', () => {
    assertBreadcrumbs({
      Home: '/',
      Companies: urls.companies.index(),
      'Zboncak Group|271eb29e-425b-4cd8-b386-3208c3a5f978': `/companies/${companyId}`,
      Files: `/companies/${companyId}/files`,
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
        related_object_id: companyId,
        related_object_type: RELATED_OBJECT_TYPES.COMPANY,
        document_type: DOCUMENT_TYPES.SHAREPOINT.type,
        document_data: {
          title: testTitle,
          url: testUrl,
        },
      }

      cy.wait('@fileHttpRequest').then((xhr) => {
        expect(xhr.request.body).to.deep.equal(expectedBody)
        assertUrl(urls.companies.files(companyId))
        assertTextVisible(`SharePoint link added successfully`)
      })
    })
  })

  context('when a user cancels', () => {
    it('should return without saving and return to the correct endpoint', () => {
      cy.contains('Cancel').click()
      assertUrl(urls.companies.files(companyId))
    })
  })
})
