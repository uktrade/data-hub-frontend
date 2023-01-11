import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { RED, WHITE } from 'govuk-colours'
import { FONT_SIZE, FONT_WEIGHTS, SPACING } from '@govuk-react/constants'

import { ID, TASK_GET_NOTIFICATION_ALERT_COUNT, state2props } from './state'
import { NOTIFICATION_ALERT_COUNT__LOADED } from '../../actions'
import Task from '../Task'
import BellSVG from './bell-icon.svg'

const StyledNotificationAlertNavLink = styled(NavLink)({})

const StyledNotificationAlertSpan = styled('span')`
  display: inline-block;
  position: relative;
  top: -${SPACING.SCALE_2};
  left: -${SPACING.SCALE_2};
  font-size: ${FONT_SIZE.SIZE_16};
  font-weight: ${FONT_WEIGHTS.bold};
  color: ${WHITE};
  line-height: 1.25;
  padding: 0 5px 0px;
  border-radius: 50%;
  background-color: ${RED};
  text-align: center;
  white-space: nowrap;
`

const StyledImage = styled('img')({
  width: 18,
  height: 18,
  verticalAlign: 'sub',
})

const NotificationAlert = ({ count, remindersURL, hasFeatureGroup }) =>
  hasFeatureGroup ? (
    <Task.Status
      name={TASK_GET_NOTIFICATION_ALERT_COUNT}
      id={ID}
      renderProgress={() => null}
      startOnRender={{
        onSuccessDispatch: NOTIFICATION_ALERT_COUNT__LOADED,
      }}
    >
      {() => (
        <StyledNotificationAlertNavLink
          as="a"
          href={remindersURL}
          id="notification-bell-count"
        >
          <StyledImage
            src={BellSVG}
            alt="An image of a bell with the notification count overlaid"
          />
          {count > 0 ? (
            <StyledNotificationAlertSpan
              aria-label="notification-alert-badge"
              data-test="notification-alert-badge"
            >
              {count}
            </StyledNotificationAlertSpan>
          ) : null}
        </StyledNotificationAlertNavLink>
      )}
    </Task.Status>
  ) : null

export default connect(state2props)(NotificationAlert)
