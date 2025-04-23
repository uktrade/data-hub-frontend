import React from 'react'
import styled from 'styled-components'
import { H3 } from 'govuk-react'
import { SPACING, MEDIA_QUERIES } from '@govuk-react/constants'

import AccessibleLink from '../../components/Link'

const StyledFooterLink = styled('div')({
  display: 'block',
  marginTop: SPACING.SCALE_6,
  marginBottom: SPACING.SCALE_4,
  [MEDIA_QUERIES.DESKTOP]: {
    marginLeft: 1,
    marginBottom: 25,
  },
})

const FooterLink = ({ headingText, linkText, linkUrl }) => {
  return (
    <StyledFooterLink>
      <div data-test="footer-link">
        <H3>
          <strong>{headingText}</strong>
        </H3>
        <p>
          See the{' '}
          <AccessibleLink
            target="_blank"
            rel="noopener noreferrer"
            href={linkUrl}
          >
            {linkText}{' '}
          </AccessibleLink>
        </p>
      </div>
    </StyledFooterLink>
  )
}

export default FooterLink
