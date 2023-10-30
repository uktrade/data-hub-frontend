import { getPageOffset } from '../../utils/pagination'
import { apiProxyAxios } from '../../components/Task/utils'

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
