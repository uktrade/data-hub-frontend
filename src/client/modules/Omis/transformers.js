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

export const transformAdvisersForTypeahead = (advisers) =>
  advisers.map((value) => ({
    label: value.adviser.name,
    value: value.adviser.id,
  }))

export const transformAdvisersForAPI = (assignees) =>
  assignees.map((assignee) => ({
    adviser: {
      id: assignee.value,
    },
  }))

export const transformSubscribersForTypeahead = (subscribers) =>
  subscribers.map((value) => ({
    label: value.name,
    value: value.id,
  }))

export const transformSubscribersForAPI = (values) =>
  values.subscribers.map((subscriber) => ({
    id: subscriber.value,
  }))

export const transformAssignees = (values) => ({
  id: values.orderId,
  assignees: values.values.assignees,
  canRemove: values.canRemoveAssignees,
})

export const transformEstimatedTime = (time) => {
  const estimatedTime = time / 60
  return estimatedTime > 1 ? estimatedTime + ' hours' : estimatedTime + ' hour'
}

export const getAddress = (order, company) =>
  order.billingAddressCountry
    ? {
        line1: order.billingAddress1,
        line2: order.billingAddress2,
        town: order.billingAddressTown,
        county: order.billingAddressCounty,
        postcode: order.billingAddressPostcode,
        country: order.billingAddressCountry,
      }
    : company.registeredAddress
    ? company.registeredAddress
    : company.address

export const transformAddress = (address) =>
  [
    address.line1,
    address.line2,
    address.town,
    address.county,
    address.postcode,
    address.country?.name,
  ].filter((item) => item.length)
