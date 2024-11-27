import React from 'react'
import Link from '@govuk-react/link'

import urls from '../../../../lib/urls'

const ContactLink = ({ name, id }) => (
  <Link href={urls.contacts.details(id)}>{name}</Link>
)

const Contact = ({
  win: { company_contacts: [contact] = [], customer_name },
}) => (contact ? <ContactLink {...contact} /> : customer_name || 'Not set')

export default Contact
