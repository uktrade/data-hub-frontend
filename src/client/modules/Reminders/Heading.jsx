import React from 'react'
import styled from 'styled-components'
import { FONT_WEIGHTS, SPACING } from '@govuk-react/constants'

const PreHeading = styled('span')({
  display: 'block',
  fontWeight: FONT_WEIGHTS.regular,
  marginBottom: SPACING.SCALE_1,
})

const Heading = ({ preHeading, children }) => (
  <>
    <PreHeading>{preHeading}</PreHeading> {children}
  </>
)

export default Heading
