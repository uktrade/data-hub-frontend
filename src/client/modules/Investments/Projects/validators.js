import {
  GET_REQUIRED_FIELDS_AFTER_STAGE,
  STAGE_ID_TO_INDEX_MAP,
} from '../../../components/MyInvestmentProjects/constants'

export const isFieldRequiredForStage = (fieldName, project) => {
  return (
    STAGE_ID_TO_INDEX_MAP[GET_REQUIRED_FIELDS_AFTER_STAGE[fieldName]] <=
    STAGE_ID_TO_INDEX_MAP[project?.stage?.id]
  )
}

export const isFieldRequiredForNextStage = (fieldName, project) => {
  return (
    STAGE_ID_TO_INDEX_MAP[GET_REQUIRED_FIELDS_AFTER_STAGE[fieldName]] ===
    STAGE_ID_TO_INDEX_MAP[project?.stage?.id] + 1
  )
}

export const isFieldOptionalForStageLabel = (fieldName, project) => {
  return isFieldRequiredForStage(fieldName, project)
    ? ' (required)'
    : isFieldRequiredForNextStage(fieldName, project)
      ? ' (required for next stage)'
      : ' (optional)'
}

export const validateFieldForStage = (field, formFields, project, message) => {
  return (!formFields.values[field.name] ||
    formFields.values[field.name].length == 0) &&
    isFieldRequiredForStage(field.name, project)
    ? message
    : null
}
