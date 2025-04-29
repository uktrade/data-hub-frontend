import React, { useState } from 'react'

import styled from 'styled-components'
import { Checkbox, Label, TextArea } from 'govuk-react'
import { FONT_WEIGHTS, SPACING } from '@govuk-react/constants'

import SecondaryButton from '../SecondaryButton'

const StyledLabel = styled(Label)({
  fontWeight: FONT_WEIGHTS.bold,
})

const StyledSecondaryButton = styled(SecondaryButton)({
  marginTop: SPACING.SCALE_3,
  display: 'block',
})

export default function Step2({ setFormCompletion }) {
  const [otherCheckBox, setOtherCheckBox] = useState(false)
  const handleCheckBox = () => {
    setOtherCheckBox(!otherCheckBox) // Correct, update state in an event handler
  }
  return (
    <div>
      <StyledLabel>What went wrong?</StyledLabel>
      <Label>Select all that apply.</Label>
      <Checkbox>I did not find what I was looking for.</Checkbox>
      <Checkbox>I found it difficult to navigate the page.</Checkbox>
      <Checkbox>The page lacks a feature I need.</Checkbox>
      <Checkbox>I was unable to load/refresh/render the page.</Checkbox>
      <Checkbox>I did not find the information accurate.</Checkbox>
      <Checkbox onClick={handleCheckBox}>Other</Checkbox>
      {otherCheckBox ? <TextArea>Please add other reason</TextArea> : ''}

      <StyledLabel>How could we improve the service</StyledLabel>
      <TextArea>
        Do not include any personal information like your name or email address.
      </TextArea>
      <StyledSecondaryButton onClick={setFormCompletion}>
        Send
      </StyledSecondaryButton>
    </div>
  )
}
