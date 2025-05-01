import React, { useState } from 'react'

import styled from 'styled-components'
import { Checkbox, Label, H4 } from 'govuk-react'
import { TextAreaField } from '@govuk-react/text-area'
import { FONT_WEIGHTS, SPACING } from '@govuk-react/constants'

import SecondaryButton from '../SecondaryButton'

const StyledLabel = styled(Label)({
  fontWeight: FONT_WEIGHTS.bold,
})

const StyledAdditionalFeedback = styled('div')({
  margin: '32px 0',
  label: {
    marginBottom: '15px',
  },
})

const StyledForm = styled('form')({
  fontSize: '16px',
  textAlign: 'left',
  h2: {
    fontSize: '16px',
    marginBottom: '10px',
  },
  div: {
    marginBottom: '10px',
  },
  span: {
    fontSize: '16px',
  },
  textarea: {
    fontSize: '16px',
  },
})

const StyledSecondaryButton = styled(SecondaryButton)({
  marginTop: SPACING.SCALE_3,
  display: 'block',
})

export default function Step2({ onFormSubmit }) {
  const [otherCheckBox, setOtherCheckBox] = useState(false)

  const handleCheckBox = () => {
    setOtherCheckBox(!otherCheckBox)
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
    <StyledForm
      data-test="hcsat-additional-feedback-form"
      onSubmit={handleSubmit}
    >
      <H4 as="h2">What went wrong?</H4>
      <div>Select all that apply.</div>
      <Checkbox sizeVariant="SMALL" name="did_not_find_what_i_wanted">
        I did not find what I was looking for.
      </Checkbox>
      <Checkbox sizeVariant="SMALL" name="difficult_navigation">
        I found it difficult to navigate the page.
      </Checkbox>
      <Checkbox sizeVariant="SMALL" name="lacks_feature">
        The page lacks a feature I need.
      </Checkbox>
      <Checkbox sizeVariant="SMALL" name="unable_to_load">
        I was unable to load/refresh/render the page.
      </Checkbox>
      <Checkbox sizeVariant="SMALL" name="inaccurate_information">
        I did not find the information accurate.
      </Checkbox>
      <Checkbox
        sizeVariant="SMALL"
        name="other_issues"
        onClick={handleCheckBox}
      >
        Other
      </Checkbox>
      {otherCheckBox ? (
        <TextAreaField
          data-test="hcsat-other-issues"
          rows="6"
          name="other_issues_detail"
        />
      ) : (
        ''
      )}

      <StyledAdditionalFeedback>
        <StyledLabel for="improvement_suggestion">
          How could we improve the service?
        </StyledLabel>
        <div>
          Do not include any personal information like your name or email
          address.
        </div>
        <TextAreaField
          data-test="hcsat-improvement-suggestion"
          rows="6"
          id="improvement_suggestion"
          name="improvement_suggestion"
        />
      </StyledAdditionalFeedback>
      <StyledSecondaryButton data-test="hcsat-send-additional-feedback">
        Send
      </StyledSecondaryButton>
    </StyledForm>
  )
}
