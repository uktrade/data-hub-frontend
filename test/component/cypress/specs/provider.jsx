import React, { useEffect } from 'react'
import { BrowserRouter, MemoryRouter, useNavigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { combineReducers, applyMiddleware, legacy_createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { connectRouter } from 'connected-react-router'
import { createMemoryHistory } from 'history'

import rootSaga from '../../../../src/client/root-saga'
import { reducers } from '../../../../src/client/reducers'
import { tasks as appTasks } from '../../../../src/client/tasks'
import { createProvider } from '../../../../src/client/createProvider'

const sagaMiddleware = createSagaMiddleware()

const history = createMemoryHistory()

/**
 * Creates a DataHub context provider for testing purposes configured
 * to use memory history.
 * @param {Object} options
 * @param {Record<string, Task>} options.tasks - Tasks required by the
 * components wrapped with the provider
 * @param {string} [options.initialPath] - If defined, the provider will
 * navigate to the path specified when mounted.
 * @returns {({children: JSX.Element}) => JSX.Element} - The context provider
 * component.
 */
export const createTestProvider = ({ tasks, initialPath }) => {
  const Provider = createProvider({
    tasks,
    history,
  })

  const NavigateToInitialPath = () => {
    const navigate = useNavigate()
    useEffect(() => {
      navigate(initialPath)
    }, [])
    return null
  }

  return ({ children }) => (
    <Provider>
      {initialPath && <NavigateToInitialPath />}
      {children}
    </Provider>
  )
}

const reducer = (state, action) =>
  combineReducers({
    ...reducers,
    activeFeatureGroups: () => [],
    modulePermissions: () => [],
    userPermissions: () => [],
    router: connectRouter(history),
  })(action.type === 'RESET' ? undefined : state, action)

export const store = legacy_createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
)

export const dispatchResetAction = () => store.dispatch({ type: 'RESET' })

const runMiddlewareOnce = _.once((tasks) => sagaMiddleware.run(rootSaga(tasks)))

/*
 * For component testing where a component relies on useLocation, useNavigation
 * hooks or other similar router hooks. This is due to changes in react router v6.
 */
export const MemoryProvider = ({
  children,
  tasks = appTasks,
  resetTasks = false,
  initialEntries,
}) => {
  // We only ever want to start the sagas once
  resetTasks ? sagaMiddleware.run(rootSaga(tasks)) : runMiddlewareOnce(tasks)

  return (
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </Provider>
  )
}
// TODO: Get rid of this and use createTestProvider in each test
export default ({ children, tasks = appTasks, resetTasks = false }) => {
  // We only ever want to start the sagas once
  resetTasks ? sagaMiddleware.run(rootSaga(tasks)) : runMiddlewareOnce(tasks)

  return (
    <Provider store={store}>
      <BrowserRouter history={history}>{children}</BrowserRouter>
    </Provider>
  )
}
