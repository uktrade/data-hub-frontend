import React from 'react'
import PropTypes from 'prop-types'

import {
  ContactResource,
  ContactAuditHistoryResource,
} from '../../../components/Resource'
import { getValue, mapFieldNameToLabel } from './transformers'
import { AuditHistory, SectionHeader } from '../../../components'
import ContactLayout from '../../../components/Layout/ContactLayout'
import { EXCLUDED_FIELDS } from './constants'

const ContactAuditHistory = ({ contactId, permissions }) => (
  <ContactResource id={contactId}>
    {(contact) => (
      <>
        <ContactLayout contact={contact} permissions={permissions}>
          <>
            <SectionHeader type="audit">Audit history</SectionHeader>
            <AuditHistory
              resource={ContactAuditHistoryResource}
              id={contactId}
              valueTransformer={getValue}
              fieldMapper={mapFieldNameToLabel}
              excludedFields={EXCLUDED_FIELDS}
              auditType="the contact"
            />
          </>
        </ContactLayout>
      </>
    )}
  </ContactResource>
)

ContactAuditHistory.propTypes = {
  contactId: PropTypes.string.isRequired,
}

export default ContactAuditHistory
