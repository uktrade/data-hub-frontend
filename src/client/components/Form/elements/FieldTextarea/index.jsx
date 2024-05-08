import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { TextAreaField } from '@govuk-react/text-area'
import ErrorText from '@govuk-react/error-text'

import {
  BORDER_WIDTH_FORM_ELEMENT_ERROR,
  SPACING,
} from '@govuk-react/constants'
import pluralize from 'pluralize'

import { ERROR_COLOUR, BLACK } from '../../../../../client/utils/colours'
import { useField } from '../../hooks'
import FieldWrapper from '../FieldWrapper'

const WORD_REGEX = /\b\w+(?:-\w+)*\b/g

const getWordCountFromString = (str) => {
  const words = str.trim().match(WORD_REGEX)
  return words ? words.length : 0
}

const getMaxWordValidator = (maxWords, required, invalid) => (value) => {
  const wordCount = getWordCountFromString(value)
  return wordCount === 0 ? required : wordCount > maxWords ? invalid : null
}

const updateMaxWordsDescription = (maxWords, wordCount) => {
  const delta = maxWords - wordCount
  const count = Math.abs(delta)
  const word = pluralize('word', count)
  return `You have ${count} ${word} ${delta >= 0 ? 'remaining.' : 'too many.'}`
}

const StyledTextareaWrapper = styled('div')`
  ${(props) =>
    props.error &&
    `
    border-left: ${BORDER_WIDTH_FORM_ELEMENT_ERROR} solid ${ERROR_COLOUR};
    margin-right: ${SPACING.SCALE_3};
    padding-left: ${SPACING.SCALE_2};
  `}
  textarea {
    width: 100%;
  }
`

const StyledParagraph = styled('p')({
  color: ({ color }) => color,
})

const FieldTextarea = ({
  name,
  validate,
  required,
  label,
  legend,
  hint,
  maxWords,
  invalid,
  initialValue,
  ...rest
}) => {
  const { value, error, touched, onChange, onBlur } = useField({
    name,
    validate:
      maxWords > 0
        ? getMaxWordValidator(maxWords, required, invalid)
        : validate,
    required,
    initialValue,
  })

  const [wordCount, setWordCount] = useState(0)

  return (
    <FieldWrapper {...{ name, label, legend, hint, error }}>
      <StyledTextareaWrapper error={error}>
        {touched && error && (
          <ErrorText data-test="textarea-error">{error}</ErrorText>
        )}
        <TextAreaField
          data-test="textarea"
          id={name}
          key={name}
          error={touched && error}
          name={name}
          value={value}
          onChange={(e) => {
            onChange(e)
            maxWords > 0 && setWordCount(getWordCountFromString(e.target.value))
          }}
          onBlur={onBlur}
          rows="5"
          {...rest}
        />
        {maxWords > 0 && (
          <StyledParagraph
            data-test="word-count"
            color={wordCount > maxWords ? ERROR_COLOUR : BLACK}
          >
            {updateMaxWordsDescription(maxWords, wordCount)}
          </StyledParagraph>
        )}
      </StyledTextareaWrapper>
    </FieldWrapper>
  )
}

FieldTextarea.propTypes = {
  name: PropTypes.string.isRequired,
  validate: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func),
  ]),
  required: PropTypes.string,
  label: PropTypes.node,
  legend: PropTypes.node,
  hint: PropTypes.node,
  initialValue: PropTypes.string,
  maxWords: PropTypes.number,
}

export default FieldTextarea
