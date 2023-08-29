import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { connectRouter, routerMiddleware } from 'connected-react-router'

import queryString from 'qs'

import { createBrowserHistory } from 'history'

import { reducers } from './reducers'

const preloadedState = {
  referrerUrl: window.document.referrer,
}

const sagaMiddleware = createSagaMiddleware()

const history = createBrowserHistory({
  // The baseURI is set to the <base/> tag by the spaFallbackSpread
  // middleware, which should be applied to each Express route where
  // react-router is expected to be used.
  basename: queryString.stringify(new URL(document.baseURI).pathname),
})

const store = configureStore({
  devTools: process.env.NODE_ENV === 'development',
  middleware: [sagaMiddleware, routerMiddleware(history)],
  preloadedState,
  reducer: { ...reducers, router: connectRouter(history) },
})

export { store, history, sagaMiddleware }
