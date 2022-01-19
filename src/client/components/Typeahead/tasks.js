import { throttle } from 'lodash'
import { TASK_GET_TYPEAHEAD_OPTIONS } from './state'

export const getTypeaheadOptions = ({ loadOptions, options, autocomplete }) =>
  loadOptions
    ? throttle(loadOptions, 500)(autocomplete)
    : new Promise((resolve) => resolve(options))

export default {
  [TASK_GET_TYPEAHEAD_OPTIONS]: getTypeaheadOptions,
}
