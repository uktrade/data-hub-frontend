import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FONT_SIZE, FONT_WEIGHTS } from '@govuk-react/constants'

import { RED, WHITE } from '../../../client/utils/colours'

export const Size = {
  SMALL: 20,
  MEDIUM: 25,
}

export const Shape = styled.span(({ size, digits }) => ({
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: RED,
  fontWeight: FONT_WEIGHTS.bold,
  height: size,
  width: digits < 3 ? size : size + 10,
  borderRadius: digits < 3 ? '50%' : '75px',
}))

export const Count = styled('span')({
  color: WHITE,
  alignSelf: 'center',
  fontSize: FONT_SIZE.SIZE_14,
})

export const NotificationBadge = ({ value, size = Size.MEDIUM }) => (
  <Shape
    size={size}
    digits={value.toString().length}
    aria-label={value}
    data-test="notification-badge"
  >
    <Count>{value < 100 ? value : '99+'}</Count>
  </Shape>
)

NotificationBadge.propTypes = {
  /**
   *  Badge value
   */
  value: PropTypes.number,
}

export default NotificationBadge
