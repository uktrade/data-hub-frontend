import PropTypes from 'prop-types'
import React from 'react'
import { SPACING } from '@govuk-react/constants'
import Label from '@govuk-react/label'
import LabelText from '@govuk-react/label-text'
import styled from 'styled-components'

import { MEDIA_QUERIES } from '../utils/responsive'

const StyledLabel = styled(Label)(({ justifyRight }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap',
  [MEDIA_QUERIES.LARGE_DESKTOP]: {
    flexWrap: 'nowrap',
    justifyContent: justifyRight && 'flex-end',
  },
}))

const StyledLabelText = styled(LabelText)({
  width: '100%',
  [MEDIA_QUERIES.LARGE_DESKTOP]: {
    marginRight: SPACING.SCALE_2,
    width: 'auto',
  },
})

const InlineLabel = ({ text, children, justifyRight, name }) => (
  <StyledLabel justifyRight={justifyRight} htmlFor={name}>
    <StyledLabelText>{text}</StyledLabelText>
    {children}
  </StyledLabel>
)

InlineLabel.propTypes = {
  text: PropTypes.string.isRequired,
  children: PropTypes.node,
  justifyRight: PropTypes.bool,
}

export default InlineLabel
