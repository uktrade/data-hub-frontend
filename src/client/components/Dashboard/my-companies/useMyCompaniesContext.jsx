import { orderBy, pick } from 'lodash'
import { useReducer } from 'react'
import PropTypes from 'prop-types'
import createUseContext from 'constate'
import { FILTER_CHANGE, LIST_CHANGE, ORDER_CHANGE } from './constants'

export const filterCompanyName = (companies, filterText) =>
  filterText.length
    ? companies.filter((c) =>
        c.company.name.toLowerCase().includes(filterText.toLowerCase())
      )
    : companies

const defaultState = {
  lists: [],
  selectedIdx: 0,
  sortBy: 'recent',
  filter: '',
}

export const reducer = (state, { type, ...action }) => {
  switch (type) {
    case LIST_CHANGE:
      return { ...state, selectedIdx: action.idx }
    case FILTER_CHANGE:
      return { ...state, filter: action.filter }
    case ORDER_CHANGE:
      return { ...state, sortBy: action.sortBy }
    default:
      return state
  }
}

// We are unpacking children here just to remove them from initialState.
const useMyCompaniesContext = createUseContext(
  ({ deleteListPropsAccessor, addInteractionPropsAccessor, ...rest }) => {
    const initialState = pick(rest, [
      'lists',
      'selectedIdx',
      'sortBy',
      'filter',
    ])
    const [state, dispatch] = useReducer(reducer, {
      ...defaultState,
      ...initialState,
      // Reducer assumes the list of company lists is sorted.
      lists: orderBy(initialState.lists, 'name'),
    })

    return {
      state,
      dispatch,
      deleteListPropsAccessor,
      addInteractionPropsAccessor,
    }
  }
)

const idNameShape = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
}

useMyCompaniesContext.Provider.propTypes = {
  lists: PropTypes.arrayOf(
    PropTypes.shape({
      ...idNameShape,
      companies: PropTypes.arrayOf(
        PropTypes.shape({
          company: PropTypes.shape({
            ...idNameShape,
          }).isRequired,
          latestInteraction: PropTypes.shape({
            id: PropTypes.string,
            date: PropTypes.string,
            subject: PropTypes.string,
          }),
        })
      ),
    })
  ),
}

export default useMyCompaniesContext
