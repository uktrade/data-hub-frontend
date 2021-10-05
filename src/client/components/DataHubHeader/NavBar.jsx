import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { BLACK } from 'govuk-colours'
import {
  FONT_SIZE,
  FONT_WEIGHTS,
  BORDER_WIDTH,
  SPACING,
  MEDIA_QUERIES,
} from '@govuk-react/constants'
import ProtectedLink from '../ProtectedLink'

// Colours not defined in 'govuk-colours' which we need for consistency
// with Find Exporters and Market Access.
import { LIGHT_GREY, DARK_BLUE } from '../../utils/colors'

import links from './links'

const StyledNavContainer = styled.div({
  position: 'relative',
  backgroundColor: BLACK,
  lineHeight: 1.5,
})

const StyledNav = styled.nav({
  backgroundColor: LIGHT_GREY,
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

const styledLinkActive = {
  content: '""',
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  borderBottom: `${BORDER_WIDTH} solid`,
  borderColor: DARK_BLUE,
}

const styledLink = {
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
      color: DARK_BLUE,
    },
    [MEDIA_QUERIES.TABLET]: {
      display: 'inline-block',
      padding: '8px 0',
      ':hover::after': styledLinkActive,
      '&.active::after': styledLinkActive,
    },
  },
}

const StyledNavLink = styled(NavLink)(styledLink)
const StyledLink = styled.a(styledLink)

const NavBar = ({ onShowVerticalNav, showVerticalNav }) => (
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
            {useRouter ? (
              <StyledListItem>
                <StyledNavLink to={to} activeClassName="active" {...rest}>
                  {label}
                </StyledNavLink>
              </StyledListItem>
            ) : (
              <StyledListItem>
                <StyledLink href={`${to.pathname}${to.search}`}>
                  {label}
                </StyledLink>
              </StyledListItem>
            )}
          </ProtectedLink>
        ))}
        <StyledListItem>
          <StyledLink
            href="/support"
            className="datahub-header__navigation__item__link"
          >
            Support
          </StyledLink>
        </StyledListItem>
      </StyledList>
    </StyledNav>
  </StyledNavContainer>
)

export default NavBar
