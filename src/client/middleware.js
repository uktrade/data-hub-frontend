/* eslint-disable prettier/prettier */
import _ from 'lodash'
import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import queryString from 'qs'
import { createBrowserHistory } from 'history'

import { reducers } from './reducers'

const nunjucksProps = JSON.parse(document.getElementById('react-app').dataset.props || '{}')

const preloadedState = {
  ...nunjucksProps,
  referrerUrl: window.document.referrer,
}

const sagaMiddleware = createSagaMiddleware()

const history = createBrowserHistory({
  // The baseURI is set to the <base/> tag by the spaFallbackSpread
  // middleware, which should be applied to each Express route where
  // react-router is expected to be used.
  basename: queryString.stringify(new URL(document.baseURI).pathname),
})

// FIXME: Store is not middleware and should not be here
const store = configureStore({
  devTools: process.env.NODE_ENV === 'development',
  middleware: [sagaMiddleware, routerMiddleware(history)],
  preloadedState,
  reducer: {
    // This is to prevent the silly "Unexpected key ..." error thrown by combineReducers
    ..._.mapValues(preloadedState, () => (state = null) => state),
    ...reducers,
    router: connectRouter(history),
  },
})


export { store, history, sagaMiddleware }
