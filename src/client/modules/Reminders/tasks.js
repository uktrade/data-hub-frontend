import { getPageOffset } from '../../utils/pagination'
import { apiProxyAxios } from '../../components/Task/utils'

const getReminders = (sortby = '-created_on', page = 1, limit = 10, endpoint) =>
  apiProxyAxios
    .get(`/v4/reminder/${endpoint}`, {
      params: { sortby, limit, offset: getPageOffset({ page, limit }) },
    })
    .then(({ data }) => data)

const getNextReminder = (
  sortby = '-created_on',
  page = 1,
  limit = 10,
  endpoint
) =>
  apiProxyAxios
    .get(`/v4/reminder/${endpoint}`, {
      params: {
        sortby,
        limit: 1,
        offset: Math.max(getPageOffset({ page: page + 1, limit }) - 1, 1),
      },
    })
    .then(({ data }) => data.results)

// *************************** Investment lists ***************************

export const getEstimatedLandDateReminders = ({
  sortby = '-created_on',
  page = 1,
  limit = 10,
} = {}) => getReminders(sortby, page, limit, 'estimated-land-date')

export const getNextEstimatedLandDateReminder = ({
  sortby = '-created_on',
  page = 1,
  limit = 10,
} = {}) => getNextReminder(sortby, page, limit, 'estimated-land-date')

export const getNoRecentInteractionReminders = ({
  sortby = '-created_on',
  page = 1,
  limit = 10,
} = {}) => getReminders(sortby, page, limit, 'no-recent-investment-interaction')

export const getNextNoRecentInteractionReminder = ({
  sortby = '-created_on',
  page = 1,
  limit = 10,
} = {}) =>
  getNextReminder(sortby, page, limit, 'no-recent-investment-interaction')

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
} = {}) => getReminders(sortby, page, limit, 'no-recent-export-interaction')

export const getNextExportNoRecentInteractionReminder = ({
  sortby = '-created_on',
  page = 1,
  limit = 10,
} = {}) => getNextReminder(sortby, page, limit, 'no-recent-export-interaction')

export const deleteExportNoRecentInteractionReminder = ({ id } = {}) =>
  apiProxyAxios.delete(`/v4/reminder/no-recent-export-interaction/${id}`)

export const getExportsNewInteractionReminders = ({
  sortby = '-created_on',
  page = 1,
  limit = 10,
} = {}) => getReminders(sortby, page, limit, 'new-export-interaction')

export const getNextExportsNewInteractionReminder = ({
  sortby = '-created_on',
  page = 1,
  limit = 10,
} = {}) => getNextReminder(sortby, page, limit, 'new-export-interaction')

export const deleteExportNewInteractionReminder = ({ id } = {}) =>
  apiProxyAxios.delete(`/v4/reminder/new-export-interaction/${id}`)

// *************************** My tasks lists ***************************

export const getMyTasksDueDateApproachingReminders = ({
  sortby = '-created_on',
  page = 1,
  limit = 10,
} = {}) => getReminders(sortby, page, limit, 'my-tasks-due-date-approaching')

export const getMyTasksNextDueDateApproachingReminder = ({
  sortby = '-created_on',
  page = 1,
  limit = 10,
} = {}) => getNextReminder(sortby, page, limit, 'my-tasks-due-date-approaching')

export const deleteMyTasksDueDateApproachingReminder = ({ id } = {}) =>
  apiProxyAxios.delete(`/v4/reminder/my-tasks-due-date-approaching/${id}`)

export const getTaskAssignedToMeFromOthersReminders = ({
  sortby = '-created_on',
  page = 1,
  limit = 10,
} = {}) => getReminders(sortby, page, limit, 'task-assigned-to-me-from-others')

export const getNextTaskAssignedToMeFromOthersReminder = ({
  sortby = '-created_on',
  page = 1,
  limit = 10,
} = {}) =>
  getNextReminder(sortby, page, limit, 'task-assigned-to-me-from-others')

export const deleteTaskAssignedToMeFromOthersReminder = ({ id } = {}) =>
  apiProxyAxios.delete(`/v4/reminder/task-assigned-to-me-from-others/${id}`)

export const getTaskAmendedByOthersReminders = ({
  sortby = '-created_on',
  page = 1,
  limit = 10,
} = {}) => getReminders(sortby, page, limit, 'task-amended-by-others')

export const getNextTaskAmendedByOthersReminder = ({
  sortby = '-created_on',
  page = 1,
  limit = 10,
} = {}) => getNextReminder(sortby, page, limit, 'task-amended-by-others')

export const deleteTaskAmendedByOthersReminder = ({ id } = {}) =>
  apiProxyAxios.delete(`/v4/reminder/my-tasks-task-amended-by-others/${id}`)

export const getTaskOverdueReminders = ({
  sortby = '-created_on',
  page = 1,
  limit = 10,
} = {}) => getReminders(sortby, page, limit, 'my-tasks-task-overdue')

export const getNextTaskOverdueReminder = ({
  sortby = '-created_on',
  page = 1,
  limit = 10,
} = {}) => getNextReminder(sortby, page, limit, 'my-tasks-task-overdue')

export const deleteTaskOverdueReminder = ({ id } = {}) =>
  apiProxyAxios.delete(`/v4/reminder/my-tasks-task-overdue/${id}`)

export const getTaskCompletedReminders = ({
  sortby = '-created_on',
  page = 1,
  limit = 10,
} = {}) => getReminders(sortby, page, limit, 'my-tasks-task-completed')

export const getNextTaskCompletedReminder = ({
  sortby = '-created_on',
  page = 1,
  limit = 10,
} = {}) => getNextReminder(sortby, page, limit, 'my-tasks-task-completed')

export const deleteTaskCompletedReminder = ({ id } = {}) =>
  apiProxyAxios.delete(`/v4/reminder/my-tasks-task-completed/${id}`)
