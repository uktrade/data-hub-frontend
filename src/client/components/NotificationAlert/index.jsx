import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { ID, TASK_GET_NOTIFICATION_ALERT_COUNT, state2props } from './state'
import { NOTIFICATION_ALERT_COUNT__LOADED } from '../../actions'
import BellSVG from './bell-icon.svg'
import Task from '../Task'

import { Size, Shape, Count } from '../NotificationBadge'

const StyledNotificationAlertNavLink = styled(NavLink)`
  display: flex;
  min-width: 42px;
  outline: none;
  text-decoration: none;
`

const StyledShape = styled(Shape)({
  position: 'relative',
  top: -2,
  left: -7,
})

const StyledImage = styled('img')({
  width: 22,
  height: 22,
})

const NotificationAlert = ({ count, remindersURL }) => (
  <StyledNotificationAlertNavLink
    as="a"
    href={remindersURL}
    id="notification-bell-count"
  >
    <StyledImage
      src={BellSVG}
      alt="An image of a bell with the notification count overlaid"
    />
    <Task.Status
      name={TASK_GET_NOTIFICATION_ALERT_COUNT}
      id={ID}
      renderProgress={() => null}
      startOnRender={{
        onSuccessDispatch: NOTIFICATION_ALERT_COUNT__LOADED,
      }}
    >
      {() =>
        count > 0 ? (
          <StyledShape
            size={Size.SMALL}
            digits={count.toString().length}
            aria-label="notification-alert-badge"
            data-test="notification-alert-badge"
          >
            <Count>{count < 100 ? count : '99+'}</Count>
          </StyledShape>
        ) : null
      }
    </Task.Status>
  </StyledNotificationAlertNavLink>
)

NotificationAlert.propTypes = {
  count: PropTypes.number.isRequired,
  remindersURL: PropTypes.string.isRequired,
}

export default connect(state2props)(NotificationAlert)
