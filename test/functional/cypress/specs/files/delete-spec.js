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
import { genericDocumentFaker } from '../../fakers/generic-documents'
import { companyFaker } from '../../fakers/companies'

describe('Delete SharePoint link from company', () => {
  const company = companyFaker()
  const genericDocument = genericDocumentFaker({
    related_object_id: company.id,
    related_object: {
      id: company.id,
    },
  })

  beforeEach(() => {
    cy.intercept('DELETE', `/api-proxy/v4/document/${genericDocument.id}`, {
      statusCode: 204,
    }).as('fileHttpRequest')
    cy.intercept('GET', `/api-proxy/v4/company/${company.id}`, company).as(
      'companyRequest'
    )
    cy.intercept(
      'GET',
      `/api-proxy/v4/document/${genericDocument.id}`,
      genericDocument
    ).as('genericDocumentRequest')
    cy.visit(
      urls.companies.files.delete(genericDocument.id, {
        related_object_id: company.id,
        related_object_type: RELATED_OBJECT_TYPES.COMPANY,
        document_type: DOCUMENT_TYPES.SHAREPOINT.type,
      })
    )
    cy.wait(['@companyRequest', '@genericDocumentRequest'])
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
