import React from 'react'
import styled from 'styled-components'
import { MEDIA_QUERIES, SPACING } from '@govuk-react/constants'

import PrimaryContainer from './PrimaryContainer'

const StyledAside = styled('aside')({
  marginBottom: SPACING.SCALE_2,

  [MEDIA_QUERIES.TABLET]: {
    marginBottom: SPACING.SCALE_6,
  },
})

const Aside = ({ children }) => (
  <StyledAside>
    {children.map((child, i) => (
      <PrimaryContainer key={i}>{child}</PrimaryContainer>
    ))}
  </StyledAside>
)

export default Aside
