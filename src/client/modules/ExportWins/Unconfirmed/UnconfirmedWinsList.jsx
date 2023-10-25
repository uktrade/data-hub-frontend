import React from 'react'
import { connect } from 'react-redux'

import { EXPORT_WINS__UNCONFIRMED_LOADED } from '../../../actions'
import { ID, TASK_GET_EXPORT_WINS_UNCONFIRMED, state2props } from './state'
import Task from '../../../components/Task'

const UnconfirmedWinsList = ({ results }) => (
  <Task.Status
    name={TASK_GET_EXPORT_WINS_UNCONFIRMED}
    id={ID}
    progressMessage="Loading export details"
    startOnRender={{
      onSuccessDispatch: EXPORT_WINS__UNCONFIRMED_LOADED,
    }}
  >
    {() => (
      <pre>
        <code>{JSON.stringify(results, null, 2)}</code>
      </pre>
    )}
  </Task.Status>
)

export default connect(state2props)(UnconfirmedWinsList)
