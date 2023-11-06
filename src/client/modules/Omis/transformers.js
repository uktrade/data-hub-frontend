import { filter } from 'lodash'

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

export const transformBillingAddressForApi = ({ orderId, values }) => {
  const { address1, address2, city, country, county, postcode } = values

  return {
    id: orderId,
    billing_address_1: address1,
    billing_address_2: address2,
    billing_address_town: city,
    billing_address_county: county,
    billing_address_postcode: postcode,
    billing_address_country: country,
  }
}

export const transformVatStatusForApi = ({ orderId, values }) => {
  const { vat_status, vat_number, vat_verified } = values

  return {
    id: orderId,
    vat_status,
    vat_number,
    vat_verified: transformRadioOptionToBool(vat_verified),
  }
}

export const transformCancellationForApi = ({ orderId, values }) => ({
  id: orderId,
  cancellation_reason: values.cancellation_reason,
})

export const transformAssigneeTimeForApi = ({ orderId, values }) => {
  const transformedAssignees = Object.entries(values).map((element) => ({
    adviser: { id: element[0] },
    estimated_time: element[1] * 60,
  }))

  return {
    id: orderId,
    assignees: filter(transformedAssignees),
  }
}

export const transformActualAssigneeTimeForApi = ({ orderId, values }) => {
  delete values.hasWorkBeenSentToContact
  const transformedAssignees = Object.entries(values).map((element) => ({
    adviser: { id: element[0] },
    actual_time: element[1] * 60,
  }))

  return {
    id: orderId,
    assignees: filter(transformedAssignees),
  }
}

export const transformContactForApi = ({ orderId, values }) => ({
  id: orderId,
  contact: values.contact.value,
})
