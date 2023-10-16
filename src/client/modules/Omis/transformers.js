import { transformDateObjectToDateString } from '../../transformers'
import {
  checkIfItemHasValue,
  transformRadioOptionToBool,
} from '../Investments/Projects/transformers'

export const transformQuoteInformationForApi = ({
  orderId,
  csrfToken,
  values,
}) => {
  const { description, delivery_date } = values

  return {
    id: orderId,
    csrfToken,
    description,
    delivery_date: transformDateObjectToDateString(delivery_date),
  }
}

export const transformInternalInformationForApi = ({ orderId, values }) => {
  const {
    service_types,
    sector,
    further_info,
    existing_agents,
    contacts_not_to_approach,
  } = values

  return {
    id: orderId,
    service_types: service_types.map((x) => x.value),
    sector: checkIfItemHasValue(sector?.value),
    further_info,
    existing_agents,
    contacts_not_to_approach,
  }
}

export const transformPaymentInformationForApi = ({ orderId, values }) => {
  const { amount, received_on } = values

  return {
    id: orderId,
    payment: [
      {
        amount: parseFloat(amount.replace(',', '')) * 100,
        received_on: transformDateObjectToDateString(received_on),
      },
    ],
  }
}

export const transformInvoiceDetailsForApi = ({ orderId, values }) => {
  const { po_number, vat_status, vat_number, vat_verified } = values

  return {
    id: orderId,
    vat_status,
    vat_number,
    vat_verified: transformRadioOptionToBool(vat_verified),
    po_number,
  }
}
