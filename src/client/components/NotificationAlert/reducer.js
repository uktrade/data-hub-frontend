import { REMINDER_SUMMARY__LOADED } from '../../actions'

export const INITIAL_STATE = {
  count: 0,
  investment: {
    estimated_land_date: 0,
    no_recent_interaction: 0,
    outstanding_propositions: 0,
  },
  export: {
    no_recent_interaction: 0,
    new_interaction: 0,
  },
  my_tasks: {
    due_date_approaching: 0,
    task_assigned_to_me_from_others: 0,
    task_amended_by_others: 0,
    task_overdue: 0,
    task_completed: 0,
    task_deleted_by_others: 0,
  },
}

export default (state = INITIAL_STATE, { type, result }) => {
  switch (type) {
    case REMINDER_SUMMARY__LOADED:
      return {
        ...result,
      }
    default:
      return state
  }
}
