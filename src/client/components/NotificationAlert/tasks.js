import { apiProxyAxios } from '../Task/utils'

const transformNotificationAlertCount = ({ data }) => ({ count: data.count })

export const fetchNotificationAlertCount = () =>
  apiProxyAxios
    .get('/v4/reminder/summary')
    .then(transformNotificationAlertCount)
