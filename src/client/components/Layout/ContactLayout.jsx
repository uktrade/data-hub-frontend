import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'
import { SPACING } from '@govuk-react/constants'

import { Main } from '../../components'
import { ContactLocalHeader, LocalNav, LocalNavLink } from '../../components'
import urls from '../../../lib/urls'

const StyledNavWrapper = styled('div')`
  margin-bottom: ${SPACING.SCALE_5};
`

const ContactLayout = ({ contact, flashMessages, permissions, children }) => {
  const canViewActivityLink = permissions.includes(
    'interaction.view_all_interaction'
  )
  const canViewDocumentsLink = permissions.includes(
    'company.view_contact_document'
  )
  return (
    <>
      <ContactLocalHeader contact={contact} writeFlashMessage={flashMessages} />
      <Main>
        <GridRow>
          <GridCol setWidth="one-quarter">
            <StyledNavWrapper>
              <LocalNav>
                <LocalNavLink
                  dataTest="contact-details-link"
                  href={urls.contacts.details(contact.id)}
                >
                  Details
                </LocalNavLink>
                {canViewActivityLink && (
                  <LocalNavLink
                    dataTest="contact-activity-link"
                    href={urls.contacts.interactions.index(contact.id)}
                  >
                    Activity
                  </LocalNavLink>
                )}
                <LocalNavLink
                  dataTest="contact-audit-link"
                  href={urls.contacts.audit(contact.id)}
                >
                  Audit history
                </LocalNavLink>
                {canViewDocumentsLink && (
                  <LocalNavLink
                    dataTest="contact-documents-link"
                    href={urls.contacts.documents(contact.id)}
                  >
                    Documents
                  </LocalNavLink>
                )}
              </LocalNav>
            </StyledNavWrapper>
          </GridCol>
          <GridCol>{children}</GridCol>
        </GridRow>
      </Main>
    </>
  )
}

ContactLayout.propTypes = {
  contact: PropTypes.object.isRequired,
  permissions: PropTypes.array.isRequired,
  children: PropTypes.element.isRequired,
}

export default ContactLayout
