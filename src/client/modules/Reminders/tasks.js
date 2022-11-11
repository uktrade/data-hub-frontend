import { getPageOffset } from '../../utils/pagination'
import { apiProxyAxios } from '../../components/Task/utils'
import { formatDays, transformReminderDaysToForm } from './transformers'
import { settings } from './constants'

// *************************** Investment lists ***************************

export const getEstimatedLandDateReminders = ({
  sortby = '-created_on',
  page = 1,
  limit = 10,
} = {}) =>
  apiProxyAxios
    .get('/v4/reminder/estimated-land-date', {
      params: { sortby, limit, offset: getPageOffset({ page, limit }) },
    })
    .then(({ data }) => data)

export const getNextEstimatedLandDateReminder = ({
  sortby = '-created_on',
  page = 1,
  limit = 10,
} = {}) =>
  apiProxyAxios
    .get('/v4/reminder/estimated-land-date', {
      params: {
        sortby,
        limit: 1,
        offset: Math.max(getPageOffset({ page: page + 1, limit }) - 1, 1),
      },
    })
    .then(({ data }) => data.results)

export const getNoRecentInteractionReminders = ({
  sortby = '-created_on',
  page = 1,
  limit = 10,
} = {}) =>
  apiProxyAxios
    .get('/v4/reminder/no-recent-investment-interaction', {
      params: { sortby, limit, offset: getPageOffset({ page, limit }) },
    })
    .then(({ data }) => data)

export const getNextNoRecentInteractionReminder = ({
  sortby = '-created_on',
  page = 1,
  limit = 10,
} = {}) =>
  apiProxyAxios
    .get('/v4/reminder/no-recent-investment-interaction', {
      params: {
        sortby,
        limit: 1,
        offset: Math.max(getPageOffset({ page: page + 1, limit }) - 1, 1),
      },
    })
    .then(({ data }) => data.results)

export const deleteEstimatedLandDateReminder = ({ id } = {}) =>
  apiProxyAxios.delete(`/v4/reminder/estimated-land-date/${id}`)

export const deleteNoRecentInteractionReminder = ({ id } = {}) =>
  apiProxyAxios.delete(`/v4/reminder/no-recent-investment-interaction/${id}`)

// *************************** Outstanding propositions list ***************************

export const getOutstandingPropositions = ({
  page = 1,
  limit = 10,
  status = 'ongoing',
  sortby = 'deadline',
}) =>
  apiProxyAxios
    .get('/whoami/')
    .then(({ data }) =>
      apiProxyAxios.get('/v4/proposition', {
        params: {
          limit,
          status,
          sortby,
          adviser_id: data.id,
          offset: getPageOffset({ page, limit }),
        },
      })
    )
    .then(({ data }) => data)

// ********************** Summary ***************************

const transformSubscriptionSummary = ({ data }) => ({
  estimatedLandDate: {
    formattedReminderDays: formatDays(
      data.estimated_land_date.reminder_days.sort((a, b) => a - b).reverse(),
      'days before the estimated land date'
    ),
    emailRemindersOnOff: data.estimated_land_date.email_reminders_enabled
      ? settings.ON
      : settings.OFF,
  },
  noRecentInteraction: {
    formattedReminderDays: formatDays(
      data.no_recent_investment_interaction.reminder_days.sort((a, b) => a - b),
      'days after the last interaction'
    ),
    emailRemindersOnOff: data.no_recent_investment_interaction
      .email_reminders_enabled
      ? settings.ON
      : settings.OFF,
  },
  exportNoRecentInteractions: {
    formattedReminderDays: formatDays(
      data.no_recent_export_interaction.reminder_days.sort((a, b) => a - b),
      'days after the last interaction'
    ),
    emailRemindersOnOff: data.no_recent_export_interaction
      .email_reminders_enabled
      ? settings.ON
      : settings.OFF,
  },
})

export const getSubscriptionSummary = () =>
  apiProxyAxios
    .get('/v4/reminder/subscription/summary')
    .then(transformSubscriptionSummary)

// ********************** Investment subscriptions ***************************

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

export const getNriSubscriptions = () =>
  apiProxyAxios
    .get('/v4/reminder/subscription/no-recent-investment-interaction')
    .then(({ data }) => ({
      ...transformReminderDaysToForm(
        [...data.reminder_days].sort((a, b) => a - b)
      ),
      reminder_days: data.reminder_days,
      email_reminders_enabled: data.email_reminders_enabled,
    }))

export const saveNriSubscriptions = (payload) =>
  apiProxyAxios.patch(
    '/v4/reminder/subscription/no-recent-investment-interaction',
    payload
  )

// **********************  Export subscriptions ***************************

export const getNriExportSubscriptions = () =>
  apiProxyAxios
    .get('/v4/reminder/subscription/no-recent-export-interaction')
    .then(({ data }) => ({
      ...transformReminderDaysToForm(
        [...data.reminder_days].sort((a, b) => a - b)
      ),
      reminder_days: data.reminder_days,
      email_reminders_enabled: data.email_reminders_enabled,
    }))

export const saveNriExportSubscriptions = (payload) =>
  apiProxyAxios.patch(
    '/v4/reminder/subscription/no-recent-export-interaction',
    payload
  )
