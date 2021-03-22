import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { ID, TASK_GET_OUTSTANDING_PROPOSITIONS, state2props } from './state'
import { OUTSTANDING_PROPOSITIONS__LOADED } from '../../actions'

import OutstandingPropositions from './OutstandingPropositions'
import Task from '../Task'

const InvestmentReminders = ({ adviser, results, count }) => (
  <div data-test="investment-reminders">
    <Task.Status
      name={TASK_GET_OUTSTANDING_PROPOSITIONS}
      id={ID}
      progressMessage="Loading your reminders"
      startOnRender={{
        payload: { adviser },
        onSuccessDispatch: OUTSTANDING_PROPOSITIONS__LOADED,
      }}
    >
      {() => <OutstandingPropositions results={results} count={count} />}
    </Task.Status>
  </div>
)

InvestmentReminders.propTypes = {
  adviser: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  count: PropTypes.number.isRequired,
  results: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      investment_project: PropTypes.shape({
        id: PropTypes.string.is_required,
        name: PropTypes.string.isRequired,
        project_code: PropTypes.string.isRequired,
      }),
      deadline: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      adviser: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        first_name: PropTypes.string.isRequired,
        last_name: PropTypes.string.isRequired,
      }),
    })
  ).isRequired,
}

export default connect(state2props)(InvestmentReminders)
