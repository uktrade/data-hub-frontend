import React from 'react'
import { Route } from 'react-router-dom'
import styled from 'styled-components'
import { GREY_4, WHITE, BLUE, BLACK } from 'govuk-colours'
import { FONT_WEIGHTS, SPACING } from '@govuk-react/constants'

const StyledLocalNav = styled('nav')({
  padding: `${SPACING.SCALE_2} ${SPACING.SCALE_3}`,
})

const StyledActiveLink = styled('a')({
  display: 'block',
  padding: `${SPACING.SCALE_2} ${SPACING.SCALE_3}`,
  '&:link, &:visited': {
    color: WHITE,
    backgroundColor: BLUE,
    textDecoration: 'none',
    fontWeight: FONT_WEIGHTS.bold,
  },
})

const StyledInactiveLink = styled('a')({
  display: 'block',
  padding: `${SPACING.SCALE_2} ${SPACING.SCALE_3}`,
  '&:link, &:visited': {
    color: BLUE,
    textDecoration: 'none',
  },
  '&:hover, &:focus': {
    color: BLACK,
    backgroundColor: GREY_4,
  },
})

export const LocalNav = ({ children }) => {
  return <StyledLocalNav>{children}</StyledLocalNav>
}

export const LocalNavLink = ({ children, href, ...rest }) => (
  <Route>
    {({ location: { pathname } }) => {
      const NavLink = pathname === href ? StyledActiveLink : StyledInactiveLink
      return (
        <NavLink href={href} {...rest}>
          {children}
        </NavLink>
      )
    }}
  </Route>
)
