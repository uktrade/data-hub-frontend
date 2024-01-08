import { transformArrayIdNameToValueLabel } from '../../../transformers'
import { SHOW_ALL_OPTION } from './constants'

export const companyAndProjectOptions = (options) => [
  SHOW_ALL_OPTION,
  ...transformArrayIdNameToValueLabel(options),
]
