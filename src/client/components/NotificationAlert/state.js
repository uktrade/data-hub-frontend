import urls from '../../../lib/urls'

export const ID = 'reminderSummary'
export const TASK_GET_REMINDER_SUMMARY = 'TASK_GET_REMINDER_SUMMARY'

export const state2props = (state) => {
  return {
    ...state[ID],
    remindersURL: urls.reminders.index(),
  }
}
