import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { SPACING, FONT_SIZE, FONT_WEIGHTS } from '@govuk-react/constants'

import { GREY_3, BLACK } from '../../../client/utils/colours'

const StyledButton = styled('button')`
  display: inline-table;
  padding: 12px;
  margin: 4px;
  background-color: ${GREY_3};
  border-radius: ${SPACING.SCALE_1};
  border: 1px solid ${BLACK};
  vertical-align: middle;
  cursor: pointer;
  span {
    pointer-events: none;
    display: table-cell;
    font-size: ${FONT_SIZE.SIZE_16};
  }
  span:first-child {
    text-transform: ${({ onClick }) => onClick && `uppercase`};
    padding-right: ${({ onClick }) => onClick && `8px`};
    font-weight: ${({ onClick }) => onClick && FONT_WEIGHTS.bold};
  }
`

/**
 * Chips are compact elements that represent an input, attribute, or action.
 * A Chip could be used to display a list of selected filters in a collection list.
 */
const Chip = ({ children, value, onClick = null }) => (
  <StyledButton
    onClick={onClick}
    data-value={value}
    aria-label={`remove filter ${children}`}
  >
    {onClick && <span>✕</span>}
    <span>{children}</span>
  </StyledButton>
)

Chip.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func,
}

export default Chip
