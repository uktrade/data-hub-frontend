import {
  EVENTS__FORM_METADATA_LOADED,
  ADD_EVENT_FORM__SUBMIT,
  TASK__ERROR,
} from '../../../../client/actions'

const initialState = {
  metadata: {
    eventTypeOptions: [],
    relatedTradeAgreements: [],
    eventLocationTypes: [],
    countries: [],
    teams: [],
    programmes: [],
    ukRegions: [],
  },
  isComplete: false,
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case TASK__ERROR:
      return {
        ...state,
        progress: false,
      }
    case EVENTS__FORM_METADATA_LOADED:
      return {
        ...state,
        metadata: result,
        isComplete: true,
      }
    case ADD_EVENT_FORM__SUBMIT:
      return {
        ...state,
        updatedEventId: [200, 201].includes(result.status)
          ? result.data.id
          : undefined,
        progress: true,
      }
    default:
      return state
  }
}
