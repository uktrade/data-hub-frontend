import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { FONT_SIZE } from '@govuk-react/constants'
import VisuallyHidden from '@govuk-react/visually-hidden'
import { GREY_2 } from 'govuk-colours'

const StyledBadge = styled('span')`
  border: ${({ borderColour }) => `2px solid ${borderColour}`};
  border-radius: 4px;
  padding: 2px 4px;
  font-size: ${FONT_SIZE.SIZE_14};
  white-space: nowrap;
`

const Badge = ({ label, borderColour, children }) => (
  <StyledBadge borderColour={borderColour}>
    {label && <VisuallyHidden>{label}</VisuallyHidden>}
    {children}
  </StyledBadge>
)

Badge.propTypes = {
  label: PropTypes.string,
  borderColour: PropTypes.string,
  children: PropTypes.node.isRequired,
}

Badge.defaultProps = {
  label: null,
  borderColour: GREY_2,
}

export default Badge
