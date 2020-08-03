import React from 'react'
import PropTypes from 'prop-types'
import reactStringReplace from 'react-string-replace'
import styled from 'styled-components'
import { FONT_WEIGHTS } from '@govuk-react/constants'

const StyledSpan = styled('span')`
  font-weight: ${FONT_WEIGHTS.bold};
`

const Highlighter = ({ optionLabel = null, searchStr }) =>
  optionLabel &&
  reactStringReplace(optionLabel, searchStr, (matchedTxt, i) => (
    <StyledSpan key={i}>{matchedTxt}</StyledSpan>
  ))

Highlighter.propTypes = {
  optionLabel: PropTypes.string.isRequired,
  searchStr: PropTypes.string.isRequired,
}

export default Highlighter
