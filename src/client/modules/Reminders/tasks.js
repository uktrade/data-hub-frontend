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

// *************************** Export lists ***************************

export const getExportsNoRecentInteractionReminders = ({
  sortby = '-created_on',
  page = 1,
  limit = 10,
} = {}) =>
  apiProxyAxios
    .get('/v4/reminder/no-recent-export-interaction', {
      params: { sortby, limit, offset: getPageOffset({ page, limit }) },
    })
    .then(({ data }) => data)

export const getNextExportNoRecentInteractionReminder = ({
  sortby = '-created_on',
  page = 1,
  limit = 10,
} = {}) =>
  apiProxyAxios
    .get('/v4/reminder/no-recent-export-interaction', {
      params: {
        sortby,
        limit: 1,
        offset: Math.max(getPageOffset({ page: page + 1, limit }) - 1, 1),
      },
    })
    .then(({ data }) => data.results)

export const deleteExportNoRecentInteractionReminder = ({ id } = {}) =>
  apiProxyAxios.delete(`/v4/reminder/no-recent-export-interaction/${id}`)

export const getExportsNewInteractionReminders = ({
  sortby = '-created_on',
  page = 1,
  limit = 10,
} = {}) =>
  apiProxyAxios
    .get('/v4/reminder/new-export-interaction', {
      params: { sortby, limit, offset: getPageOffset({ page, limit }) },
    })
    .then(({ data }) => data)

export const getNextExportsNewInteractionReminder = ({
  sortby = '-created_on',
  page = 1,
  limit = 10,
} = {}) =>
  apiProxyAxios
    .get('/v4/reminder/new-export-interaction', {
      params: {
        sortby,
        limit: 1,
        offset: Math.max(getPageOffset({ page: page + 1, limit }) - 1, 1),
      },
    })
    .then(({ data }) => data.results)

export const deleteExportNewInteractionReminder = ({ id } = {}) =>
  apiProxyAxios.delete(`/v4/reminder/new-export-interaction/${id}`)

// *************************** My tasks lists ***************************

export const getMyTasksDueDateApproachingReminders = ({
  sortby = '-created_on',
  page = 1,
  limit = 10,
} = {}) =>
  apiProxyAxios
    .get('/v4/reminder/my-tasks-due-date-approaching', {
      params: { sortby, limit, offset: getPageOffset({ page, limit }) },
    })
    .then(({ data }) => data)

export const getMyTasksNextDueDateApproachingReminder = ({
  sortby = '-created_on',
  page = 1,
  limit = 10,
} = {}) =>
  apiProxyAxios
    .get('/v4/reminder/my-tasks-due-date-approaching', {
      params: {
        sortby,
        limit: 1,
        offset: Math.max(getPageOffset({ page: page + 1, limit }) - 1, 1),
      },
    })
    .then(({ data }) => data.results)

export const deleteMyTasksDueDateApproachingReminder = ({ id } = {}) =>
  apiProxyAxios.delete(`/v4/reminder/my-tasks-due-date-approaching/${id}`)

// ********************** Summary ***************************

const defaultDaysSort = (a, b) => a - b
const reversedDaysSort = (a, b) => b - a

const transformSubscriptionSummary = ({ data }) => ({
  estimatedLandDate: transformDaysAndEmailReminders(
    data.estimated_land_date,
    'days before the estimated land date',
    reversedDaysSort
  ),
  noRecentInteraction: transformDaysAndEmailReminders(
    data.no_recent_investment_interaction,
    'days after the last interaction'
  ),
  exportNoRecentInteractions: transformDaysAndEmailReminders(
    data.no_recent_export_interaction,
    'days after the last interaction'
  ),
  exportNewInteractions: transformDaysAndEmailReminders(
    data.new_export_interaction,
    'days after a new interaction was posted'
  ),
})

const transformDaysAndEmailReminders = (
  data,
  suffixLabel,
  daysSort = defaultDaysSort
) => ({
  formattedReminderDays: transformFormattedReminderDays(
    data,
    suffixLabel,
    daysSort
  ),
  emailRemindersOnOff: transformEmailReminders(data),
})

const transformFormattedReminderDays = (
  data,
  suffixLabel,
  sort = defaultDaysSort
) => formatDays(data.reminder_days.sort(sort), suffixLabel)

const transformEmailReminders = (data) =>
  data.email_reminders_enabled ? settings.ON : settings.OFF

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

export const getNIExportSubscriptions = () =>
  apiProxyAxios
    .get('/v4/reminder/subscription/new-export-interaction')
    .then(({ data }) => ({
      ...transformReminderDaysToForm(
        [...data.reminder_days].sort((a, b) => a - b)
      ),
      reminder_days: data.reminder_days,
      email_reminders_enabled: data.email_reminders_enabled,
    }))

export const saveNIExportSubscriptions = (payload) =>
  apiProxyAxios.patch(
    '/v4/reminder/subscription/new-export-interaction',
    payload
  )
