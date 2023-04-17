import React from 'react'

import { ContactResource } from '../../../components/Resource'
import DocumentsSection from '../../../components/DocumentsSection'
import ContactLayout from '../../../components/Layout/ContactLayout'

const ContactDocuments = ({ contactId, archivedDocumentPath, permissions }) => (
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

export default ContactDocuments
