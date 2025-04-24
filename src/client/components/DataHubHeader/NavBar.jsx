import React from 'react'
import PropTypes from 'prop-types'
import { useLocation, NavLink } from 'react-router-dom'

import styled from 'styled-components'
import {
  FONT_SIZE,
  FONT_WEIGHTS,
  BORDER_WIDTH,
  SPACING,
  MEDIA_QUERIES,
} from '@govuk-react/constants'

import ProtectedLink from '../ProtectedLink'
import { BLACK, GREY_3_LEGACY, DARK_BLUE_LEGACY } from '../../utils/colours'
import links from './links'

const StyledNavContainer = styled.div({
  position: 'relative',
  backgroundColor: BLACK,
  lineHeight: 1.5,
})

const StyledNav = styled.nav({
  backgroundColor: GREY_3_LEGACY,
  fontWeight: FONT_WEIGHTS.bold,
})

const StyledList = styled.ul({
  margin: 0,
  maxWidth: 960,
  marginLeft: 'auto',
  marginRight: 'auto',
  position: 'relative',
  listStyle: 'none',
  boxSizing: 'content-box',
  padding: `0 ${SPACING.SCALE_3}`,
  display: ({ showVerticalNav }) => (showVerticalNav ? 'block' : 'none'),
  [MEDIA_QUERIES.TABLET]: {
    paddingLeft: SPACING.SCALE_5,
    paddingRight: SPACING.SCALE_5,
    display: 'block',
  },
})

const StyledListItem = styled.li({
  paddingRight: SPACING.SCALE_4,
  [MEDIA_QUERIES.TABLET]: {
    display: 'inline-block',
  },
})

const styledLinkMixin = {
  content: '""',
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  borderBottom: `${BORDER_WIDTH} solid`,
}

const styledLinkActive = {
  ...styledLinkMixin,
  borderColor: DARK_BLUE_LEGACY,
}

const styledLinkFocus = {
  ...styledLinkMixin,
  borderColor: BLACK,
}

const styledLink = {
  '&:focus': {
    backgroundColor: '#FFDD00',
    boxShadow: 'none',
    outline: 'none',
  },
  '&:link, &:visited': {
    position: 'relative',
    display: 'block',
    margin: 0,
    padding: `${SPACING.SCALE_1} 0`,
    fontSize: FONT_SIZE.SIZE_16,
    textDecoration: 'none',
    lineHeight: '23px',
    color: BLACK,
    '&.active': {
      color: DARK_BLUE_LEGACY,
      '&:focus': {
        color: BLACK,
      },
    },
    [MEDIA_QUERIES.TABLET]: {
      display: 'inline-block',
      padding: '8px 0',
      ':hover::after': styledLinkActive,
      '&.active::after': styledLinkActive,
      ':focus::after': styledLinkFocus,
    },
  },
}

const StyledNavLink = styled(NavLink)(styledLink)
const StyledLink = styled.a(styledLink)

const isActiveLink = (location, to) => location.pathname.startsWith(to.pathname)

const NavBar = ({ onShowVerticalNav, showVerticalNav, disableReactRouter }) => {
  const location = useLocation()
  return (
    <StyledNavContainer>
      <StyledNav aria-labelledby="navigation" data-test="primary-navigation">
        <StyledList
          showVerticalNav={showVerticalNav}
          id="navigation"
          aria-label="Top Level Navigation"
          onClick={() => onShowVerticalNav(!showVerticalNav)}
        >
          {links.map(({ label, useRouter, module, to, ...rest }, i) => (
            <ProtectedLink module={module} key={i}>
              {useRouter && !disableReactRouter ? (
                <StyledListItem>
                  <StyledNavLink
                    to={to}
                    className={({ isActive }) =>
                      isActive ?? { styledLinkActive }
                    }
                    {...rest}
                  >
                    {label}
                  </StyledNavLink>
                </StyledListItem>
              ) : (
                <StyledListItem>
                  <StyledLink
                    href={`${to.pathname}${to.search ? to.search : ''}`}
                    className={isActiveLink(location, to) ? 'active' : ''}
                  >
                    {label}
                  </StyledLink>
                </StyledListItem>
              )}
            </ProtectedLink>
          ))}
          <StyledListItem>
            <StyledLink
              href="/support"
              className={
                isActiveLink(location, {
                  pathname: '/support',
                })
                  ? 'active'
                  : ''
              }
            >
              Support
            </StyledLink>
          </StyledListItem>
        </StyledList>
      </StyledNav>
    </StyledNavContainer>
  )
}

NavBar.propTypes = {
  onShowVerticalNav: PropTypes.func.isRequired,
  showVerticalNav: PropTypes.bool.isRequired,
  disableReactRouter: PropTypes.bool,
}

export default NavBar
