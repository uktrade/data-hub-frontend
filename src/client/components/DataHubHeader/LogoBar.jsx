import React from 'react'
import { NavLink } from 'react-router-dom'
import VisuallyHidden from '@govuk-react/visually-hidden'
import styled from 'styled-components'
import { BLACK, WHITE, YELLOW } from 'govuk-colours'
import qs from 'qs'
import {
  SPACING,
  FONT_SIZE,
  FONT_WEIGHTS,
  MEDIA_QUERIES,
} from '@govuk-react/constants'

// Colours not defined in 'govuk-colours' which we need for consistency
// with Find Exporters and Market access.
import { DARK_BLUE_LEGACY } from '../../utils/colors'
import NotificationAlert from '../NotificationAlert'

const SWITCH_TO_DATA_WORKSPACE = 'Switch to Data Workspace'

const googleAnalyticsUTM = qs.stringify({
  utm_source: 'Data Hub',
  utm_medium: 'referral',
  utm_campaign: 'dataflow',
  utm_content: SWITCH_TO_DATA_WORKSPACE,
})

const StyledLogoContainer = styled.div({
  maxWidth: 960,
  marginLeft: 'auto',
  marginRight: 'auto',
  overflow: 'hidden',
  fontWeight: FONT_WEIGHTS.bold,
  boxSizing: 'content-box',
  padding: `2px ${SPACING.SCALE_3}`,
  [MEDIA_QUERIES.TABLET]: {
    padding: `2px ${SPACING.SCALE_5}`,
  },
})

const StyledLogo = styled.div({
  fontSize: 30,
  fontWeight: FONT_WEIGHTS.bold,
  display: 'inline-block',
  paddingRight: '2em',
})

const StyledLogoNavLink = styled(NavLink)({
  '&:link, &:visited': {
    color: WHITE,
    textDecoration: 'none',
    boxShadow: 'none',
    outline: 'none',
    '&::after': {
      content: '" "',
    },
  },
})

const StyledTag = styled.strong({
  display: 'inline-block',
  position: 'relative',
  fontSize: FONT_SIZE.SIZE_14,
  fontWeight: FONT_WEIGHTS.bold,
  lineHeight: 1.25,
  padding: '4px 8px 2px 8px',
  outline: '2px solid transparent',
  outlineOffset: '-2px',
  color: WHITE,
  backgroundColor: DARK_BLUE_LEGACY,
  letterSpacing: 1,
  textDecoration: 'none',
  textTransform: 'uppercase',
  border: 'none',
  margin: 0,
  top: -5,
})

const NavigationList = styled.ul({
  display: ({ showVerticalNav }) => (showVerticalNav ? 'inline-block' : 'none'),
  fontSize: FONT_SIZE.SIZE_16,
  listStyle: 'none',
  margin: 0,
  padding: 0,
  outline: '3px solid transparent',
  fontWeight: FONT_WEIGHTS.bold,
  [MEDIA_QUERIES.TABLET]: {
    display: 'inline-block',
    float: 'right',
  },
})

const NavigationListItem = styled.li({
  display: 'inline-flex',
  [MEDIA_QUERIES.TABLET]: {
    padding: `${SPACING.SCALE_1} 0 ${SPACING.SCALE_1} ${SPACING.SCALE_2}`,
  },
})

const NavigationLink = styled.a({
  color: WHITE,
  textDecoration: 'none',
  display: 'block',
  padding: `${SPACING.SCALE_1} 0`,
  width: '100%',
  '-webkit-font-smoothing': 'antialiased',
  ':focus': {
    color: BLACK,
    background: YELLOW,
  },
  ':visited': {
    color: WHITE,
  },
  ':hover': {
    textDecoration: 'underline',
    textDecorationThickness: '3px',
    textUnderlineOffset: '.1em',
  },
})

const LogoBar = ({ showVerticalNav }) => (
  <>
    <StyledLogoContainer>
      <StyledLogo>
        <VisuallyHidden>Department for International Trade</VisuallyHidden>
        <StyledLogoNavLink as="a" href="/">
          Data Hub
        </StyledLogoNavLink>
        <StyledTag>beta</StyledTag>
      </StyledLogo>
      <NavigationList
        showVerticalNav={showVerticalNav}
        id="logo-navigation"
        aria-label="Header links"
      >
        <NavigationListItem>
          <NavigationLink
            href={`https://data.trade.gov.uk?${googleAnalyticsUTM}`}
          >
            {SWITCH_TO_DATA_WORKSPACE}
          </NavigationLink>
        </NavigationListItem>
        <NavigationListItem>
          <NotificationAlert />
        </NavigationListItem>
      </NavigationList>
    </StyledLogoContainer>
  </>
)

export default LogoBar
