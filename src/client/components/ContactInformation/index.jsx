import React from 'react'
import { Details, Link, Paragraph, ListItem, UnorderedList } from 'govuk-react'
import styled from 'styled-components'

import { SPACING_POINTS } from '@govuk-react/constants'
import urls from '../../../lib/urls'

const StyledDetails = styled(Details)`
  margin-top: ${SPACING_POINTS[1]};
`

const ContactInformation = ({ onOpenContactForm, companyId }) => {
  return (
    <>
      If a contact isn't listed{' '}
      <Link
        data-test="add-a-new-contact-link"
        onClick={onOpenContactForm}
        href={urls.contacts.create(companyId, {
          origin_url: window.location.pathname,
        })}
      >
        add a new contact
      </Link>
      . After completing the form you'll return to this page without losing
      data.
      <StyledDetails
        summary="Information you'll need to add a contact"
        data-test="contact-information-details"
      >
        <Paragraph>You need to give the new contact's:</Paragraph>
        <UnorderedList listStyleType="bullet">
          <ListItem>full name</ListItem>
          <ListItem>job title</ListItem>
          <ListItem>email address</ListItem>
          <ListItem>phone number</ListItem>
          <ListItem>work address if different to the company address</ListItem>
        </UnorderedList>
      </StyledDetails>
    </>
  )
}
export default ContactInformation
