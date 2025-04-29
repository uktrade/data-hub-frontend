import React, { useState } from 'react'

import styled from 'styled-components'
import { Checkbox, Label } from 'govuk-react'
import { TextAreaField } from '@govuk-react/text-area'
import { FONT_WEIGHTS, SPACING } from '@govuk-react/constants'

import SecondaryButton from '../SecondaryButton'

const StyledLabel = styled(Label)({
  fontWeight: FONT_WEIGHTS.bold,
})

const StyledSecondaryButton = styled(SecondaryButton)({
  marginTop: SPACING.SCALE_3,
  display: 'block',
})

export default function Step2({ onFormSubmit }) {
  const [otherCheckBox, setOtherCheckBox] = useState(false)
  const handleCheckBox = () => {
    setOtherCheckBox(!otherCheckBox) // Correct, update state in an event handler
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    let data = {}
    formData.forEach((value, key) => {
      if (value === 'on') {
        data[key] = true
      } else {
        data[key] = value
      }
    })
    onFormSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit}>
      <StyledLabel>What went wrong?</StyledLabel>
      <Label>Select all that apply.</Label>
      <Checkbox name="did_not_find_what_i_wanted">
        I did not find what I was looking for.
      </Checkbox>
      <Checkbox name="difficult_navigation">
        I found it difficult to navigate the page.
      </Checkbox>
      <Checkbox name="lacks_feature">The page lacks a feature I need.</Checkbox>
      <Checkbox name="unable_to_load">
        I was unable to load/refresh/render the page.
      </Checkbox>
      <Checkbox name="inaccurate_information">
        I did not find the information accurate.
      </Checkbox>
      <Checkbox name="other_issues" onClick={handleCheckBox}>
        Other
      </Checkbox>
      {otherCheckBox ? <TextAreaField name="other_issues_detail" /> : ''}

      <StyledLabel>How could we improve the service</StyledLabel>
      <TextAreaField name="improvement_suggestion" />
      <StyledSecondaryButton>Send</StyledSecondaryButton>
    </form>
  )
}
