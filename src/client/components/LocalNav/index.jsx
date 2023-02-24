import React from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import styled from 'styled-components'
import { GREY_4, WHITE, BLUE, BLACK } from 'govuk-colours'
import { FONT_SIZE } from '@govuk-react/constants'

const StyledActiveLink = styled('a')({
  display: 'block',
  fontSize: FONT_SIZE.SIZE_20,
  padding: '11px 16px',
  '&:link, &:visited': {
    color: WHITE,
    background: '#005ea5',
    textDecoration: 'none',
    fontWeight: 600,
  },
})

const StyledInactiveLink = styled('a')({
  display: 'block',
  fontSize: FONT_SIZE.SIZE_20,
  padding: '11px 16px',
  '&:link, &:visited': {
    color: BLUE,
    textDecoration: 'none',
  },
  '&:hover, &:focus': {
    color: BLACK,
    backgroundColor: GREY_4,
  },
})

export const LocalNav = ({ children, dataTest = 'local-nav' }) => (
  <nav data-test={dataTest}>
    <ul>
      {children.map((link) => (
        <li> {link} </li>
      ))}
    </ul>
  </nav>
)

export const LocalNavLink = ({
  children,
  href,
  dataTest = 'local-nav-link',
  ...rest
}) => (
  <Route>
    {({ location: { pathname } }) => {
      const NavLink = pathname === href ? StyledActiveLink : StyledInactiveLink
      return (
        <NavLink href={href} data-test={dataTest} {...rest}>
          {children}
        </NavLink>
      )
    }}
  </Route>
)

LocalNav.propTypes = {
  dataTest: PropTypes.string,
  children: PropTypes.node,
}

LocalNavLink.propTypes = {
  dataTest: PropTypes.string,
  href: PropTypes.string,
  children: PropTypes.node,
}
