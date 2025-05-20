import {
  DOCUMENT_TYPES,
  RELATED_OBJECT_TYPES,
} from '../../../../src/client/modules/Files/CollectionList/constants'
import urls from '../../../../src/lib/urls'
import { sharePointDocumentFaker } from '../../../functional/cypress/fakers/generic-documents'
import { testIdentityNumbers } from './testIdentityNumbers'

export const initialiseTests = {
  [`/files/${testIdentityNumbers[':fileId']}/delete`]: () => {
    const genericDocument = sharePointDocumentFaker({
      id: testIdentityNumbers[':fileId'],
      related_object_id: testIdentityNumbers[':companyId'],
      related_object: {
        id: testIdentityNumbers[':companyId'],
      },
    })

    cy.intercept(
      'GET',
      `/api-proxy/v4/document/${genericDocument.id}`,
      genericDocument
    ).as('genericDocumentRequest')

    // Return URL with additional parameters
    return urls.companies.files.delete(genericDocument.id, {
      related_object_id: testIdentityNumbers[':companyId'],
      related_object_type: RELATED_OBJECT_TYPES.COMPANY,
      document_type: DOCUMENT_TYPES.SHAREPOINT.type,
    })
  },
}
