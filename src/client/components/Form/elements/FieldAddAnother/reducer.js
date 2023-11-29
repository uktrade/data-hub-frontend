import {
  FIELD_ADD_ANOTHER__ADD,
  FIELD_ADD_ANOTHER__REMOVE,
} from '../../../../actions'

export default (state = { currentId: 0, items: {} }, action) => {
  const currentId = Object.keys(action.initialItems).length

  switch (action.type) {
    case FIELD_ADD_ANOTHER__ADD: {
      return {
        currentId: currentId + 1,
        items: {
          ...state.items,
          ...action.initialItems,
          [currentId]: 'whatever',
        },
      }
    }
    case FIELD_ADD_ANOTHER__REMOVE:
      const itemsCopy = {
        ...state.items,
        ...action.initialItems,
      }
      delete itemsCopy[action.fieldGroupId]
      return {
        ...state,
        currentId: currentId - 1,
        items: itemsCopy,
      }
    default:
      return state
  }
}
