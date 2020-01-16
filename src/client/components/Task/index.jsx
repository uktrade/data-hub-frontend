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
        startOnMount: { payload, successActionType, clearOnSuccess },
      } = this.props
      start(payload, successActionType, clearOnSuccess)
    }
  }
  render() {
    const {
      children,
      name,
      noun = name,
      renderError = Err,
      renderProgress = <ProgressIndicator />,
      payload,
      status,
      renderBeforeStart,
      error,
      successActionType,
      clear,
      start,
    } = this.props
    return (
      <>
        {!status && renderBeforeStart && children}
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

/**
 * The shape of the {Task.props.startOnMount} prop
 * @typedef {Object} StartOnMount
 * @property {string} successActionType - The type of the action which will be
 * dispatched when the task succeeds. This is a mechanism which allows you to
 * redirect the result to whichever component/reducer it needs to go to.
 * @property {any} [payload=] - The task payload
 * @property {any} [clearOnSuccess=] - If truthy, the task's state will be
 * removed on success.
 */

/**
 * @description This component abstracts away the rendering of the progress,
 * failure and success states of an asynchronous task i.e. a function which
 * takes a {payload} as its only parameterand returns a Promise.
 * To run a task, you first need to register it under a {name} by the
 * {tasksSaga} factory e.g. to register a task under the name "foo", you do
 * `taskSaga({ foo: payload => Promise.resolve(payload) })`.
 * The name under which a task is registered will be used in the default error
 * view so you better keep it human readable.
 * @param {Object} props - Props
 * @param {string} props.name - The name of a _registered_ asynchronous task.
 * @param {string} props.id - The id of a particular _instance_ of a task.
 * @param {ReactNode} [props.renderProgress=ProgressIndicator] - An optional
 * alternative progress indicator.
 * @param {function} [props.renderError=Err] - An optional alternative error
 * state view. As opposed to {renderProgress} this is a function (component)
 * which will be passed the {noun}, {error}, {retry} and {clear} props.
 * @param {string} props.noun - The name describing the item being loaded
 * used in {props.renderError}.
 * @param {ReactNode} children - Whatever is passed as children will be rendered
 * when the task succeeeds.d
 *
 * @param {StartOnMount} props.startOnMount - If set, the task will start when
 * the component is mounted to the DOM.
 * @param {any} props.renderBeforeStart - Whether children should be rendered
 * even if the task hasn't started yet, i.e. when it's not in progress or errror
 * state. This is usefull when you only want data to be loaded once.
 * @example
 * sagaMiddleware.run(tasksSaga({
 *   'Foo': payload => new Promise(resolve => setTimeout(resolve, 1000, payload)),
 *   'Some data': () => axios.get('/api').catch(err => Promise.reject(err.response)),
 * }))
 *
 * // This starts the "a" instance of the "foo" task and then renders:
 * // - The default progress indicator while the task is in progress
 * // - The default error view with a retry button if the task fails
 * // - Its children when the task succeeds.
 * // It will dispatch the {type: 'FOO_LOADED', result: 123} when the task
 * // succeeds, just before it switches to its success state.
 * <Task
 *   name="Foo"
 *   id="a"
 *   startOnMount={{ payload: 123, successActionType: 'FOO_LOADED' }}
 * >
 *   I'll be rendered on success
 * </Task>
 *
 * // Subscribe only to the same task
 * <Task name="Foo" id="a">I'll be rendered on success</Task>
 *
 * // Load data only if it doesn't exist
 * const fooReducer = (state = {}, action) =>
 *   action.type === 'DATA_LOADED'
 *     ? { data: action.result }
 *     : state
 *
 * const store = createStore(combineReducers({ foo: fooReducer }))
 *
 * const Foo = connect(state => state.foo)({ data }) =>
 *   <Task
 *     name="Some data"
 *     id="b"
 *     // Render children if data is already loaded
 *     renderBeforeStart={data}
 *     // Only start loading if data is not yet loaded
 *     startOnMount={data ? undefined : {
 *       successActionType: 'DATA_LOADED',
 *       clearOnSuccess: true, // Removes the task from the state
 *     }}
 *   >
 *    {data}
 *   </Task>
 */
const ConnectedTask = connect(
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
  noun: PropTypes.string,
  renderError: PropTypes.func,
  renderProgress: PropTypes.element,
  renderBeforeStart: PropTypes.any,
  startOnMount: PropTypes.shape({
    successActionType: PropTypes.string.isRequired,
    payload: PropTypes.any,
    clearOnSuccess: PropTypes.any,
  }),
}

/**
 * @description A component which allows to start tasks imperatively.
 * It expects a function as its single child, which will be passed an object
 * with (for now) a single {start} property, which is a function you can use
 * to start actions.
 * @example
 * <Task.Manager>
 *   {({ start }) =>
 *      <button onClick={() => start('foo', 'a', 'ON_SUCCESS', 123)}>
 *        start
 *      </button>
 *   }
 * </Task.manager>
 */
ConnectedTask.Manager = connect(
  null,
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
)(({ start, children }) => children({ start }))

export default ConnectedTask
