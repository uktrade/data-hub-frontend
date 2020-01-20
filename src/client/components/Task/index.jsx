import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import { TASK__START } from '../../actions'
import Err from './Error'
import ProgressIndicator from '../ProgressIndicator'
import { useEffect } from 'react'

const nameIdPropTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
}

const startOnRenderPropTypes = {
  payload: PropTypes.any,
  onSuccessDispatch: PropTypes.string,
}

const Task = connect(
  (state) => state.tasks,
  (dispatch) => ({
    start: (name, id, { payload, onSuccessDispatch }) =>
      dispatch({
        type: TASK__START,
        payload,
        id,
        name,
        onSuccessDispatch,
      }),
  })
)(({ start, children, ...props }) =>
  children((name, id) => {
    const taskState = _.get(props, [name, id], {})
    return {
      ...taskState,
      progress: taskState.status === 'progress',
      success: taskState.status === 'success',
      error: taskState.status === 'error',
      start: (options) => start(name, id, options),
    }
  })
)

Task.propTypes = {
  children: PropTypes.func.isRequired,
}

Task.StartOnRender = connect(
  (state, { name, id }) => _.get(state, ['tasks', name, id], {}),
  (dispatch, { id, name }) => ({
    start: (options) =>
      dispatch({
        ...options,
        type: TASK__START,
        id,
        name,
      }),
  })
)(({ start, name, id, payload, onSuccessDispatch, status }) => {
  useEffect(() => {
    status || start({ payload, onSuccessDispatch })
  }, [name, id, payload, onSuccessDispatch])
  return null
})

Task.StartOnRender.propTypes = {
  ...nameIdPropTypes,
  ...startOnRenderPropTypes,
}

Task.Status = ({
  name,
  id,
  noun = name,
  startOnRender,
  progressMessage,
  renderError = Err,
  renderProgress = ProgressIndicator,
}) => (
  <Task>
    {(getTask) => {
      const {
        start,
        progress,
        error,
        payload,
        errorMessage,
        onSuccessDispatch,
      } = getTask(name, id)
      return (
        <>
          {!!startOnRender && (
            <Task.StartOnRender {...startOnRender} {...{ name, id }} />
          )}
          {progress && renderProgress({ message: progressMessage })}
          {error &&
            renderError({
              noun,
              errorMessage,
              retry: () => start({ payload, onSuccessDispatch }),
            })}
        </>
      )
    }}
  </Task>
)

Task.Status.propTypes = {
  ...nameIdPropTypes,
  noun: PropTypes.string,
  progressMessage: PropTypes.string,
  startOnRender: PropTypes.shape(startOnRenderPropTypes),
  renderProgress: PropTypes.elementType,
  renderError: PropTypes.elementType,
}

export default Task
