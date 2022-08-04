import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { RED, WHITE } from 'govuk-colours'
import { FONT_SIZE, FONT_WEIGHTS } from '@govuk-react/constants'

const StyledNotificationSpan = styled('span')`
  font-size: ${FONT_SIZE.SIZE_16};
  font-weight: ${FONT_WEIGHTS.bold};
  color: ${WHITE};
  display: inline-block;
  height: 1em;
  min-width: 15px;
  padding: 0 6px 2px;
  border-radius: 75px;
  background-color: ${RED};
  text-align: center;
  white-space: nowrap;
  text-decoration: none;
`

/**
 * Show an indicator of how many notifications there are.
 * Based on the [MOJ Notification Badge](https://moj-design-system.herokuapp.com/components/notification-badge).
 */
const NotificationBadge = ({ label = '' }) => (
  <StyledNotificationSpan aria-label={label} data-test="notification-badge">
    {label}
  </StyledNotificationSpan>
)

NotificationBadge.propTypes = {
  /**
   * Text for badge
   */
  label: PropTypes.string,
}

export default NotificationBadge
