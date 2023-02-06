import React from 'react'

import ContactResource from '../../../components/Resource/Contact'
import DocumentsSection from '../../../components/DocumentsSection'
import ContactLayout from '../../../components/Layout/ContactLayout'

const ContactDocuments = ({ contactId, archivedDocumentPath, permissions }) => {
  return (
    <ContactResource id={contactId}>
      {(contact) => (
        <ContactLayout contact={contact} permissions={permissions}>
          <DocumentsSection
            fileBrowserRoot={archivedDocumentPath}
            documentPath={contact.archivedDocumentsUrlPath}
          />
        </ContactLayout>
      )}
    </ContactResource>
  )
}

export default ContactDocuments
