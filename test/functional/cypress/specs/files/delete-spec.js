import {
  assertLocalHeader,
  assertBreadcrumbs,
  assertTextVisible,
  assertUrl,
} from '../../support/assertions'

import urls from '../../../../../src/lib/urls'

import {
  DOCUMENT_TYPES,
  RELATED_OBJECT_TYPES,
} from '../../../../../src/client/modules/Files/CollectionList/constants'
import {
  sharePointDocumentFaker,
  uploadableDocumentFaker,
} from '../../fakers/generic-documents'
import { companyFaker } from '../../fakers/companies'

describe('Delete SharePoint link from company', () => {
  const company = companyFaker()
  const sharePointDocument = sharePointDocumentFaker({
    related_object_id: company.id,
    related_object: {
      id: company.id,
    },
  })

  beforeEach(() => {
    cy.intercept('DELETE', `/api-proxy/v4/document/${sharePointDocument.id}`, {
      statusCode: 204,
    }).as('fileHttpRequest')
    cy.intercept('GET', `/api-proxy/v4/company/${company.id}`, company).as(
      'companyRequest'
    )
    cy.intercept(
      'GET',
      `/api-proxy/v4/document/${sharePointDocument.id}`,
      sharePointDocument
    ).as('sharePointDocumentRequest')
    cy.visit(
      urls.companies.files.delete(sharePointDocument.id, {
        related_object_id: company.id,
        related_object_type: RELATED_OBJECT_TYPES.COMPANY,
        document_type: DOCUMENT_TYPES.SHAREPOINT.type,
      })
    )
    cy.wait(['@companyRequest', '@sharePointDocumentRequest'])
  })

  it('should render the SharePoint link header', () => {
    assertLocalHeader('Delete SharePoint link')
  })

  it('should render delete SharePoint link breadcrumb', () => {
    assertBreadcrumbs({
      Home: '/',
      Companies: urls.companies.index(),
      [company.name]: `/companies/${company.id}`,
      Files: `/companies/${company.id}/files`,
      'Delete SharePoint link': null,
    })
  })

  context('when deleting a SharePoint link', () => {
    it('should delete', () => {
      cy.contains('button', 'Delete SharePoint link').click()

      cy.wait('@fileHttpRequest').then(() => {
        assertUrl(urls.companies.files.index(company.id))
        assertTextVisible(`SharePoint link successfully deleted`)
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

describe('Delete uploaded file from company', () => {
  const company = companyFaker()
  const uploadableDocument = uploadableDocumentFaker({
    related_object_id: company.id,
    related_object: {
      id: company.id,
    },
  })

  beforeEach(() => {
    cy.intercept('DELETE', `/api-proxy/v4/document/${uploadableDocument.id}`, {
      statusCode: 204,
    }).as('fileHttpRequest')
    cy.intercept('GET', `/api-proxy/v4/company/${company.id}`, company).as(
      'companyRequest'
    )
    cy.intercept(
      'GET',
      `/api-proxy/v4/document/${uploadableDocument.id}`,
      uploadableDocument
    ).as('uploadableDocumentRequest')
    cy.visit(
      urls.companies.files.delete(uploadableDocument.id, {
        related_object_id: company.id,
        related_object_type: RELATED_OBJECT_TYPES.COMPANY,
        document_type: DOCUMENT_TYPES.UPLOADABLE.type,
      })
    )
    cy.wait(['@companyRequest', '@uploadableDocumentRequest'])
  })

  it('should render the uploaded file header', () => {
    assertLocalHeader('Delete uploaded file')
  })

  it('should render delete uploaded file breadcrumb', () => {
    assertBreadcrumbs({
      Home: '/',
      Companies: urls.companies.index(),
      [company.name]: `/companies/${company.id}`,
      Files: `/companies/${company.id}/files`,
      'Delete uploaded file': null,
    })
  })

  context('when deleting an uploaded file', () => {
    it('should delete', () => {
      cy.contains('button', 'Delete uploaded file').click()

      cy.wait('@fileHttpRequest').then(() => {
        assertUrl(urls.companies.files.index(company.id))
        assertTextVisible(`File successfully deleted`)
      })
    })
  })

  context('when a user cancels', () => {
    it('should return to the collection page without saving', () => {
      cy.contains('Cancel').click()
      assertUrl(urls.companies.files.index(company.id))
    })
  })
})
