import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import queryString from 'qs'
import { createBrowserHistory } from 'history'
import { createReduxHistoryContext } from 'redux-first-history'

import { reducers } from './reducers'

const preloadedState = {
  referrerUrl: window.document.referrer,
}

const browserHistory = createBrowserHistory({
  // The baseURI is set to the <base/> tag by the spaFallbackSpread
  // middleware, which should be applied to each Express route where
  // react-router is expected to be used.
  basename: queryString.stringify(new URL(document.baseURI).pathname),
})

const { createReduxHistory, routerMiddleware, routerReducer } =
  createReduxHistoryContext({ history: browserHistory })

const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
  devTools: process.env.NODE_ENV === 'development',
  middleware: [sagaMiddleware, routerMiddleware],
  preloadedState,
  reducer: { ...reducers, router: routerReducer },
})

const history = createReduxHistory(store)

export { store, history, sagaMiddleware }
