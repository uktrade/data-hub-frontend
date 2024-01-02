import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Button from '@govuk-react/button'
import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'
import Link from '@govuk-react/link'
import { FONT_SIZE, SPACING } from '@govuk-react/constants'
import PropTypes from 'prop-types'

import LocalHeader from '../../../client/components/LocalHeader/LocalHeader'
import LocalHeaderHeading from '../../../client/components/LocalHeader/LocalHeaderHeading'
import { Badge } from '..'
import urls from '../../../lib/urls'
import ArchivePanel from '../ArchivePanel'

const dispatchToProps = (dispatch) => ({
  writeFlashMessage: (message) =>
    dispatch({
      type: 'FLASH_MESSAGE__WRITE_TO_SESSION',
      messageType: 'success',
      message,
    }),
})

const StyledLink = styled(Link)({
  fontSize: FONT_SIZE.SIZE_20,
})

const StyledLocalHeaderHeading = styled(LocalHeaderHeading)({
  display: 'flex',
  flexWrap: 'wrap',
  columnGap: SPACING.SCALE_2,
  marginTop: SPACING.SCALE_1,
})

const path = location.pathname
const getCurrentTab = (currentPath) =>
  currentPath.includes('/interactions')
    ? 'Activity'
    : currentPath.includes('/audit')
      ? 'Audit history'
      : null

const currentTab = getCurrentTab(path)

const buildBreadcrumbs = (currentTab, id, name) => {
  const initialBreadcrumbs = [
    { link: urls.dashboard.index(), text: 'Home' },
    { link: urls.contacts.index(), text: 'Contacts' },
  ]
  const dynamicBreadcrumbs = currentTab
    ? [
        {
          link: urls.contacts.contact(id),
          text: name,
        },
        { text: currentTab },
      ]
    : [{ text: name }]
  return initialBreadcrumbs.concat(dynamicBreadcrumbs)
}

const ContactLocalHeader = ({ contact, writeFlashMessage }) => {
  return (
    <>
      <LocalHeader
        breadcrumbs={buildBreadcrumbs(currentTab, contact.id, contact.name)}
      >
        <GridRow>
          <GridCol>
            <StyledLink
              data-test="company-link"
              href={urls.companies.overview.index(contact.company.id)}
            >
              {contact.company.name}
            </StyledLink>
            <StyledLocalHeaderHeading data-test="contact-name">
              {contact.name}
              {contact.primary && (
                <Badge
                  data-test="primary-badge"
                  borderColour="purple"
                  textColour="purple"
                  fontSize={FONT_SIZE.SIZE_24}
                >
                  Primary
                </Badge>
              )}
            </StyledLocalHeaderHeading>
          </GridCol>
          {!contact.archived && (
            <GridCol setWidth="one-quarter">
              <Button
                data-test="add-interaction-button"
                as={Link}
                href={urls.companies.interactions.create(contact.company.id)}
              >
                Add interaction
              </Button>
            </GridCol>
          )}
        </GridRow>
        {contact.archived && (
          <ArchivePanel
            archivedBy={contact.archivedBy}
            archivedOn={contact.archivedOn}
            archiveReason={contact.archivedReason}
            unarchiveUrl={urls.contacts.unarchive(contact.id)}
            onClick={() => {
              writeFlashMessage('Contact record updated')
            }}
            type="contact"
          />
        )}
      </LocalHeader>
    </>
  )
}

ContactLocalHeader.propTypes = {
  contact: PropTypes.object.isRequired,
  writeFlashMessage: PropTypes.func,
}

export default connect(null, dispatchToProps)(ContactLocalHeader)
