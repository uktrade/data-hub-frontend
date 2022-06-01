import { apiProxyAxios } from '../Task/utils'

const handleError = () => Promise.reject()

export const getUserFeatureFlags = async (userFeatureFlagName) =>
  apiProxyAxios
    .get('/whoami/')
    .then(({ data }) => data.active_features.includes(userFeatureFlagName))
    .catch(handleError)
