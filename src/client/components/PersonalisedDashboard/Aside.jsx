import React from 'react'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'

import PrimaryContainer from './PrimaryContainer'

const StyledAside = styled('aside')`
  margin-bottom: ${SPACING.SCALE_6};
`

const Aside = ({ children }) => (
  <StyledAside>
    {children.map((child, i) => (
      <PrimaryContainer key={i}>{child}</PrimaryContainer>
    ))}
  </StyledAside>
)

export default Aside
