import React from 'react'
import styled from 'styled-components'
import { SPACING, MEDIA_QUERIES } from '@govuk-react/constants'

const StyledFooterLink = styled('div')({
  display: 'block',
  marginTop: SPACING.SCALE_4,
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
        <hr />
        <h2>{headingText}</h2>
        <p>
          See the <a href={linkUrl}>{linkText}</a>
        </p>
      </div>
    </StyledFooterLink>
  )
}

export default FooterLink
