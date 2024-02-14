import React from 'react'
import _ from 'lodash'
import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux'

import rootSaga from './root-saga'
import * as middleware from './middleware'

const runMiddlewareOnce = _.once((tasks, sagaMiddleware) =>
  sagaMiddleware.run(rootSaga(tasks))
)

/**
 * Provides state management and routing infrastructure required by the
 * stateful/routed components.
 * @param {Object} props
 * @param {Object} props.tasks - A map of _task_ names to _tasks_, if required
 * by the wrapped components.
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
const DataHubProvider = ({
  tasks,
  store = middleware.store,
  history = middleware.history,
  sagaMiddleware = middleware.sagaMiddleware,
  children,
}) => {
  runMiddlewareOnce(tasks, sagaMiddleware)

  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>{children}</ConnectedRouter>
    </Provider>
  )
}

export default DataHubProvider
