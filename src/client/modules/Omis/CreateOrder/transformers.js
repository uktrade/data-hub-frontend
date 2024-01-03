import { transformRadioOptionToBool } from '../../Investments/Projects/transformers'

export const transformOrderForApi = ({ company, values }) => {
  const { contact, country, useCompanySector, sector } = values

  return {
    company: company.id,
    contact: contact.value,
    primary_market: country.value,
    sector: transformRadioOptionToBool(useCompanySector)
      ? company.sector.id
      : sector.value,
  }
}
