import {
  EVENTS__FORM_METADATA_LOADED,
  ADD_EVENT_FORM__SUBMIT,
  TASK__ERROR,
} from '../../../../client/actions'

const initialState = {
  formData: {
    eventTypeOptions: [],
    relatedTradeAgreements: [],
    eventLocationTypes: [],
    countries: [],
    teams: [],
    programmes: [],
    ukRegions: [],
    initialValues: {},
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
        formData: result,
        isComplete: true,
      }
    case ADD_EVENT_FORM__SUBMIT:
      return {
        ...state,
        createdEventId: [201].includes(result.status)
          ? result.data.id
          : undefined,
        createdEventName: [201].includes(result.status)
          ? result.data.name
          : undefined,
        updatedEventId: [200].includes(result.status)
          ? result.data.id
          : undefined,
        updatedEventName: [200].includes(result.status)
          ? result.data.name
          : undefined,
        progress: true,
      }
    default:
      return state
  }
}
