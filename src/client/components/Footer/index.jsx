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
} from 'govuk-colours'
import govukCrest from './govuk-crest-2x.png'

import urls from '../../../lib/urls'
import { InnerContainer } from '../Main'

const StyledFooter = styled('footer')(
  {
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
    box-shadow: 0 -2px ${FOCUS_COLOUR}, 0 4px ${BLACK};
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
`

const Container = styled(InnerContainer)`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  flex-wrap: wrap;
`

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
            >
              Request Support
            </FooterLink>
          </li>
          <li>
            <FooterLink
              href="https://data-services-help.trade.gov.uk/data-hub/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Help Centre
            </FooterLink>
          </li>
          <li>
            <FooterLink
              href="https://workspace.trade.gov.uk/working-at-dit/policies-and-guidance/data-hub-privacy-policy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </FooterLink>
          </li>
          <li>
            <FooterLink
              href="https://data-services-help.trade.gov.uk/accessibility-statement/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Accessibility Statement
            </FooterLink>
          </li>
        </StyleList>
        <CopyrightLink
          href="https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/"
          target="_blank"
          rel="noopener noreferrer"
        >
          &#169; Crown copyright
        </CopyrightLink>
      </Container>
    </StyledFooter>
  )
}
