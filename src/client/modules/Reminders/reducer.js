import { LOCATION_CHANGE } from 'redux-first-history'

import {
  REMINDERS__ESTIMATED_LAND_DATE_REMINDERS_LOADED,
  REMINDERS__ESTIMATED_LAND_DATE_REMINDER_DELETED,
  REMINDERS__ESTIMATED_LAND_DATE_REMINDER_GOT_NEXT,
  REMINDERS__NO_RECENT_INTERACTION_REMINDERS_LOADED,
  REMINDERS__NO_RECENT_INTERACTION_REMINDER_DELETED,
  REMINDERS__NO_RECENT_INTERACTION_REMINDER_GOT_NEXT,
  REMINDERS__EXPORTS_NO_RECENT_INTERACTION_REMINDERS_LOADED,
  REMINDERS__EXPORTS_NO_RECENT_INTERACTION_REMINDERS_DELETED,
  REMINDERS__EXPORTS_NO_RECENT_INTERACTION_REMINDERS_GOT_NEXT,
  REMINDERS__OUTSTANDING_PROPOSITIONS_LOADED,
  REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_LOADED,
  REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_DELETED,
  REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_GOT_NEXT,
  REMINDERS__DUE_DATE_APPROACHING_REMINDERS_LOADED,
  REMINDERS__DUE_DATE_APPROACHING_REMINDERS_GOT_NEXT,
  REMINDERS__DUE_DATE_APPROACHING_REMINDERS_DELETED,
  REMINDERS__TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDERS_LOADED,
  REMINDERS__TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDERS_GOT_NEXT,
  REMINDERS__TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDERS_DELETED,
  REMINDERS__TASK_AMENDED_BY_OTHERS_REMINDERS_LOADED,
  REMINDERS__TASK_AMENDED_BY_OTHERS_REMINDERS_GOT_NEXT,
  REMINDERS__TASK_AMENDED_BY_OTHERS_REMINDERS_DELETED,
  REMINDERS__TASK_OVERDUE_REMINDERS_LOADED,
  REMINDERS__TASK_OVERDUE_REMINDERS_GOT_NEXT,
  REMINDERS__TASK_OVERDUE_REMINDERS_DELETED,
  REMINDERS__TASK_COMPLETED_REMINDERS_LOADED,
  REMINDERS__TASK_COMPLETED_REMINDERS_GOT_NEXT,
  REMINDERS__TASK_COMPLETED_REMINDERS_DELETED,
} from '../../actions'

const initialState = {
  reminders: {
    results: [],
    count: 0,
    nextPending: false,
  },
}

export default (state = initialState, { type, result, payload }) => {
  switch (type) {
    case LOCATION_CHANGE:
      return {
        ...initialState,
      }
    case REMINDERS__DUE_DATE_APPROACHING_REMINDERS_LOADED:
    case REMINDERS__ESTIMATED_LAND_DATE_REMINDERS_LOADED:
    case REMINDERS__NO_RECENT_INTERACTION_REMINDERS_LOADED:
    case REMINDERS__EXPORTS_NO_RECENT_INTERACTION_REMINDERS_LOADED:
    case REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_LOADED:
    case REMINDERS__OUTSTANDING_PROPOSITIONS_LOADED:
    case REMINDERS__TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDERS_LOADED:
    case REMINDERS__TASK_AMENDED_BY_OTHERS_REMINDERS_LOADED:
    case REMINDERS__TASK_OVERDUE_REMINDERS_LOADED:
    case REMINDERS__TASK_COMPLETED_REMINDERS_LOADED:
      return {
        ...state,
        reminders: result,
      }
    case REMINDERS__DUE_DATE_APPROACHING_REMINDERS_DELETED:
    case REMINDERS__ESTIMATED_LAND_DATE_REMINDER_DELETED:
    case REMINDERS__NO_RECENT_INTERACTION_REMINDER_DELETED:
    case REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_DELETED:
    case REMINDERS__EXPORTS_NO_RECENT_INTERACTION_REMINDERS_DELETED:
    case REMINDERS__TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDERS_DELETED:
    case REMINDERS__TASK_AMENDED_BY_OTHERS_REMINDERS_DELETED:
    case REMINDERS__TASK_OVERDUE_REMINDERS_DELETED:
    case REMINDERS__TASK_COMPLETED_REMINDERS_DELETED:
      return {
        ...state,
        reminders: {
          ...state.reminders,
          results: state.reminders.results.map((item) => ({
            ...item,
            deleted: item.deleted || item.id === payload.id,
          })),
          count: state.reminders.count - 1,
          nextPending: true,
        },
      }
    case REMINDERS__DUE_DATE_APPROACHING_REMINDERS_GOT_NEXT:
    case REMINDERS__ESTIMATED_LAND_DATE_REMINDER_GOT_NEXT:
    case REMINDERS__NO_RECENT_INTERACTION_REMINDER_GOT_NEXT:
    case REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_GOT_NEXT:
    case REMINDERS__EXPORTS_NO_RECENT_INTERACTION_REMINDERS_GOT_NEXT:
    case REMINDERS__TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDERS_GOT_NEXT:
    case REMINDERS__TASK_AMENDED_BY_OTHERS_REMINDERS_GOT_NEXT:
    case REMINDERS__TASK_OVERDUE_REMINDERS_GOT_NEXT:
    case REMINDERS__TASK_COMPLETED_REMINDERS_GOT_NEXT:
      return {
        ...state,
        reminders: {
          ...state.reminders,
          results: [...state.reminders.results, ...result],
          nextPending: false,
        },
      }
    default:
      return state
  }
}
