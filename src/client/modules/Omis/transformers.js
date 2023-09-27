import { transformDateObjectToDateString } from '../../transformers'
import { checkIfItemHasValue } from '../Investments/Projects/transformers'

export const transformQuoteInformationForApi = ({
  orderId,
  csrfToken,
  values,
}) => {
  const { description, delivery_date } = values

  const infoValues = {
    id: orderId,
    csrfToken,
    description,
    delivery_date: transformDateObjectToDateString(delivery_date),
  }

  return infoValues
}

export const transformInternalInformationForApi = ({ orderId, values }) => {
  const {
    service_types,
    sector,
    further_info,
    existing_agents,
    contacts_not_to_approach,
  } = values

  const infoValues = {
    id: orderId,
    service_types: service_types.map((x) => x.value),
    sector: checkIfItemHasValue(sector?.value),
    further_info,
    existing_agents,
    contacts_not_to_approach,
  }

  return infoValues
}
