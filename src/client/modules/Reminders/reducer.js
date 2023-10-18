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
} from '../../actions'

const initialState = {
  estimatedLandDateReminders: {
    results: [],
    count: 0,
    nextPending: false,
  },
  noRecentInteractionReminders: {
    results: [],
    count: 0,
    nextPending: false,
  },
  outstandingPropositionsReminders: {
    results: [],
    count: 0,
  },
  exportsNoRecentInteractionReminders: {
    results: [],
    count: 0,
    nextPending: false,
  },
  exportsNewInteractionReminders: {
    results: [],
    count: 0,
    nextPending: false,
  },
  dueDateApproachingReminders: {
    results: [],
    count: 0,
    nextPending: false,
  },
}

export default (state = initialState, { type, result, payload }) => {
  switch (type) {
    case REMINDERS__ESTIMATED_LAND_DATE_REMINDERS_LOADED:
      return {
        ...state,
        estimatedLandDateReminders: result,
      }
    case REMINDERS__ESTIMATED_LAND_DATE_REMINDER_DELETED:
      return {
        ...state,
        estimatedLandDateReminders: {
          ...state.estimatedLandDateReminders,
          results: state.estimatedLandDateReminders.results.map((item) => ({
            ...item,
            deleted: item.deleted || item.id === payload.id,
          })),
          count: state.estimatedLandDateReminders.count - 1,
          nextPending: true,
        },
      }
    case REMINDERS__ESTIMATED_LAND_DATE_REMINDER_GOT_NEXT:
      return {
        ...state,
        estimatedLandDateReminders: {
          ...state.estimatedLandDateReminders,
          results: [...state.estimatedLandDateReminders.results, ...result],
          nextPending: false,
        },
      }
    case REMINDERS__NO_RECENT_INTERACTION_REMINDERS_LOADED:
      return {
        ...state,
        noRecentInteractionReminders: result,
      }
    case REMINDERS__NO_RECENT_INTERACTION_REMINDER_DELETED:
      return {
        ...state,
        noRecentInteractionReminders: {
          ...state.noRecentInteractionReminders,
          results: state.noRecentInteractionReminders.results.map((item) => ({
            ...item,
            deleted: item.deleted || item.id === payload.id,
          })),
          count: state.noRecentInteractionReminders.count - 1,
          nextPending: true,
        },
      }
    case REMINDERS__NO_RECENT_INTERACTION_REMINDER_GOT_NEXT:
      return {
        ...state,
        noRecentInteractionReminders: {
          ...state.noRecentInteractionReminders,
          results: [...state.noRecentInteractionReminders.results, ...result],
          nextPending: false,
        },
      }
    case REMINDERS__OUTSTANDING_PROPOSITIONS_LOADED:
      return {
        ...state,
        outstandingPropositionsReminders: result,
      }
    case REMINDERS__EXPORTS_NO_RECENT_INTERACTION_REMINDERS_LOADED:
      return {
        ...state,
        exportsNoRecentInteractionReminders: result,
      }
    case REMINDERS__EXPORTS_NO_RECENT_INTERACTION_REMINDERS_DELETED:
      return {
        ...state,
        exportsNoRecentInteractionReminders: {
          ...state.exportsNoRecentInteractionReminders,
          results: state.exportsNoRecentInteractionReminders.results.map(
            (item) => ({
              ...item,
              deleted: item.deleted || item.id === payload.id,
            })
          ),
          count: state.exportsNoRecentInteractionReminders.count - 1,
          nextPending: true,
        },
      }
    case REMINDERS__EXPORTS_NO_RECENT_INTERACTION_REMINDERS_GOT_NEXT:
      return {
        ...state,
        exportsNoRecentInteractionReminders: {
          ...state.exportsNoRecentInteractionReminders,
          results: [
            ...state.exportsNoRecentInteractionReminders.results,
            ...result,
          ],
          nextPending: false,
        },
      }
    case REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_LOADED:
      return {
        ...state,
        exportsNewInteractionReminders: result,
      }
    case REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_DELETED:
      return {
        ...state,
        exportsNewInteractionReminders: {
          ...state.exportsNewInteractionReminders,
          results: state.exportsNewInteractionReminders.results.map((item) => ({
            ...item,
            deleted: item.deleted || item.id === payload.id,
          })),
          count: state.exportsNewInteractionReminders.count - 1,
          nextPending: true,
        },
      }
    case REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_GOT_NEXT:
      return {
        ...state,
        exportsNewInteractionReminders: {
          ...state.exportsNewInteractionReminders,
          results: [...state.exportsNewInteractionReminders.results, ...result],
          nextPending: false,
        },
      }
    case REMINDERS__DUE_DATE_APPROACHING_REMINDERS_LOADED:
      return {
        ...state,
        dueDateApproachingReminders: result,
      }
    default:
      return state
  }
}
