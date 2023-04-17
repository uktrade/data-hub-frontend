import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { combineReducers, applyMiddleware, legacy_createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'

import rootSaga from '../../../../src/client/root-saga'
import tasks from '../../../../src/client/components/Task/reducer'
import Typeahead from '../../../../src/client/components/Typeahead/Typeahead'
import FieldAddAnother from '../../../../src/client/components/Form/elements/FieldAddAnother/FieldAddAnother'
import Resource from '../../../../src/client/components/Resource/Resource'

const sagaMiddleware = createSagaMiddleware()

const reducer = (state, action) =>
  combineReducers({
    tasks,
    ...Resource.reducerSpread,
    ...Typeahead.reducerSpread,
    ...FieldAddAnother.reducerSpread,
  })(action.type === 'RESET' ? undefined : state, action)

export const store = legacy_createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
)

const runMiddlewareOnce = _.once((tasks) => sagaMiddleware.run(rootSaga(tasks)))

export default ({ children, tasks }) => {
  // We only ever want to start the sagas once
  runMiddlewareOnce(tasks || {})
  return (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  )
}
