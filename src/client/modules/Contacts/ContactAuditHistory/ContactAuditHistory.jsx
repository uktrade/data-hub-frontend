import React from 'react'
import { useParams } from 'react-router-dom'

import { ContactAuditHistoryResource } from '../../../components/Resource'
import { getValue, mapFieldNameToLabel } from './transformers'
import { AuditHistory, SectionHeader } from '../../../components'
import ContactLayout from '../../../components/Layout/ContactLayout'
import { EXCLUDED_FIELDS } from './constants'

const ContactAuditHistory = () => {
  const { contactId } = useParams()
  return (
    <ContactLayout contactId={contactId}>
      <SectionHeader type="audit">Audit history</SectionHeader>
      <AuditHistory
        resource={ContactAuditHistoryResource}
        id={contactId}
        valueTransformer={getValue}
        fieldMapper={mapFieldNameToLabel}
        excludedFields={EXCLUDED_FIELDS}
        auditType="the contact"
      />
    </ContactLayout>
  )
}

export default ContactAuditHistory
