import React from 'react'

import urls from '../../../../lib/urls'
import AccessibleLink from '../../../components/Link'

const ContactLink = ({ name, id }) => (
  <AccessibleLink href={urls.contacts.details(id)}>{name}</AccessibleLink>
)

const Contact = ({
  win: { company_contacts: [contact] = [], customer_name },
}) => (contact ? <ContactLink {...contact} /> : customer_name || 'Not set')

export default Contact
