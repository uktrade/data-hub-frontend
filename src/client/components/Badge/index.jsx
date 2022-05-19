import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { FONT_SIZE } from '@govuk-react/constants'
import VisuallyHidden from '@govuk-react/visually-hidden'
import { GREY_2, TEXT_COLOUR } from 'govuk-colours'

const StyledBadge = styled('span')`
  border: ${({ borderColour }) => `2px solid ${borderColour}`};
  border-radius: 4px;
  padding: 2px 4px;
  font-size: ${(props) =>
    props.fontSize ? props.fontSize : FONT_SIZE.SIZE_14};
  white-space: nowrap;
  color: ${(props) => (props.textColour ? props.textColour : TEXT_COLOUR)};
`

const Badge = ({ label, borderColour, textColour, fontSize, children }) => (
  <StyledBadge
    data-test="badge"
    borderColour={borderColour}
    textColour={textColour}
    fontSize={fontSize}
  >
    {label && <VisuallyHidden>{label}</VisuallyHidden>}
    {children}
  </StyledBadge>
)

Badge.propTypes = {
  label: PropTypes.string,
  borderColour: PropTypes.string,
  textColour: PropTypes.string,
  fontSize: PropTypes.string,
  children: PropTypes.node.isRequired,
}

Badge.defaultProps = {
  label: null,
  borderColour: GREY_2,
}

export default Badge
