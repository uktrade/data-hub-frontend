import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { ID, TASK_GET_REMINDER_SUMMARY, state2props } from './state'
import { REMINDER_SUMMARY__LOADED } from '../../actions'

import Summary from './Summary'
import Task from '../Task'

const ReminderSummary = (data) => (
  <div data-test="reminder-summary">
    <Task.Status
      name={TASK_GET_REMINDER_SUMMARY}
      id={ID}
      progressMessage="Loading your reminders"
      startOnRender={{
        onSuccessDispatch: REMINDER_SUMMARY__LOADED,
      }}
    >
      {() => <Summary {...data} />}
    </Task.Status>
  </div>
)

const reminderType = PropTypes.arrayOf(
  PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
  })
)

ReminderSummary.propTypes = {
  count: PropTypes.number,
  investment: reminderType,
}

export default connect(state2props)(ReminderSummary)
