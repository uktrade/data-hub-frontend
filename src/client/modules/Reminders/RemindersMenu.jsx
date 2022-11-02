import React from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'

import { BLUE } from 'govuk-colours'
import { FONT_WEIGHTS, SPACING } from '@govuk-react/constants'

import urls from '../../../lib/urls'

const LinkList = styled('ul')({
  listStyleType: 'none',
  padding: 0,
  margin: 0,
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

const RemindersMenu = () => {
  const location = useLocation()
  return (
    <LinkList data-test="link-list">
      <LinkListItem data-test="link-list-item">
        <LinkListLink
          to={urls.reminders.investments.estimatedLandDate()}
          $isActive={
            location.pathname == urls.reminders.investments.estimatedLandDate()
          }
        >
          Reminders for approaching estimated land dates
        </LinkListLink>
      </LinkListItem>
      <LinkListItem data-test="link-list-item">
        <LinkListLink
          to={urls.reminders.investments.noRecentInteraction()}
          $isActive={
            location.pathname ==
            urls.reminders.investments.noRecentInteraction()
          }
        >
          Reminders for projects with no recent interaction
        </LinkListLink>
      </LinkListItem>
      <LinkListItem data-test="link-list-item">
        <LinkListLink
          to={urls.reminders.investments.outstandingPropositions()}
          $isActive={
            location.pathname ==
            urls.reminders.investments.outstandingPropositions()
          }
        >
          Reminders for outstanding propositions
        </LinkListLink>
      </LinkListItem>
    </LinkList>
  )
}

export default RemindersMenu
