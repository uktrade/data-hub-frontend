import { COMPANY_LOADED } from '../../../../client/actions'

const initialState = { company: null }

export default (state = initialState, { type, result }) => {
  switch (type) {
    case COMPANY_LOADED:
      return {
        ...state,
        company: {
          ...result,
          isGlobalHQ:
            result.headquarter_type && result.headquarter_type.name === 'ghq',
        },
      }
    default:
      return state
  }
}
