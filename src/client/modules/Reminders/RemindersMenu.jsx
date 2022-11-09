import React from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'

import { BLUE, BORDER_COLOUR } from 'govuk-colours'
import { H3 } from 'govuk-react'
import { FONT_WEIGHTS, SPACING } from '@govuk-react/constants'

import urls from '../../../lib/urls'

const LinkList = styled('ul')({
  listStyleType: 'none',
  padding: `0 0 ${SPACING.SCALE_4}`,
  margin: `0 0 ${SPACING.SCALE_4}`,
  borderBottom: `1px solid ${BORDER_COLOUR}`,
})

const LinkListItem = styled('li')({
  marginBottom: SPACING.SCALE_2,
})

const LinkListLink = styled(Link)(({ $isActive }) => ({
  textDecoration: 'none',
  position: 'relative',
  paddingLeft: SPACING.SCALE_2,
  display: 'block',
  borderLeft: `solid 5px transparent`,
  ...($isActive
    ? {
        fontWeight: FONT_WEIGHTS.bold,
        borderColor: BLUE,
      }
    : {}),
}))

const Menu = ({ children }) => (
  <LinkList data-test="link-list">{children}</LinkList>
)

const MenuItem = ({ to, pathname, children }) => (
  <LinkListItem data-test="link-list-item">
    <LinkListLink to={to} $isActive={to === pathname}>
      {children}
    </LinkListLink>
  </LinkListItem>
)

const RemindersMenu = () => {
  const location = useLocation()
  return (
    <>
      <Menu>
        <H3 as="h2">Investment</H3>
        <MenuItem
          to={urls.reminders.investments.estimatedLandDate()}
          pathname={location.pathname}
        >
          Reminders for approaching estimated land dates
        </MenuItem>
        <MenuItem
          to={urls.reminders.investments.noRecentInteraction()}
          pathname={location.pathname}
        >
          Reminders for projects with no recent interaction
        </MenuItem>
        <MenuItem
          to={urls.reminders.investments.outstandingPropositions()}
          pathname={location.pathname}
        >
          Reminders for outstanding propositions
        </MenuItem>
      </Menu>
      <Menu>
        <H3 as="h2">Export</H3>
        <MenuItem
          to={urls.reminders.exports.noRecentInteractions()}
          pathname={location.pathname}
        >
          Reminders for companies with no recent interactions
        </MenuItem>
      </Menu>
    </>
  )
}

export default RemindersMenu
