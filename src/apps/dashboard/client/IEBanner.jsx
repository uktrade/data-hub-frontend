import React from 'react'
import styled from 'styled-components'
import { SPACING, FONT_WEIGHTS } from '@govuk-react/constants'

import { StatusMessage } from '../../../client/components'

const StyledStatusMessage = styled(StatusMessage)`
  margin: ${SPACING.SCALE_4} 0;
  p {
    font-weight: ${FONT_WEIGHTS.bold};
    margin: 0;
  }
`

const IEBanner = () => (
  <StyledStatusMessage>
    <p>
      It looks like you're using Internet Explorer to access Data Hub. You will
      not be able to access Data Hub using Internet Explorer from August 2021.
      We suggest Google Chrome, Microsoft Edge, Firefox or Safari for the best
      experience.
    </p>
  </StyledStatusMessage>
)

export default IEBanner
