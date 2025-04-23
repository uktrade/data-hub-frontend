import React from 'react'

import { SummaryTable } from '../../../components'
import urls from '../../../../lib/urls'
import { canEditOrder, isOrderActive } from '../transformers'
import AccessibleLink from '../../../components/Link'

const MailtoLink = ({ email }) =>
  email ? (
    <AccessibleLink href={`mailto:${email}`} data-test="email-link">
      {email}
    </AccessibleLink>
  ) : (
    ''
  )
const setJobTitle = (jobTitle) => (jobTitle ? `, ${jobTitle}` : '')

const ContactTable = ({ order, contact }) => (
  <SummaryTable
    caption="Contact"
    data-test="contact-table"
    actions={
      (canEditOrder(order) || isOrderActive(order)) && (
        <AccessibleLink
          key="editContactLink"
          href={urls.omis.edit.contact(order.id)}
          data-test="edit-contact-link"
          noVisitedState={true}
        >
          Edit
        </AccessibleLink>
      )
    }
  >
    <SummaryTable.Row heading="Name">
      <>
        <AccessibleLink
          href={urls.contacts.contact(contact.id)}
          data-test="contact-link"
          noVisitedState={true}
        >
          {contact.name}
        </AccessibleLink>
        {setJobTitle(contact.jobTitle)}
      </>
    </SummaryTable.Row>
    <SummaryTable.Row heading="Phone" hideWhenEmpty={false}>
      {order.contactPhone || contact.fullTelephoneNumber}
    </SummaryTable.Row>
    <SummaryTable.Row heading="Email">
      {order.contactEmail ? (
        <MailtoLink email={order.contactEmail} />
      ) : (
        <MailtoLink email={contact.email} />
      )}
    </SummaryTable.Row>
  </SummaryTable>
)

export default ContactTable
