import { SHOW_ALL_OPTION } from './constants'

export const companyAndProjectOptions = (options) => {
  const optionsList = options.map((option) => ({
    label: option.name,
    value: option.id,
  }))

  return [SHOW_ALL_OPTION, ...optionsList]
}
