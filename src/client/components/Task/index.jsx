import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import { TASK__START } from '../../actions'
import Err from './Error'
import ProgressIndicator from '../ProgressIndicator'
import { useEffect } from 'react'

const _Task = ({ start, children, ...props }) =>
  children((name, id) => {
    const taskState = _.get(props, [name, id], {})
    return {
      ...taskState,
      progress: taskState.status === 'progress',
      success: taskState.status === 'success',
      error: taskState.status === 'error',
      start: (...args) => start(name, id, ...args),
    }
  })

Task = connect(
  (state) => state.tasks,
  (dispatch) => ({
    start: (name, id, redirectToAction, { payload, clearOnSuccess }) =>
      dispatch({
        type: TASK__START,
        payload,
        id,
        name,
        redirectToAction,
        clearOnSuccess,
      }),
  })
)(_Task)

const _StartOnRender = ({
  start,
  name,
  id,
  payload,
  redirectToAction,
  clearOnSuccess,
  unless,
  status,
}) => {
  useEffect(() => {
    unless || status || start(redirectToAction, { payload, clearOnSuccess })
  }, [unless, name, id, payload, redirectToAction, clearOnSuccess])
  return null
}

Task.StartOnRender = connect(
  (state, { name, id }) => _.get(state, ['tasks', name, id], {}),
  (dispatch, { id, name }) => ({
    start: (redirectToAction, options) =>
      dispatch({
        ...options,
        type: TASK__START,
        id,
        name,
        redirectToAction,
      }),
  })
)(_StartOnRender)

Task.Status = ({
  name,
  id,
  noun,
  startOnRender,
  progressMessage,
  children,
  renderError = Err,
  renderProgress = ProgressIndicator,
}) => (
  <Task>
    {(getTask) => {
      const {
        start,
        progress,
        success,
        error,
        payload,
        errorMessage,
        redirectToAction,
        clearOnSuccess,
      } = getTask(name, id)
      return (
        <>
          {!!startOnRender && (
            <Task.StartOnRender {...startOnRender} {...{ name, id }} />
          )}
          {progress && renderProgress({ message: progressMessage })}
          {success &&
            (typeof children === 'function'
              ? children({ name, id, payload })
              : children)}
          {error &&
            renderError({
              noun,
              errorMessage,
              retry: () => start(redirectToAction, { payload, clearOnSuccess }),
            })}
        </>
      )
    }}
  </Task>
)

export default Task
