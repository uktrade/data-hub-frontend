import React from 'react'
import styled from 'styled-components'
import { spacing, typography } from '@govuk-react/lib'
import { SPACING } from '@govuk-react/constants'
import {
  FOOTER_BACKGROUND,
  FOOTER_TEXT,
  FOOTER_BORDER_TOP,
  FOCUS_COLOUR,
  BLACK,
} from '../../../client/utils/colours'
import govukCrest from './govuk-crest-2x.png'

import urls from '../../../lib/urls'
import { InnerContainer } from '../Main'

// when screen is zoomed in so that the width becomes smaller than BREAKPOINT_ZOOMED_IN, we
// ensure that footer links are shown in a column rather than a row, so they can be visible
// at all times
const BREAKPOINT_ZOOMED_IN = '340px'

const StyledFooter = styled('footer')(
  {
    clear: 'both',
    borderTop: `1px solid ${FOOTER_BORDER_TOP}`,
    background: `${FOOTER_BACKGROUND}`,
    color: `${FOOTER_TEXT}`,
  },
  typography.font({ size: 16 }),
  spacing.withWhiteSpace({
    padding: [
      { size: 7, direction: 'top' },
      { size: 5, direction: 'bottom' },
    ],
  })
)

const StyleList = styled.ul`
  display: flex;
  flex: 1;
  flex-direction: row;
  li + li {
    margin-left: ${SPACING.SCALE_3};
  }
  margin-bottom: ${SPACING.SCALE_3};

  @media (max-width: ${BREAKPOINT_ZOOMED_IN}) {
    margin-bottom: -${SPACING.SCALE_3};
    margin-right: ${SPACING.SCALE_5};
    flex-direction: column;
    flex-wrap: wrap;

    li + li {
      margin-left: 0;
    }

    li {
      margin-left: 0;
      margin-bottom: ${SPACING.SCALE_3};
    }

    li:last-child {
      margin-bottom: ${SPACING.SCALE_5};
    }
  }
`

const FooterLink = styled.a`
  color: ${BLACK};
  &:active,
  &:focus,
  &:visited,
  &:hover {
    color: ${BLACK};
    outline: 3px solid transparent;
  }
  &:focus {
    background-color: ${FOCUS_COLOUR};
    box-shadow:
      0 -2px ${FOCUS_COLOUR},
      0 4px ${BLACK};
    text-decoration: none;
  }
`

const CopyrightLink = styled(FooterLink)`
  display: inline-block;
  min-width: 125px;
  padding-top: 112px;
  background-image: url(${govukCrest});
  background-repeat: no-repeat;
  background-position: 50% 0%;
  background-size: 125px 102px;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  margin-bottom: ${SPACING.SCALE_3};
  @media (max-width: ${BREAKPOINT_ZOOMED_IN}) {
    margin-bottom: ${SPACING.SCALE_5};
  }
`

const Container = styled(InnerContainer)`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  flex-wrap: wrap;
`

/**
 * The Footer displayed in all pages across the Data Hub site.
 */
export default function Footer() {
  return (
    <StyledFooter>
      <Container>
        <StyleList>
          <li>
            <FooterLink
              href={urls.support()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Request Support (opens in new tab)"
            >
              Request Support
            </FooterLink>
          </li>
          <li>
            <FooterLink
              href={urls.external.helpCentre.dhHomepage()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Help Centre (opens in new tab)"
            >
              Help Centre
            </FooterLink>
          </li>
          <li>
            <FooterLink
              href={urls.external.helpCentre.privacyNotice()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Privacy Notice (opens in new tab)"
            >
              Privacy Notice
            </FooterLink>
          </li>
          <li>
            <FooterLink
              href={urls.external.helpCentre.cookies()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Cookies (opens in new tab)"
            >
              Cookies
            </FooterLink>
          </li>
          <li>
            <FooterLink
              href={urls.external.helpCentre.accessibilityStatement()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Accessibility Statement (opens in new tab)"
            >
              Accessibility Statement
            </FooterLink>
          </li>
        </StyleList>
        <CopyrightLink
          href={urls.external.copyright}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Crown copyright (opens in new tab)"
        >
          &#169; Crown copyright
        </CopyrightLink>
      </Container>
    </StyledFooter>
  )
}
