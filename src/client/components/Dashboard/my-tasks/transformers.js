import { SHOW_ALL_OPTION } from './constants'

export const companyOptions = (companies) => {
  const companiesList = companies.map((company) => ({
    label: company.name,
    value: company.id,
  }))

  return [SHOW_ALL_OPTION, ...companiesList]
}
