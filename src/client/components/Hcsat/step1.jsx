import React from 'react'

import styled from 'styled-components'
import { Label } from 'govuk-react'
import { FONT_WEIGHTS } from '@govuk-react/constants'

import SecondaryButton from '../SecondaryButton'

const StyledLabel = styled(Label)({
  display: 'block',
  fontWeight: FONT_WEIGHTS.bold,
  alignContent: 'center',
})

const StyledLayout = styled('div')({
  display: 'flex',
})

const SyledSecondaryButton = styled(SecondaryButton)({
  marginBottom: '0px',
  marginLeft: '16px',
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
