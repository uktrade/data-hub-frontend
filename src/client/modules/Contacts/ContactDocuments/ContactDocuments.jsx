import React from 'react'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'
import { typography } from '@govuk-react/lib'

import ContactResource from '../../../components/Resource/Contact'
import { NewWindowLink } from '../../../components'

const StyledSectionHeader = styled('div')`
  ${typography.font({ size: 24, weight: 'bold' })};
  margin-bottom: ${SPACING.SCALE_4};
`

const ContactDocuments = ({ contactId, archivedDocumentPath }) => {
  return (
    <ContactResource id={contactId}>
      {(contact) => (
        <>
          <StyledSectionHeader data-test="document-heading">
            Documents
          </StyledSectionHeader>
          {contact.archivedDocumentsUrlPath ? (
            <NewWindowLink
              href={archivedDocumentPath + contact.archivedDocumentsUrlPath}
              data-test="document-link"
            >
              View files and documents
            </NewWindowLink>
          ) : (
            <p data-test="no-documents-message">
              There are no files or documents
            </p>
          )}
        </>
      )}
    </ContactResource>
  )
}

export default ContactDocuments
