import React from 'react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { CompatRouter } from 'react-router-dom-v5-compat'
import { Provider } from 'react-redux'
import { combineReducers, applyMiddleware, legacy_createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { connectRouter } from 'connected-react-router'
import { createBrowserHistory } from 'history'

import queryString from 'qs'

import rootSaga from '../../../../src/client/root-saga'
import { reducers } from '../../../../src/client/reducers'
import { tasks as appTasks } from '../../../../src/client/tasks'

const sagaMiddleware = createSagaMiddleware()

const history = createBrowserHistory({
  basename: queryString.stringify(new URL(document.baseURI).pathname),
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
      <MemoryRouter initialEntries={initialEntries}>
        <CompatRouter>{children}</CompatRouter>
      </MemoryRouter>
    </Provider>
  )
}
export default ({ children, tasks = appTasks, resetTasks = false }) => {
  // We only ever want to start the sagas once
  resetTasks ? sagaMiddleware.run(rootSaga(tasks)) : runMiddlewareOnce(tasks)

  return (
    <Provider store={store}>
      <BrowserRouter>
        <CompatRouter>{children}</CompatRouter>
      </BrowserRouter>
    </Provider>
  )
}
