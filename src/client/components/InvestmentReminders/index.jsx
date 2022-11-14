import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { ID, TASK_GET_OUTSTANDING_PROPOSITIONS, state2props } from './state'
import { OUTSTANDING_PROPOSITIONS__LOADED } from '../../actions'

import OutstandingPropositions from './OutstandingPropositions'
import Task from '../Task'

/**
 * Shows reminders of upcoming propositions for an adviser to deal with.
 */
const Reminders = ({ adviser, investmentELD, investmentNRI, investmentOP }) => (
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
      {() => (
        <OutstandingPropositions
          investmentELD={investmentELD}
          investmentNRI={investmentNRI}
          investmentOP={investmentOP}
        />
      )}
    </Task.Status>
  </div>
)

Reminders.propTypes = {
  /**
   * The adviser to display investment reminders for.
   */
  adviser: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  investmentELD: PropTypes.object.isRequired,
  investmentNRI: PropTypes.object.isRequired,
  investmentOP: PropTypes.object.isRequired,
}

export default connect(state2props)(Reminders)
