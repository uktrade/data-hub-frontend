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

const Task = ({
  children,
  name,
  noun = name,
  renderError = Err,
  renderProgress = <ProgressIndicator />,
  payload,
  status,
  error,
  successActionType,
  clear,
  start,
}) => (
  <>
    {status === 'progress' && renderProgress}
    {status === 'success' && children()}
    {status === 'error' &&
      renderError({
        noun,
        error,
        clear,
        retry: () => start(payload, successActionType),
      })}
  </>
)

const Subscribe = ({ children, status }) =>
  children({
    status,
    progress: status === 'progress',
    success: status === 'success',
    error: status === 'error',
  })

const ConnectedTask = connect(
  mapStateToProps,
  (dispatch, { id, name }) => ({
    start: (payload, successActionType, clearOnSuccess) =>
      dispatch({
        type: TASK__START,
        payload,
        id,
        name,
        successActionType,
        clearOnSuccess,
      }),
    clear: () =>
      dispatch({
        type: TASK__CLEAR,
        name,
        id,
      }),
  })
)(Task)

ConnectedTask.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  noun: PropTypes.string,
  renderError: PropTypes.func,
  renderProgress: PropTypes.element,
  renderBeforeStart: PropTypes.any,
}

ConnectedTask.StartOnRender = connect(
  (state, { name, id }) => _.get(state, ['tasks', name, id], {}),
  (dispatch, { id, name }) => ({
    start: (payload, successActionType, clearOnSuccess) =>
      dispatch({
        type: TASK__START,
        payload,
        id,
        name,
        successActionType,
        clearOnSuccess,
      }),
  })
)(({ start, name, id, payload, successActionType, clearOnSuccess, unless }) => {
  useEffect(() => {
    unless || start(payload, successActionType, clearOnSuccess)
  }, [unless, name, id, payload, successActionType, clearOnSuccess])
  return null
})

ConnectedTask.StartOnRender.propTypes = {
  id: PropTypes.string.isRequired,
}

ConnectedTask.Manager = connect(
  (state) => state.tasks,
  (dispatch) => ({
    start: (name, id, successActionType, payload, clearOnSuccess) =>
      dispatch({
        type: TASK__START,
        payload,
        id,
        name,
        successActionType,
        clearOnSuccess,
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
      start: (...args) => start(name, id, ...args),
    }
  })
)

export default ConnectedTask
