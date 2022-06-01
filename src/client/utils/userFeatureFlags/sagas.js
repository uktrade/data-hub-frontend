import { put, take } from 'redux-saga/effects'
import {
  GET_USER_FEATURE_FLAGS,
  GET_USER_FEATURE_FLAGS__COMPLETED,
} from '../../actions'
import { apiProxyAxios } from '../../components/Task/utils'

export const ID = 'userFeatureFlags'

export function* setUserFeatureFlags() {
  while (true) {
    yield take(GET_USER_FEATURE_FLAGS)

    const userFeatureFlags = yield apiProxyAxios
      .get('/whoami/')
      .then(({ data }) => {
        return data.active_features
      })

    yield put({
      type: GET_USER_FEATURE_FLAGS__COMPLETED,
      userFeatureFlags,
    })
  }
}
