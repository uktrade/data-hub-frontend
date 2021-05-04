import {
  TASK__ERROR,
  ADD_INTERACTION_FORM__SUBMIT,
  ADD_INTERACTION__GET_ACTIVE_EVENTS,
  ADD_INTERACTION_FORM_METADATA,
} from '../../../../../client/actions'

const initialState = {
  metaData: {
    services: [],
    serviceDeliveryStatuses: [],
    relatedTradeAgreements: [],
    policyAreas: [],
    policyIssueTypes: [],
  },
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case TASK__ERROR:
      return {
        ...state,
        progress: false,
      }

    case ADD_INTERACTION_FORM__SUBMIT:
      return {
        ...state,
        updatedInteractionId: [200, 201].includes(result.status)
          ? result.data.id
          : undefined,
        wasPolicyFeedbackProvided: [200, 201].includes(result.status)
          ? result.data.was_policy_feedback_provided
          : undefined,
        // Keep showing the loader while we redirect user to a new page.
        progress: true,
      }

    case ADD_INTERACTION__GET_ACTIVE_EVENTS:
      return {
        ...state,
        activeEvents: result,
      }

    case ADD_INTERACTION_FORM_METADATA:
      return {
        ...state,
        metaData: {
          ...result,
        },
      }

    default:
      return state
  }
}
