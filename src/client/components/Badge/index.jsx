import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { FONT_SIZE } from '@govuk-react/constants'
import VisuallyHidden from '@govuk-react/visually-hidden'

import { GREY_2, TEXT_COLOUR } from '../../../client/utils/colours'

const StyledBadge = styled('span')`
  border: ${({ borderColour }) => `2px solid ${borderColour}`};
  border-radius: 4px;
  padding: 2px 4px;
  font-size: ${(props) =>
    props.fontSize ? props.fontSize : FONT_SIZE.SIZE_14};
  white-space: nowrap;
  color: ${(props) => (props.textColour ? props.textColour : TEXT_COLOUR)};
`

/**
 * A component to display the type of an element.
 */
const Badge = ({
  label,
  borderColour = GREY_2,
  textColour = TEXT_COLOUR,
  fontSize = FONT_SIZE.SIZE_14,
  children,
}) => (
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
  /**
   * A custom colour for the border.
   */
  borderColour: PropTypes.string,
  /**
   * A custom colour for the badge text.
   */
  textColour: PropTypes.string,
  /**
   * A custom size for the text of the badge.
   */
  fontSize: PropTypes.string,
  /**
   * The text that will be displayed on the badge.
   */
  children: PropTypes.node.isRequired,
}

export default Badge
