import React from 'react'
import { connect } from 'react-redux'

import { ID, TASK_GET_EXPORT_WINS_CONFIRMED, state2props } from './state'
import { EXPORT_WINS__CONFIRMED_LOADED } from '../../../actions'
import Task from '../../../components/Task'

const ConfirmedWinsTable = ({ results }) => (
  <Task.Status
    name={TASK_GET_EXPORT_WINS_CONFIRMED}
    id={ID}
    progressMessage="Loading export details"
    startOnRender={{
      onSuccessDispatch: EXPORT_WINS__CONFIRMED_LOADED,
    }}
  >
    {() => (
      <pre>
        <code>{JSON.stringify(results, null, 2)}</code>
      </pre>
    )}
  </Task.Status>
)

export default connect(state2props)(ConfirmedWinsTable)
