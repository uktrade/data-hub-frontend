import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import { TASK__START, TASK__CLEAR } from '../../actions'
import Err from './Error'
import ProgressIndicator from '../ProgressIndicator'

class Task extends React.PureComponent {
  componentDidMount() {
    if (this.props.startOnMount) {
      const {
        start,
        startOnMount: { payload, successActionType },
      } = this.props
      start(payload, successActionType)
    }
  }
  render() {
    const {
      children,
      noun,
      renderError = Err,
      renderProgress = <ProgressIndicator />,
      payload,
      status,
      error,
      successActionType,
      clear,
      start,
    } = this.props
    return (
      <>
        {status === 'progress' && renderProgress}
        {status === 'success' && children}
        {status === 'error' &&
          renderError({
            noun,
            error,
            clear,
            retry: () => start(payload, successActionType),
          })}
      </>
    )
  }
}

const ConnectedTask = connect(
  (state, { name, id }) => _.get(state, ['tasks', name, id], {}),
  (dispatch, { id, name }) => ({
    start: (payload, successActionType) =>
      dispatch({
        type: TASK__START,
        payload,
        id,
        name,
        successActionType,
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
  id: PropTypes.string.isRequired,
  noun: PropTypes.string.isRequired,
  renderError: PropTypes.func,
  renderProgress: PropTypes.element,
  startOnMount: PropTypes.shape({
    payload: PropTypes.any,
    successActionType: PropTypes.string.isRequired,
  }),
}

export default ConnectedTask
