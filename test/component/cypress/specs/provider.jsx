import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { CompatRouter } from 'react-router-dom-v5-compat'
import { Provider } from 'react-redux'
import { combineReducers, applyMiddleware, legacy_createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { connectRouter } from 'connected-react-router'
import { createMemoryHistory } from 'history'

import rootSaga from '../../../../src/client/root-saga'
import { reducers } from '../../../../src/client/reducers'
import { tasks as appTasks } from '../../../../src/client/tasks'
import { createProvider } from '../../../../src/client/provider'

const sagaMiddleware = createSagaMiddleware()

const history = createMemoryHistory()

export const createTestProvider = (tasks) =>
  createProvider({
    tasks,
    history,
  })

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

// TODO: Get rid of this and use createTestProvider in each test
export default ({ children, tasks = appTasks, resetTasks = false }) => {
  // We only ever want to start the sagas once
  resetTasks ? sagaMiddleware.run(rootSaga(tasks)) : runMiddlewareOnce(tasks)

  return (
    <Provider store={store}>
      <BrowserRouter history={history}>
        <CompatRouter>{children}</CompatRouter>
      </BrowserRouter>
    </Provider>
  )
}
