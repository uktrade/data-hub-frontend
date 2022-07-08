import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { ID, TASK_GET_REMINDER_SUMMARY, state2props } from './state'
import { REMINDER_SUMMARY__LOADED } from '../../actions'

import Summary from './Summary'
import Task from '../Task'

const ReminderSummary = ({ summary }) => (
  <div data-test="reminder-summary">
    <Task.Status
      name={TASK_GET_REMINDER_SUMMARY}
      id={ID}
      progressMessage="Loading your reminders"
      startOnRender={{
        onSuccessDispatch: REMINDER_SUMMARY__LOADED,
      }}
    >
      {() => <Summary summary={summary} />}
    </Task.Status>
  </div>
)

ReminderSummary.propTypes = {
  summary: PropTypes.shape({
    estimated_land_date: PropTypes.number.isRequired,
    no_recent_investment_interaction: PropTypes.number.isRequired,
    outstanding_propositions: PropTypes.number.isRequired,
  }),
}

export default connect(state2props)(ReminderSummary)
