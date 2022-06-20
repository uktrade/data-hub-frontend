import { getPageOffset } from '../../utils/pagination'
import { apiProxyAxios } from '../../components/Task/utils'
import { formatDays } from './transformers'
import { settings } from './constants'

const transformAllSubscriptions = ([eld, nri]) => ({
  estimatedLandDate: {
    formattedReminderDays: formatDays(
      eld.data.reminder_days.sort((a, b) => a - b).reverse(),
      'days before the estimated land date'
    ),
    emailRemindersOnOff: eld.data.email_reminders_enabled
      ? settings.ON
      : settings.OFF,
  },
  noRecentInteraction: {
    formattedReminderDays: formatDays(
      nri.data.reminder_days.sort((a, b) => a - b),
      'days after the last interaction'
    ),
    emailRemindersOnOff: nri.data.email_reminders_enabled
      ? settings.ON
      : settings.OFF,
  },
})

export const getAllSubscriptions = () =>
  Promise.all([
    apiProxyAxios.get('/v4/reminder/subscription/estimated-land-date'),
    apiProxyAxios.get(
      '/v4/reminder/subscription/no-recent-investment-interaction'
    ),
  ]).then(transformAllSubscriptions)

export const getEldSubscriptions = () =>
  apiProxyAxios
    .get('/v4/reminder/subscription/estimated-land-date')
    .then(({ data }) => ({
      estimatedLandDate: {
        reminderDays: data.reminder_days,
        emailRemindersEnabled: data.email_reminders_enabled,
      },
    }))

export const saveEldSubscriptions = (payload) =>
  apiProxyAxios.patch('/v4/reminder/subscription/estimated-land-date', payload)

export const getEstimatedLandDateReminders = ({ page = 1, limit = 10 } = {}) =>
  apiProxyAxios
    .get('/v4/reminder/estimated-land-date', {
      params: { limit, offset: getPageOffset({ page, limit }) },
    })
    .then(({ data }) => data)

export const getNoRecentInteractionReminders = ({
  page = 1,
  limit = 10,
} = {}) =>
  apiProxyAxios
    .get('/v4/reminder/no-recent-investment-interaction', {
      params: { limit, offset: getPageOffset({ page, limit }) },
    })
    .then(({ data }) => data)
