import PropTypes from 'prop-types'
import React from 'react'
import { MEDIA_QUERIES, SPACING } from '@govuk-react/constants'
import Label from '@govuk-react/label'
import LabelText from '@govuk-react/label-text'
import styled from 'styled-components'

const StyledLabel = styled(Label)(({ theme, justifyRight }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap',
  [theme?.toHorizontalMediaQuery || MEDIA_QUERIES.TABLET]: {
    flexWrap: 'nowrap',
    justifyContent: justifyRight && 'flex-end',
  },
}))

const StyledLabelText = styled(LabelText)(({ theme }) => ({
  width: '100%',
  [theme?.toHorizontalMediaQuery || MEDIA_QUERIES.TABLET]: {
    marginRight: SPACING.SCALE_2,
    width: 'auto',
  },
}))

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
