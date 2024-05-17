import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { ID, TASK_GET_REMINDER_SUMMARY, state2props } from './state'
import { REMINDER_SUMMARY__LOADED } from '../../actions'
import BellIcon from './BellIcon'
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

const StyledBellIcon = styled(BellIcon)({
  width: 22,
  height: 22,
  marginLeft: 20,
})

const NotificationAlert = ({ count, remindersURL }) => (
  <StyledNotificationAlertNavLink
    as="a"
    href={remindersURL}
    id="notification-bell-count"
  >
    <StyledBellIcon />
    <Task.Status
      name={TASK_GET_REMINDER_SUMMARY}
      id={ID}
      renderProgress={() => null}
      startOnRender={{
        onSuccessDispatch: REMINDER_SUMMARY__LOADED,
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
