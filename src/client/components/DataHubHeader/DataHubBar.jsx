import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import VisuallyHidden from '@govuk-react/visually-hidden'
import styled from 'styled-components'
import qs from 'qs'
import {
  FONT_SIZE,
  FONT_WEIGHTS,
  MEDIA_QUERIES,
  SPACING,
} from '@govuk-react/constants'

import { BLACK, DARK_BLUE_LEGACY, WHITE, YELLOW } from '../../utils/colours'
import NotificationAlert from '../NotificationAlert'
import urls from '../../../lib/urls'

const DATA_WORKSPACE = 'Switch to Data Workspace'
const CRM_COMMUNITY_LABEL = 'CRM community'
const COMMUNITY_PATHNAME = urls.community.index()

const googleAnalyticsUTM = qs.stringify({
  utm_source: 'Data Hub',
  utm_medium: 'referral',
  utm_campaign: 'dataflow',
  utm_content: DATA_WORKSPACE,
})

const Layout = styled.div({
  maxWidth: 960,
  marginLeft: 'auto',
  marginRight: 'auto',
})

const RootContainer = styled.div({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: 'calc(100% - 40px)', // 40px = padding left + padding right
  padding: '7px 25px 7px 15px',
  [MEDIA_QUERIES.DESKTOP]: {
    padding: '7px 0',
    width: '100%',
  },
})

const Container = styled.div(({ hasFeatureGroup }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  [MEDIA_QUERIES.DESKTOP]: {
    whiteSpace: 'nowrap',
    ...(hasFeatureGroup && { width: 300 }),
  },
}))

const DataHubContainer = styled('div')({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 10,
})

const StyledLogoNavLink = styled(NavLink)({
  '&:link, &:visited': {
    fontSize: 30,
    fontWeight: FONT_WEIGHTS.bold,
    color: WHITE,
    textDecoration: 'none',
    boxShadow: 'none',
    outline: 'none',
    '&::after': {
      content: '" "',
    },
    ':focus': {
      color: BLACK,
      background: YELLOW,
    },
  },
})

const BetaTag = styled.strong({
  color: WHITE,
  border: 'none',
  lineHeight: 1.25,
  letterSpacing: 1,
  padding: '3px 8px',
  textDecoration: 'none',
  textTransform: 'uppercase',
  fontSize: FONT_SIZE.SIZE_14,
  fontWeight: FONT_WEIGHTS.bold,
  backgroundColor: DARK_BLUE_LEGACY,
})

const NavigationLink = styled.a(({ hasFeatureGroup }) => ({
  color: WHITE,
  display: 'none',
  marginLeft: '20px',
  marginRight: '20px',
  '-webkit-font-smoothing': 'antialiased',
  [MEDIA_QUERIES.TABLET]: {
    display: 'block',
    marginRight: hasFeatureGroup ? 20 : 0,
  },
  fontWeight: FONT_WEIGHTS.bold,
  textDecoration: 'none',
  ':focus': {
    color: BLACK,
    background: YELLOW,
  },
  ':visited': {
    color: WHITE,
    ':focus': {
      color: BLACK,
    },
  },
  ':hover': {
    textDecoration: 'underline',
    textDecorationThickness: '3px',
    textUnderlineOffset: '.1em',
  },
}))

const MobileMenuButton = styled.button(({ showVerticalNav }) => ({
  fontWeight: 400,
  fontSize: FONT_SIZE.SIZE_14,
  marginLeft: 15,
  padding: 0,
  border: 0,
  color: WHITE,
  background: '0 0',
  outline: 'none',
  ':focus': {
    color: BLACK,
    background: YELLOW,
  },
  '&::after': {
    content: '""',
    display: 'inline-block',
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderColor: 'transparent',
    borderBottomColor: 'inherit',
    borderTopColor: 'inherit',
    marginLeft: SPACING.SCALE_1,
    ...(showVerticalNav
      ? {
          clipPath: 'polygon(50% 0, 0 100%, 100% 100%)',
          borderWidth: '0 5px 8px 5px',
        }
      : {
          clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
          borderWidth: '8px 5px 0 5px',
        }),
  },
  [MEDIA_QUERIES.TABLET]: {
    display: 'none',
  },
}))

const DataHubBar = ({
  onShowVerticalNav,
  showVerticalNav,
  hasFeatureGroup,
}) => (
  <Layout>
    <RootContainer>
      <DataHubContainer>
        <VisuallyHidden>Department for Business and Trade</VisuallyHidden>
        <StyledLogoNavLink as="a" href="/">
          Data Hub
        </StyledLogoNavLink>
        <BetaTag>beta</BetaTag>
      </DataHubContainer>
      <Container hasFeatureGroup={hasFeatureGroup}>
        <NavigationLink
          data-test="crm-community-link"
          hasFeatureGroup={hasFeatureGroup}
          showVerticalNav={showVerticalNav}
          href={COMMUNITY_PATHNAME}
        >
          {CRM_COMMUNITY_LABEL}
        </NavigationLink>
        <NavigationLink
          hasFeatureGroup={hasFeatureGroup}
          showVerticalNav={showVerticalNav}
          href={`https://data.trade.gov.uk?${googleAnalyticsUTM}`}
        >
          {DATA_WORKSPACE}
        </NavigationLink>
        <NotificationAlert />
        <MobileMenuButton
          showVerticalNav={showVerticalNav}
          onClick={() => onShowVerticalNav(!showVerticalNav)}
          role="button"
          aria-expanded={showVerticalNav}
          aria-label="Show or hide navigation"
          aria-controls="navigation sub-navigation logo-navigation"
        >
          Menu
        </MobileMenuButton>
      </Container>
    </RootContainer>
  </Layout>
)

DataHubBar.propTypes = {
  onShowVerticalNav: PropTypes.func.isRequired,
  showVerticalNav: PropTypes.bool.isRequired,
  hasFeatureGroup: PropTypes.bool.isRequired,
}

export default DataHubBar
