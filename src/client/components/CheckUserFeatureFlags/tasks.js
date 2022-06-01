import { apiProxyAxios } from '../Task/utils'

const handleError = (error) => Promise.reject(Error(error.response.data.detail))

export const getUserFeatureFlags = async (userFeatureFlagName) =>
  apiProxyAxios
    .get('/whoami/')
    .then(({ data }) => data.active_features.includes(userFeatureFlagName))
    .catch(handleError)
