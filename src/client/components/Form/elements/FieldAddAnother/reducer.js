import {
  FIELD_ADD_ANOTHER__ADD,
  FIELD_ADD_ANOTHER__INITIALISE,
  FIELD_ADD_ANOTHER__REMOVE,
} from '../../../../actions'

export default (
  state = { fieldGroupIds: [] },
  { type, fieldGroupId, initialChildGroupCount }
) => {
  switch (type) {
    case FIELD_ADD_ANOTHER__INITIALISE:
      return {
        ...state,
        fieldGroupIds: [...Array(initialChildGroupCount)].map(
          (value, index) => ({
            fieldGroupId: index,
          })
        ),
      }
    case FIELD_ADD_ANOTHER__ADD:
      const maximumFieldIdValue = state.fieldGroupIds
        .map((item) => item.fieldGroupId)
        .reduce((previous, current) => {
          return current > previous ? current : previous
        }, 0)
      return {
        ...state,
        fieldGroupIds: [
          ...state.fieldGroupIds,
          { fieldGroupId: maximumFieldIdValue + 1 },
        ],
      }
    case FIELD_ADD_ANOTHER__REMOVE:
      return {
        ...state,
        fieldGroupIds: state.fieldGroupIds.filter(
          (item) => item.fieldGroupId !== fieldGroupId
        ),
      }
    default:
      return state
  }
}
