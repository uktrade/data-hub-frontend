import React from 'react'
import styled from 'styled-components'

import OrderedList from '@govuk-react/ordered-list'
import { SPACING } from '@govuk-react/constants'

const StyledOL = styled(OrderedList)`
  & > * {
    margin-top: ${SPACING.SCALE_4};
  }
`

function StyledOrderedList({ children }) {
  return <StyledOL listStyleType="none">{children}</StyledOL>
}

export default StyledOrderedList
