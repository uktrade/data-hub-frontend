import _ from 'lodash'

import {
  FIELD_ADD_ANOTHER__ADD,
  FIELD_ADD_ANOTHER__REMOVE,
} from '../../../../actions'

export default (state = {}, { type, initialChildGroupCount, fieldGroupId }) => {
  const {
    items = _(initialChildGroupCount).range().keyBy().value(),
    currentId = initialChildGroupCount,
  } = state

  switch (type) {
    case FIELD_ADD_ANOTHER__ADD: {
      return {
        currentId: currentId + 1,
        items: {
          ...items,
          [currentId]: currentId,
        },
      }
    }
    case FIELD_ADD_ANOTHER__REMOVE:
      const itemsCopy = { ...items }
      delete itemsCopy[fieldGroupId]
      return {
        ...state,
        items: itemsCopy,
      }
    default:
      return state
  }
}
