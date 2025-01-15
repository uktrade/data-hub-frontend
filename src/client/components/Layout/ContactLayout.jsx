import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'
import { SPACING } from '@govuk-react/constants'

import {
  ContactLocalHeader,
  DefaultLayout,
  LocalNav,
  LocalNavLink,
} from '../../components'
import urls from '../../../lib/urls'
import { ContactResource } from '../Resource'
import { state2props } from './state'

const StyledNavWrapper = styled('div')`
  margin-bottom: ${SPACING.SCALE_5};
`

const ContactName = ({ id }) => (
  <ContactResource.Inline id={id}>
    {(contact) => contact.name}
  </ContactResource.Inline>
)

const ContactLayout = ({
  contactId,
  flashMessages,
  userPermissions,
  children,
}) => {
  const canViewActivityLink = userPermissions.includes(
    'interaction.view_all_interaction'
  )
  return (
    <DefaultLayout
      pageTitle={
        <>
          <ContactName id={contactId} /> - Contacts
        </>
      }
      localHeader={
        <ContactLocalHeader
          contactId={contactId}
          writeFlashMessage={flashMessages}
        />
      }
      useReactRouter={false}
    >
      <GridRow>
        <GridCol setWidth="one-quarter">
          <StyledNavWrapper>
            <LocalNav>
              <LocalNavLink
                dataTest="contact-details-link"
                href={urls.contacts.details(contactId)}
              >
                Details
              </LocalNavLink>
              {canViewActivityLink && (
                <LocalNavLink
                  dataTest="contact-activity-link"
                  href={urls.contacts.interactions.index(contactId)}
                >
                  Activity
                </LocalNavLink>
              )}
              <LocalNavLink
                dataTest="contact-audit-link"
                href={urls.contacts.audit(contactId)}
              >
                Audit history
              </LocalNavLink>
            </LocalNav>
          </StyledNavWrapper>
        </GridCol>
        <GridCol>{children}</GridCol>
      </GridRow>
    </DefaultLayout>
  )
}

ContactLayout.propTypes = {
  contact: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]).isRequired,
}

export default connect(state2props)(ContactLayout)
