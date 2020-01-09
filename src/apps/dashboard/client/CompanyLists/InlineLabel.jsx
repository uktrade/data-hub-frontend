import PropTypes from 'prop-types'
import React from 'react'
import { SPACING } from '@govuk-react/constants'
import Label from '@govuk-react/label'
import LabelText from '@govuk-react/label-text'
import styled from 'styled-components'

const StyledLabel = styled(Label)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',
})

const StyledLabelText = styled(LabelText)({
  marginRight: SPACING.SCALE_2,
})

// TODO: Move to data-hub-components
const InlineLabel = ({ text, children }) => (
  <StyledLabel>
    <StyledLabelText>{text}</StyledLabelText>
    {children}
  </StyledLabel>
)

InlineLabel.propTypes = {
  text: PropTypes.string.isRequired,
  children: PropTypes.node,
}

export default InlineLabel
