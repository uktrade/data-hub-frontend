import { TASK__START } from '../../actions'
import multiinstance from '../../utils/multiinstance'

export default multiinstance({
  name: 'Task/RecentResult',
  actionPattern: /.*/,
  idProp: 'name',
  reducer: (state, { type, id, onSuccessDispatch, result }) => {
    switch (type) {
      case TASK__START:
        return {
          ...state,
          [id]: {
            ...state?.[id],
            successActionType: onSuccessDispatch,
          },
        }
      case state?.[id]?.successActionType:
        return {
          ...state,
          [id]: { result },
        }
      default:
        return state
    }
  },
  component: ({ children, id, ...props }) => children(props[id]?.result),
})
