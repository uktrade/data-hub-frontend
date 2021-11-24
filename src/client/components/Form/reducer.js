import { omit } from 'lodash'

import {
  FORM__LOADED,
  FORM__FIELD_SET_VALUE,
  FORM__FIELD_TOUCHED,
  FORM__FIELD_REGISTER,
  FORM__FIELD_DEREGISTER,
  FORM__STEP_REGISTER,
  FORM__STEP_DEREGISTER,
  FORM__FORWARD,
  FORM__BACK,
  FORM__VALIDATE,
} from '../../../client/actions'

export default (
  state = {
    values: {},
    touched: {},
    errors: {},
    fields: {},
    currentStep: 0,
    steps: [],
  },
  { type, ...action }
) => {
  switch (type) {
    case FORM__LOADED:
      return {
        ...state,
        values: {
          ...action.initialValues,
          ...state.values,
        },
      }
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
        values: omit(state.values, action.fieldName),
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
