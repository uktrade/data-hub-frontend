import React from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'

import { BLUE, BORDER_COLOUR } from 'govuk-colours'
import { H3 } from 'govuk-react'
import { FONT_WEIGHTS, SPACING } from '@govuk-react/constants'

import urls from '../../../lib/urls'
import CheckUserFeatureFlag from '../../components/CheckUserFeatureFlags'

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
          Approaching estimated land dates
        </MenuItem>
        <MenuItem
          to={urls.reminders.investments.noRecentInteraction()}
          pathname={location.pathname}
        >
          Projects with no recent interactions
        </MenuItem>
        <MenuItem
          to={urls.reminders.investments.outstandingPropositions()}
          pathname={location.pathname}
        >
          Outstanding propositions
        </MenuItem>
      </Menu>
      <CheckUserFeatureFlag userFeatureFlagName="export-email-reminders">
        {(isFeatureFlagOn) =>
          isFeatureFlagOn && (
            <Menu>
              <H3 as="h2">Export</H3>
              <MenuItem
                to={urls.reminders.exports.noRecentInteractions()}
                pathname={location.pathname}
              >
                Companies with no recent interactions
              </MenuItem>
            </Menu>
          )
        }
      </CheckUserFeatureFlag>
    </>
  )
}

export default RemindersMenu
