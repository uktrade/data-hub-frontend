import React from 'react'
import _ from 'lodash'
import {
  ConnectedRouter,
  connectRouter,
  routerMiddleware,
} from 'connected-react-router'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import { createBrowserHistory } from 'history'

import rootSaga from './root-saga'
import { reducers } from './reducers'

const preloadedState = {
  // Extract data provided throught the nunjucks "react-slot" macro
  ...JSON.parse(document.getElementById('react-app')?.dataset.props || '{}'),
  referrerUrl: window.document.referrer,
}

// TODO: Remove once DataHubProvider is implemented with createProvider
const sagaMiddleware = createSagaMiddleware()

const history = createBrowserHistory()

// TODO: Remove once DataHubProvider is implemented with createProvider
const store = configureStore({
  devTools: process.env.NODE_ENV === 'development',
  middleware: () => [sagaMiddleware, routerMiddleware(history)],
  preloadedState,
  reducer: {
    // This is to prevent the silly "Unexpected key ..." error thrown by combineReducers
    ..._.mapValues(
      preloadedState,
      () =>
        (state = null) =>
          state
    ),
    ...reducers,
    router: connectRouter(history),
  },
})

// TODO: Remove once DataHubProvider is implemented with createProvider
const runMiddlewareOnce = _.once((tasks, sagaMiddleware) =>
  sagaMiddleware.run(rootSaga(tasks))
)

export const createProvider = ({ tasks, history, preloadedState }) => {
  const sagaMiddleware = createSagaMiddleware()
  const store = configureStore({
    devTools: process.env.NODE_ENV === 'development',
    middleware: () => [sagaMiddleware, routerMiddleware(history)],
    preloadedState,
    reducer: {
      // This is to prevent the silly "Unexpected key ..." error thrown by combineReducers
      ..._.mapValues(
        preloadedState,
        () =>
          (state = null) =>
            state
      ),
      ...reducers,
      router: connectRouter(history),
    },
  })

  sagaMiddleware.run(rootSaga(tasks))

  return ({ children }) => (
    <Provider store={store}>
      <ConnectedRouter history={history}>{children}</ConnectedRouter>
    </Provider>
  )
}

// TODO: Re-implement this in with createProvider
/**
 * Provides state management and routing infrastructure required by the
 * stateful/routed components.
 * @param {Object} props
 * @param {Collection<string, (payload: any, id: string) => Promise<any>>} props.tasks -
 * A map of _task_ names to _tasks_, if required by the wrapped components.
 * @param {React.ReactNode} props.children - Children to which the context will be provided
 * @example
 * import ReferralList from 'components/ReferralList'
 * import dummyReferralListTask from 'components/ReferralList/task/dummy'
 *
 * // ReferralList is a stateful component,
 * // which also requires the Referrals task.
 * <DataHubProvider task={{ Referrals: dummyReferralListTask() }}>
 *    <ReferralList id="foo"/>
 * </DataHubProvider>
 */
const DataHubProvider = ({ tasks, children }) => {
  runMiddlewareOnce(tasks, sagaMiddleware)

  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>{children}</ConnectedRouter>
    </Provider>
  )
}

export default DataHubProvider
