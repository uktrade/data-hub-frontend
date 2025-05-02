import React from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { FONT_SIZE } from '@govuk-react/constants'

import deprecated from '../../utils/deprecated'
import { FOCUS_MIXIN } from '../../utils/styles'

import {
  DARK_BLUE_LEGACY,
  GREY_4,
  WHITE,
  BLUE,
  BLACK,
} from '../../../client/utils/colours'

const StyledActiveLink = styled('a')({
  display: 'block',
  fontSize: FONT_SIZE.SIZE_20,
  padding: '11px 16px',
  '&:link, &:visited': {
    color: WHITE,
    background: DARK_BLUE_LEGACY,
    textDecoration: 'none',
    fontWeight: 600,
  },
  ...FOCUS_MIXIN,
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
  ...FOCUS_MIXIN,
})

const _LocalNav = ({ children, dataTest = 'local-nav' }) => {
  children = children.filter((child) => child !== false)
  return (
    <nav data-test={dataTest}>
      <ul>
        {children.map((link, index) => (
          <li key={`${index}-${link}`}>{link}</li>
        ))}
      </ul>
    </nav>
  )
}

_LocalNav.propTypes = {
  dataTest: PropTypes.string,
  children: PropTypes.node,
}

export const LocalNav = deprecated(
  'LocalNav',
  '<TabNav layout="vertical/>',
  _LocalNav
)

const _LocalNavLink = ({
  children,
  href,
  dataTest = 'local-nav-link',
  ...rest
}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const location = useLocation()
  const active = href?.includes(location.pathname)
  const NavLink = active ? StyledActiveLink : StyledInactiveLink

  return (
    <NavLink href={href} data-test={dataTest} aria-current={active} {...rest}>
      {children}
    </NavLink>
  )
}

_LocalNavLink.propTypes = {
  dataTest: PropTypes.string,
  href: PropTypes.string,
  children: PropTypes.node,
}

export const LocalNavLink = deprecated(
  'LocalNavLink',
  '<TabNav layout="vertical/>',
  _LocalNavLink
)
