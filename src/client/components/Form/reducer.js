import { omit } from 'lodash'

import {
  FORM__BACK,
  FORM__FIELD_DEREGISTER,
  FORM__FIELD_REGISTER,
  FORM__FIELD_SET_VALUE,
  FORM__FIELDS__RESET,
  FORM__ERRORED,
  FORM__FORWARD,
  FORM__LOADED,
  FORM__RESOLVED,
  FORM__STEP_DEREGISTER,
  FORM__STEP_REGISTER,
  FORM__VALIDATE,
  FORM__FIELD_TOUCHED,
  FORM__GO_TO_STEP,
} from '../../actions'

export default (
  state = {
    values: {},
    touched: {},
    errors: {},
    errorStatus: 0,
    fields: {},
    currentStep: 0,
    steps: [],
  },
  { type, result, ...action }
) => {
  switch (type) {
    case FORM__LOADED:
      return {
        ...state,
        values: {
          ...state.values,
          ...action.initialValues,
        },
        keepValuesOnDeregister: action.keepValuesOnDeregister ?? false,
        currentStep: action.initialStepIndex,
      }
    case FORM__FIELDS__RESET:
      return {
        values: {
          ...action.values,
        },
        touched: {},
        errors: {},
        errorStatus: 0,
        fields: {
          ...state.fields,
        },
        currentStep: 0,
        steps: [...state.steps],
      }
    case FORM__RESOLVED:
      return {
        ...state,
        result,
        resolved: true,
      }
    case 'FORM__RESET_RESOLVED':
      return omit(state, 'result', 'resolved')
    case FORM__FIELD_REGISTER:
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
    case FORM__FIELD_DEREGISTER:
      return {
        ...state,
        values: state.keepValuesOnDeregister
          ? state.values
          : omit(state.values, action.fieldName),
        errors: omit(state.errors, action.fieldName),
        touched: omit(state.touched, action.fieldName),
        fields: omit(state.fields, action.fieldName),
      }
    case FORM__FIELD_SET_VALUE:
      return {
        ...state,
        values: {
          ...state.values,
          [action.fieldName]: action.fieldValue,
        },
      }
    case 'FORM__FIELD_SET_VALUES':
      return {
        ...state,
        values: {
          ...state.values,
          ...action.values,
        },
      }
    case FORM__FIELD_TOUCHED:
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.fieldName]: true,
        },
      }
    case FORM__VALIDATE:
      return {
        ...state,
        errors: action.errors,
        touched: action.touched,
      }
    case FORM__ERRORED:
      return {
        ...state,
        errors: action.errors,
        touched: Object.fromEntries(
          Object.keys(action.errors).map((key) => [key, true])
        ),
        errorStatus: action.httpStatusCode,
      }
    case FORM__FORWARD:
      return {
        ...state,
        currentStep: state.currentStep + 1,
        previousValues: state.values,
      }
    case FORM__BACK:
      return {
        ...state,
        currentStep: state.currentStep - 1,
        previousValues: state.values,
      }
    case FORM__GO_TO_STEP:
      const nextCurrentStep = action.stepName
        ? state.steps.indexOf(action.stepName)
        : 0
      return {
        ...state,
        currentStep: nextCurrentStep, // TODO: rename this to currentStepIndex
        currentStepName: action.stepName,
        previousValues: state.values,
      }
    case FORM__STEP_REGISTER:
      return {
        ...state,
        steps: !state.steps.includes(action.stepName)
          ? [...state.steps, action.stepName]
          : state.steps,
      }
    case FORM__STEP_DEREGISTER:
      return {
        ...state,
        steps: state.steps.filter((s) => s !== action.stepName),
      }
    default:
      return state
  }
}
