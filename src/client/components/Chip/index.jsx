import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { GREY_3, BLACK } from 'govuk-colours'
import { SPACING, FONT_SIZE, FONT_WEIGHTS } from '@govuk-react/constants'

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

const Chip = ({ children, value, onClick = null }) => (
  <StyledButton onClick={onClick} data-value={value}>
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
