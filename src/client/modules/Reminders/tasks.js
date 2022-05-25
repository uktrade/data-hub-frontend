import { apiProxyAxios } from '../../components/Task/utils'
import { transformDays } from './transformers'
import { settings } from './constants'

const transformResponse = ([esl, nri]) => ({
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
  ]).then(transformResponse)
