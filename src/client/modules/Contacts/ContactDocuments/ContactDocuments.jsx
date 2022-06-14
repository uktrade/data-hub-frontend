import React from 'react'

import ContactResource from '../../../components/Resource/Contact'
import DocumentsSection from '../../../components/DocumentsSection'

const ContactDocuments = ({ contactId, archivedDocumentPath }) => {
  return (
    <ContactResource id={contactId}>
      {(contact) => (
        <DocumentsSection
          fileBrowserRoot={archivedDocumentPath}
          documentPath={contact.archivedDocumentsUrlPath}
        />
      )}
    </ContactResource>
  )
}

export default ContactDocuments
