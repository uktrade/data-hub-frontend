import React from 'react'
import { Details, Link, Paragraph, ListItem, UnorderedList } from 'govuk-react'
import urls from '../../../lib/urls'

const ContactDetails = ({ onOpenContactForm, companyId }) => {
  return (
    <>
      If a contact isn't listed{' '}
      <Link
        onClick={onOpenContactForm}
        href={urls.contacts.create(companyId, {
          origin_url: window.location.pathname,
          origin_type: 'interaction',
        })}
      >
        add a new contact
      </Link>
      . After completing the form you'll return to this page without losing
      data.
      <Details summary="Information you'll need to add a contact">
        <Paragraph>You need to give the new contact's:</Paragraph>
        <UnorderedList listStyleType="bullet">
          <ListItem>full name</ListItem>
          <ListItem>job title</ListItem>
          <ListItem>email address</ListItem>
          <ListItem>phone number</ListItem>
          <ListItem>work address if different to the company address</ListItem>
        </UnorderedList>
      </Details>
    </>
  )
}

export default ContactDetails
