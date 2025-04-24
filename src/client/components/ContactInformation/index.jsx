import React from 'react'
import { Details, Paragraph, ListItem, UnorderedList } from 'govuk-react'
import styled from 'styled-components'
import { SPACING_POINTS } from '@govuk-react/constants'

import urls from '../../../lib/urls'
import AccessibleLink from '../Link'

const StyledDetails = styled(Details)`
  margin-top: ${SPACING_POINTS[1]};
`

const ContactInformation = ({ onOpenContactForm, companyId }) => {
  const redirectUrl = urls.contacts.create(companyId, {
    origin_url: window.location.pathname,
    origin_search: btoa(window.location.search),
  })
  return (
    <>
      If your contact is not listed{' '}
      <AccessibleLink
        data-test="add-a-new-contact-link"
        onClick={(e) => {
          e.preventDefault()
          onOpenContactForm({ event: e, redirectUrl })
        }}
        href={redirectUrl}
      >
        add a new contact
      </AccessibleLink>
      . You will leave this page to enter details, once added you will return
      here. The information you added will have been saved.
      <StyledDetails
        summary="Information needed to add a new contact"
        data-test="contact-information-details"
      >
        <Paragraph>You need:</Paragraph>
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
