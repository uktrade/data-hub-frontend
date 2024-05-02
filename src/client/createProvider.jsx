import React from 'react'
import _ from 'lodash'
import { configureStore } from '@reduxjs/toolkit'
import { Provider, connect } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import { createReduxHistoryContext } from 'redux-first-history'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import rootSaga from './root-saga'
import { reducers } from './reducers'

const preloadedState = {
  // Extract data provided throught the nunjucks "react-slot" macro
  ...JSON.parse(document.getElementById('react-app')?.dataset.props || '{}'),
  referrerUrl: window.document.referrer,
}

const ConnectedReactRouter = connect(({ router: { location, action } }) => {
  return {
    location,
    navigationType: action,
  }
})(Router)

/**
 * Creates a context provider for all Data Hub components
 * @param {Record<string, Task>} tasks - Tasks required by the
 * components wrapped with the provider
 * @param {import('history').History} [history = import('history').BrowserHistory ] - History backend
 * passed to the router
 * @returns {({children: JSX.Element}) => JSX.Element} - The context provider
 * component.
 */
export const createProvider = (tasks, history = createBrowserHistory()) => {
  const { createReduxHistory, routerMiddleware, routerReducer } =
    createReduxHistoryContext({
      history,
    })
  const sagaMiddleware = createSagaMiddleware()
  const store = configureStore({
    devTools: process.env.NODE_ENV === 'development',
    middleware: () => [sagaMiddleware, routerMiddleware],
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
      router: routerReducer,
    },
  })

  sagaMiddleware.run(rootSaga(tasks))

  const reduxHistory = createReduxHistory(store)

  return ({ children }) => (
    <Provider store={store}>
      <ConnectedReactRouter navigator={reduxHistory}>
        {children}
      </ConnectedReactRouter>
    </Provider>
  )
}
