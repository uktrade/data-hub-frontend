import { filter } from 'lodash'
import { addDays, isAfter, parseISO } from 'date-fns'

import { transformDateObjectToDateString } from '../../transformers'
import {
  checkIfItemHasValue,
  transformRadioOptionToBool,
} from '../Investments/Projects/transformers'
import { INCOMPLETE_FIELD_MESSAGES, STATUS, VAT_STATUS } from './constants'
import { omis } from '../../../lib/urls'

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

export const canEditOrder = (order) => order.status === STATUS.DRAFT
export const isOrderActive = (order) =>
  ![STATUS.CANCELLED, STATUS.COMPLETE].includes(order.status)

export const transformLeadAdviserForApi = (values) => {
  const transformedAssignees = values.assignees.map((element) => ({
    adviser: { id: element.adviser.id },
    is_lead: element.adviser.id === values.adviserId,
  }))

  return filter(transformedAssignees)
}

const checkIfAssigneeHasHours = (assignees) =>
  assignees.some((assignee) => assignee.estimatedTime != 0)

const checkIfLeadAssigneeExists = (assignees) =>
  assignees.some((assignee) => assignee.isLead)

export const getIncompleteFields = (order, assignees) => {
  const incompleteFields = []

  if (!order.description) {
    incompleteFields.push(INCOMPLETE_FIELD_MESSAGES.DESCRIPTION)
  }

  if (
    !order.deliveryDate ||
    !isAfter(parseISO(order.deliveryDate), addDays(new Date(), 20))
  ) {
    incompleteFields.push(INCOMPLETE_FIELD_MESSAGES.DELIVERY_DATE)
  }

  if (order.serviceTypes?.length == 0) {
    incompleteFields.push(INCOMPLETE_FIELD_MESSAGES.SERVICE_TYPES)
  }

  if (!order.vatStatus) {
    incompleteFields.push(INCOMPLETE_FIELD_MESSAGES.VAT_STATUS)
  }

  if (order.vatStatus === VAT_STATUS.EU_COMPANY && !order.vatNumber) {
    incompleteFields.push(INCOMPLETE_FIELD_MESSAGES.VAT_NUMBER)
  }

  if (
    order.vatStatus === VAT_STATUS.EU_COMPANY &&
    order.vatVerified === false
  ) {
    incompleteFields.push(INCOMPLETE_FIELD_MESSAGES.VAT_VERIFIED)
  }

  if (assignees.length === 0) {
    incompleteFields.push(INCOMPLETE_FIELD_MESSAGES.ASSIGNEES)
  }

  if (checkIfAssigneeHasHours(assignees) === false) {
    incompleteFields.push(INCOMPLETE_FIELD_MESSAGES.ASSIGNEE_TIME)
  }

  if (checkIfLeadAssigneeExists(assignees) === false) {
    incompleteFields.push(INCOMPLETE_FIELD_MESSAGES.LEAD_ASSIGNEE)
  }

  return incompleteFields
}

export const mapFieldToUrl = (field, orderId) => {
  const quoteInfoFields = [
    INCOMPLETE_FIELD_MESSAGES.DESCRIPTION,
    INCOMPLETE_FIELD_MESSAGES.DELIVERY_DATE,
  ]

  const invoiceFields = [
    INCOMPLETE_FIELD_MESSAGES.VAT_STATUS,
    INCOMPLETE_FIELD_MESSAGES.VAT_VERIFIED,
    INCOMPLETE_FIELD_MESSAGES.VAT_NUMBER,
  ]

  if (quoteInfoFields.includes(field)) {
    return omis.edit.quote(orderId)
  }

  if (invoiceFields.includes(field)) {
    return omis.edit.invoiceDetails(orderId)
  }

  if (field === INCOMPLETE_FIELD_MESSAGES.SERVICE_TYPES) {
    return omis.edit.internalInfo(orderId)
  }

  if (field === INCOMPLETE_FIELD_MESSAGES.ASSIGNEES) {
    return omis.edit.assignees(orderId)
  }

  if (field === INCOMPLETE_FIELD_MESSAGES.ASSIGNEE_TIME) {
    return omis.edit.assigneeTime(orderId)
  }

  return null
}

export const transformCompanyAddress = (company) => {
  const address = company.registeredAddress
    ? company.registeredAddress
    : company.address
  return [
    address.line1,
    address.line2,
    address.town,
    address.county,
    address.postcode,
    address.country.name,
  ]
    .filter((item) => item.length)
    .join(', ')
}
