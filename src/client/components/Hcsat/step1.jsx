import React from 'react'

import styled from 'styled-components'
import { Label } from 'govuk-react'
import { SPACING, FONT_WEIGHTS } from '@govuk-react/constants'

import SecondaryButton from '../SecondaryButton'

const StyledLabel = styled(Label)({
  fontWeight: FONT_WEIGHTS.bold,
  alignContent: 'center',
})

const StyledLayout = styled('div')({
  flexWrap: 'wrap',
  display: 'flex',
})

const SyledSecondaryButton = styled(SecondaryButton)({
  marginBottom: '0px',
  marginRight: SPACING.SCALE_3,
  marginLeft: SPACING.SCALE_3,
})

export default function Step1({ handleUserNo, handleUserYes }) {
  return (
    <StyledLayout>
      <StyledLabel>Is this page useful?</StyledLabel>
      <div>
        <SyledSecondaryButton onClick={handleUserYes}>Yes</SyledSecondaryButton>
        <SyledSecondaryButton onClick={handleUserNo}>No</SyledSecondaryButton>
      </div>
    </StyledLayout>
  )
}
