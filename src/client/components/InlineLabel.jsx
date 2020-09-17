import PropTypes from 'prop-types'
import React from 'react'
import { MEDIA_QUERIES, SPACING } from '@govuk-react/constants'
import Label from '@govuk-react/label'
import LabelText from '@govuk-react/label-text'
import styled from 'styled-components'

const StyledLabel = styled(Label)`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  ${MEDIA_QUERIES.TABLET} {
    flex-wrap: nowrap;
    ${({ justifyRight }) => justifyRight && `justify-content: flex-end;`}
  }
`

const StyledLabelText = styled(LabelText)({
  width: '100%',
  [MEDIA_QUERIES.TABLET]: {
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

InlineLabel.defaultProps = {
  justifyRight: false,
}

export default InlineLabel
