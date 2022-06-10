import { getPageOffset } from '../../utils/pagination'
import { apiProxyAxios } from '../../components/Task/utils'
import { transformDays } from './transformers'
import { settings } from './constants'

const transformSubscriptionsResponse = ([esl, nri]) => ({
  estimatedLandDate: {
    reminderDays: transformDays(
      esl.data.reminder_days.sort((a, b) => a - b).reverse(),
      'days before the estimated land date'
    ),
    emailRemindersEnabled: esl.data.email_reminders_enabled
      ? settings.ON
      : settings.OFF,
  },
  noRecentInteraction: {
    reminderDays: transformDays(
      nri.data.reminder_days.sort((a, b) => a - b),
      'days after the last interaction'
    ),
    emailRemindersEnabled: nri.data.email_reminders_enabled
      ? settings.ON
      : settings.OFF,
  },
})

export const getSubscriptions = () =>
  Promise.all([
    apiProxyAxios.get('/v4/reminder/subscription/estimated-land-date'),
    apiProxyAxios.get(
      '/v4/reminder/subscription/no-recent-investment-interaction'
    ),
  ]).then(transformSubscriptionsResponse)

export const getEstimatedLandDateReminders = ({ page = 1, limit = 10 } = {}) =>
  apiProxyAxios
    .get('/v4/reminder/estimated-land-date', {
      params: { limit, offset: getPageOffset({ page, limit }) },
    })
    .then(({ data }) => data)
