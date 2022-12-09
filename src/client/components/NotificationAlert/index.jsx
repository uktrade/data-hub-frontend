import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { RED, WHITE } from 'govuk-colours'
import { FONT_SIZE, FONT_WEIGHTS } from '@govuk-react/constants'

import { ID, TASK_GET_NOTIFICATION_ALERT_COUNT, state2props } from './state'
import { NOTIFICATION_ALERT_COUNT__LOADED } from '../../actions'
import Task from '../Task'
import urls from '../../../lib/urls'
import CheckUserFeatureFlag from '../CheckUserFeatureFlags'

const StyledNotificationAlertNavLink = styled(NavLink)({
  '&:link, &:visited': {
    color: WHITE,
    textDecoration: 'none',
    boxShadow: 'none',
    outline: 'none',
  },
})

const StyledNotificationAlertSpan = styled('span')`
  font-size: ${FONT_SIZE.SIZE_16};
  font-weight: ${FONT_WEIGHTS.bold};
  color: ${WHITE};
  display: inline-block;
  line-height: 1.25;
  padding: 0 5px 0px;
  border-radius: 75px;
  position: relative;
  background-color: ${RED};
  text-align: center;
  white-space: nowrap;
  top: -5px;
  left: -5px;
`

const StyledImg = styled('img')`
  margin-top: 3px;
  margin-bottom: -3px;
`

const NotificationAlert = ({ count }) => (
  <CheckUserFeatureFlag userFeatureFlagName="reminder-summary">
    {(isFeatureFlagOn) =>
      isFeatureFlagOn && (
        <Task.Status
          name={TASK_GET_NOTIFICATION_ALERT_COUNT}
          id={ID}
          progressMessage="Loading your notification alert"
          startOnRender={{
            onSuccessDispatch: NOTIFICATION_ALERT_COUNT__LOADED,
          }}
        >
          {() => (
            <StyledNotificationAlertNavLink
              as="a"
              href={urls.reminders.index()}
            >
              <StyledImg src="/images/bell-icon.svg" alt="Notification icon" />
              {count > 0 ? (
                <StyledNotificationAlertSpan
                  aria-label="notification-alert-badge"
                  data-test="notification-alert-badge"
                >
                  {count}
                </StyledNotificationAlertSpan>
              ) : (
                <></>
              )}
            </StyledNotificationAlertNavLink>
          )}
        </Task.Status>
      )
    }
  </CheckUserFeatureFlag>
)

export default connect(state2props)(NotificationAlert)
