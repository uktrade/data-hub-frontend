import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import { TASK__START, TASK__CLEAR } from '../../actions'
import Err from './Error'
import ProgressIndicator from '../ProgressIndicator'
import { useEffect } from 'react'

const mapStateToProps = (state, { name, id }) => {
  const taskState = _.get(state, ['tasks', name, id], {})
  return {
    ...taskState,
    progress: taskState.status === 'progress',
    success: taskState.status === 'success',
    error: taskState.status === 'error',
  }
}

const _Task = ({
  children,
  name,
  id,
  noun = name,
  progress,
  success,
  error,
  renderError = Err,
  renderProgress = ProgressIndicator,
  progressMessage,
  payload,
  errorMessage,
  redirectToAction,
  clear,
  start,
  startOnRender,
}) => (
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
        clear,
        retry: () => start(payload, redirectToAction),
      })}
  </>
)

const Task = connect(
  mapStateToProps,
  (dispatch, { id, name }) => ({
    start: (redirectToAction, { payload, clearOnSuccess }) =>
      dispatch({
        type: TASK__START,
        name,
        id,
        redirectToAction,
        payload,
        clearOnSuccess,
      }),
    clear: () =>
      dispatch({
        type: TASK__CLEAR,
        name,
        id,
      }),
  })
)(_Task)

Task.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  noun: PropTypes.string,
  renderError: PropTypes.func,
  renderProgress: PropTypes.element,
  renderBeforeStart: PropTypes.any,
}

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

Task.StartOnRender.propTypes = {
  id: PropTypes.string.isRequired,
}

const _TaskManager = ({ start, children, ...props }) =>
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

Task.Manager = connect(
  (state) => state.tasks,
  (dispatch) => ({
    start: (name, id, redirectToAction, payload, clearOnSuccess) =>
      dispatch({
        type: TASK__START,
        payload,
        id,
        name,
        redirectToAction,
        clearOnSuccess,
      }),
  })
)(_TaskManager)

export default Task
