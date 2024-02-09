import React from 'react'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Details, Link, Paragraph, ListItem, UnorderedList } from 'govuk-react'
import { SPACING_POINTS } from '@govuk-react/constants'
import styled from 'styled-components'

import urls from '../../../lib/urls'

const StyledDetails = styled(Details)`
  margin-top: ${SPACING_POINTS[1]};
`

const ContactInformation = ({
  onOpenContactForm,
  companyId,
  redirectMode = 'hard',
}) => {
  const redirectUrl = urls.contacts.create(companyId, {
    redirect_mode: redirectMode,
    origin_url: window.location.pathname,
    origin_search: btoa(window.location.search),
  })
  return (
    <>
      If your contact is not listed{' '}
      {redirectMode === 'hard' ? (
        <Link
          data-test="add-a-new-contact-link"
          onClick={(e) => {
            e.preventDefault()
            onOpenContactForm({ event: e, redirectUrl })
          }}
          href={redirectUrl}
        >
          add a new contact
        </Link>
      ) : (
        // A soft redirect using React Router
        <ReactRouterLink data-test="add-a-new-contact-link" to={redirectUrl}>
          add a new contact
        </ReactRouterLink>
      )}
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
