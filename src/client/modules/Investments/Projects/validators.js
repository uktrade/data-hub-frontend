import {
  GET_REQUIRED_FIELDS_AFTER_STAGE,
  STAGE_ID_TO_INDEX_MAP,
} from '../../../components/MyInvestmentProjects/constants'

export const investmentProjectValidateFieldForStage = (
  field,
  formFields,
  project,
  message
) => {
  if (
    !formFields.values[field.name] &&
    STAGE_ID_TO_INDEX_MAP[GET_REQUIRED_FIELDS_AFTER_STAGE[field.name]] <=
      STAGE_ID_TO_INDEX_MAP[project.stage.id]
  ) {
    return message
  }
  return null
}
