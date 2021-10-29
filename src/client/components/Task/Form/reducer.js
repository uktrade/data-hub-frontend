import { omit } from 'lodash'

export default (
  state = {
    values: {},
    touched: {},
    errors: {},
    fields: {},
    currentStep: 0,
    steps: [],
  },
  { type, result, ...action }
) => {
  switch (type) {
    case 'TASK_FORM__LOADED':
      return {
        ...state,
        values: {
          ...state.values,
          ...action.initialValues,
        },
      }
    case 'TASK_FORM__RESOLVED':
      return {
        ...state,
        result,
        // TODO: This might wreac havoc in useEffect
        resolved: true,
      }
    case 'TASK_FORM__FIELD_REGISTER':
      return {
        ...state,
        values: {
          ...state.previousValues,
          ...state.values,
          [action.field.name]:
            state.values?.[action.field.name] ?? action.field.initialValue,
        },
        touched: {
          ...state.touched,
          [action.field.name]: false,
        },
        fields: {
          ...state.fields,
          [action.field.name]: action.field,
        },
      }
    case 'TASK_FORM__FIELD_DEREGISTER':
      return {
        ...state,
        values: omit(state.values, action.fieldName),
        errors: omit(state.errors, action.fieldName),
        touched: omit(state.touched, action.fieldName),
        fields: omit(state.fields, action.fieldName),
      }
    case 'TASK_FORM__FIELD_SET_VALUE':
      return {
        ...state,
        values: {
          ...state.values,
          [action.fieldName]: action.fieldValue,
        },
      }
    case 'TASK_FORM__FIELD_TOUCHED':
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.fieldName]: true,
        },
      }
    case 'TASK_FORM__VALIDATE':
      return {
        ...state,
        errors: action.errors,
        touched: action.touched,
      }
    case 'TASK_FORM__FORWARD':
      return {
        ...state,
        currentStep: state.currentStep + 1,
        previousValues: state.values,
      }
    case 'TASK_FORM__BACK':
      return {
        ...state,
        currentStep: state.currentStep - 1,
        previousValues: state.values,
      }
    case 'TASK_FORM__STEP_REGISTER':
      return {
        ...state,
        steps: !state.steps.includes(action.stepName)
          ? [...state.steps, action.stepName]
          : state.steps,
      }
    case 'TASK_FORM__STEP_DEREGISTER':
      return {
        ...state,
        steps: state.steps.filter((s) => s !== action.stepName),
      }
    default:
      return state
  }
}
