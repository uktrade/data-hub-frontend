import {
  GET_REQUIRED_FIELDS_AFTER_STAGE,
  STAGE_ID_TO_INDEX_MAP,
} from '../../../components/MyInvestmentProjects/constants'

export const isFieldRequiredForStage = (fieldName, project) => {
  return (
    STAGE_ID_TO_INDEX_MAP[GET_REQUIRED_FIELDS_AFTER_STAGE[fieldName]] <
    STAGE_ID_TO_INDEX_MAP[project?.stage?.id]
  )
}

export const isFieldOptionalForStageLabel = (fieldName, project) => {
  return isFieldRequiredForStage(fieldName, project) ? '' : ' (optional)'
}

export const validateFieldForStage = (field, formFields, project, message) => {
  return !formFields.values[field.name] &&
    isFieldRequiredForStage(field.name, project)
    ? message
    : null
}
