import React from 'react'
import { Link } from 'govuk-react'

import { SummaryTable } from '../../../components'
import urls from '../../../../lib/urls'
import { canEditOrder, isOrderActive } from '../transformers'

const MailtoLink = ({ email }) =>
  email ? (
    <Link href={`mailto:${email}`} data-test="email-link">
      {email}
    </Link>
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
        <Link
          href={urls.omis.edit.contact(order.id)}
          data-test="edit-contact-link"
        >
          Edit
        </Link>
      )
    }
  >
    <SummaryTable.Row heading="Name">
      <>
        <Link href={urls.contacts.contact(contact.id)} data-test="contact-link">
          {contact.name}
        </Link>
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
