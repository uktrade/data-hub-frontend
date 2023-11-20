import { ID } from '../NotificationAlert/state'
import urls from '../../../lib/urls'
import {
  COMPANIES_NEW_INTERACTIONS_LABEL,
  COMPANIES_NO_RECENT_INTERACTIONS_LABEL,
  INVESTMENTS_ESTIMATED_LAND_DATES_LABEL,
  INVESTMENTS_NO_RECENT_INTERACTIONS_LABEL,
  INVESTMENTS_OUTSTANDING_PROPOSITIONS_LABEL,
  MY_TASKS_DUE_DATE_APPROACHING_LABEL,
  TASK_ASSIGNED_TO_ME_FROM_OTHERS_LABEL,
  TASK_OVERDUE_LABEL,
  TASK_COMPLETED_LABEL,
} from '../../modules/Reminders/constants'

const transformReminderSummary = (data) => ({
  count: data.count,
  investment: [
    {
      name: INVESTMENTS_ESTIMATED_LAND_DATES_LABEL,
      url: urls.reminders.investments.estimatedLandDate(),
      count: data.investment.estimated_land_date,
    },
    {
      name: INVESTMENTS_NO_RECENT_INTERACTIONS_LABEL,
      url: urls.reminders.investments.noRecentInteraction(),
      count: data.investment.no_recent_interaction,
    },
    {
      name: INVESTMENTS_OUTSTANDING_PROPOSITIONS_LABEL,
      url: urls.reminders.investments.outstandingPropositions(),
      count: data.investment.outstanding_propositions,
    },
  ],
  export: [
    {
      name: COMPANIES_NO_RECENT_INTERACTIONS_LABEL,
      url: urls.reminders.exports.noRecentInteractions(),
      count: data.export.no_recent_interaction,
    },
    {
      name: COMPANIES_NEW_INTERACTIONS_LABEL,
      url: urls.reminders.exports.newInteractions(),
      count: data.export.new_interaction,
    },
  ],
  myTasks: [
    {
      name: MY_TASKS_DUE_DATE_APPROACHING_LABEL,
      url: urls.reminders.myTasks.dueDateApproaching(),
      count: data.my_tasks.due_date_approaching,
    },
    {
      name: TASK_ASSIGNED_TO_ME_FROM_OTHERS_LABEL,
      url: urls.reminders.myTasks.taskAssignedToMeFromOthers(),
      count: data.my_tasks.task_assigned_to_me_from_others,
    },
    {
      name: TASK_OVERDUE_LABEL,
      url: urls.reminders.myTasks.taskOverdue(),
      count: data.my_tasks.task_overdue,
    },
    {
      name: TASK_COMPLETED_LABEL,
      url: urls.reminders.myTasks.taskCompleted(),
      count: data.my_tasks.task_completed,
    },
  ],
})

export const state2props = (state) => {
  const summary = transformReminderSummary(state[ID])
  const hasExportFeatureGroup = state.activeFeatureGroups.includes(
    'export-notifications'
  )
  const hasInvestmentFeatureGroup = state.activeFeatureGroups.includes(
    'investment-notifications'
  )

  return {
    summary,
    hasExportFeatureGroup,
    hasInvestmentFeatureGroup,
  }
}
