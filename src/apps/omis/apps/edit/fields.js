const { isArray, flatten, merge } = require('lodash')
const FormController = require('hmpo-form-controller')

const globalFields = require('../../fields')

function isDuration (value) {
  const regex = /^\d*$/

  if (!isArray(value)) {
    if (!value) { return true }

    return !!value.match(regex)
  }

  let valid = true
  value.forEach(itemValue => {
    if (!itemValue) { return }

    if (!itemValue.match(regex)) {
      valid = false
    }
  })

  return valid
}

function arrayRequired (value) {
  const invalidItems = flatten([value]).filter(itemValue => {
    return itemValue === undefined || itemValue === ''
  })

  return invalidItems.length === 0
}

function validEUVatNumber (value) {
  const regex = /^(ATU[0-9]{8}|BE0[0-9]{9}|BG[0-9]{9,10}|CY[0-9]{8}L|CZ[0-9]{8,10}|DE[0-9]{9}|DK[0-9]{8}|EE[0-9]{9}|EL|GR[0-9]{9}|ES[0-9A-Z][0-9]{7}[0-9A-Z]|FI[0-9]{8}|FR[0-9A-Z]{2}[0-9]{9}|GB([0-9]{9}([0-9]{3})?|[A-Z]{2}[0-9]{3})|HU[0-9]{8}|IE[0-9]S[0-9]{5}L|IT[0-9]{11}|LT([0-9]{9}|[0-9]{12})|LU[0-9]{8}|LV[0-9]{11}|MT[0-9]{8}|NL[0-9]{9}B[0-9]{2}|PL[0-9]{10}|PT[0-9]{9}|RO[0-9]{2,10}|SE[0-9]{12}|SI[0-9]{8}|SK[0-9]{10})$/

  return value === '' || FormController.validators.regex(value, regex)
}

const editFields = merge({}, globalFields, {
  subscribers: {
    fieldType: 'MultipleChoiceField',
    legend: 'fields.subscribers.legend',
    label: 'fields.subscribers.label',
    hint: 'fields.subscribers.hint',
    addButtonText: 'fields.subscribers.addButtonText',
    repeatable: true,
    initialOption: '-- Select adviser --',
    options: [],
  },
  service_types: {
    fieldType: 'MultipleChoiceField',
    type: 'checkbox',
    label: 'fields.service_types.label',
    options: [],
  },
  description: {
    fieldType: 'TextField',
    type: 'textarea',
    label: 'fields.description.label',
  },
  delivery_date: {
    fieldType: 'TextField',
    label: 'fields.delivery_date.label',
    hint: 'fields.delivery_date.hint',
    modifier: 'short',
    validate: ['date', 'after'],
  },
  contacts_not_to_approach: {
    fieldType: 'TextField',
    type: 'textarea',
    label: 'fields.contacts_not_to_approach.label',
    optional: true,
  },
  existing_agents: {
    fieldType: 'TextField',
    type: 'textarea',
    label: 'fields.existing_agents.label',
    hint: 'fields.existing_agents.hint',
    optional: true,
  },
  further_info: {
    fieldType: 'TextField',
    type: 'textarea',
    label: 'fields.further_info.label',
    hint: 'fields.further_info.hint',
    optional: true,
  },
  sector: {
    condition: null,
    dependent: null,
    modifier: '',
  },
  assignees: {
    fieldType: 'MultipleChoiceField',
    legend: 'fields.assignees.legend',
    label: 'fields.assignees.label',
    hint: 'fields.assignees.hint',
    addButtonText: 'fields.assignees.addButtonText',
    repeatable: true,
    initialOption: '-- Select adviser --',
    options: [],
  },
  assignee_time: {
    fieldType: 'TextField',
    label: 'fields.assignee_time.label',
    modifier: ['shorter', 'soft'],
    validate: [isDuration],
  },
  assignee_actual_time: {
    fieldType: 'TextField',
    label: 'fields.assignee_actual_time.label',
    modifier: ['shorter', 'soft'],
    validate: [arrayRequired, isDuration],
  },
  vat_status: {
    fieldType: 'MultipleChoiceField',
    type: 'radio',
    label: 'fields.vat_status.label',
    options: [
      {
        value: 'outside_eu',
        label: 'non-EU company',
        hint: 'No VAT charged',
      },
      {
        value: 'uk',
        label: 'UK company',
        hint: '20% VAT charged',
      },
      {
        value: 'eu',
        label: 'EU company',
        hint: 'No VAT charged if validated. 20% VAT charged if not validated.',
      },
    ],
  },
  vat_number: {
    fieldType: 'TextField',
    label: 'fields.vat_number.label',
    modifier: ['subfield', 'medium'],
    validate: [validEUVatNumber],
    condition: {
      name: 'vat_status',
      value: 'eu',
    },
    innerHTML: '<p><a href="http://ec.europa.eu/taxation_customs/vies/" aria-labelledby="external-link-label">Validate the EU VAT number</a> <span id="external-link-label">(will open another website)</span></p>',
  },
  vat_verified: {
    fieldType: 'MultipleChoiceField',
    type: 'radio',
    modifier: ['inline', 'subfield'],
    label: 'fields.vat_verified.label',
    validate: ['required'],
    options: [{
      value: 'true',
      label: 'Yes',
    },
    {
      value: 'false',
      label: 'No',
    }],
    condition: {
      name: 'vat_status',
      value: 'eu',
    },
    dependent: {
      field: 'vat_status',
      value: 'eu',
    },
  },
  po_number: {
    fieldType: 'TextField',
    label: 'fields.po_number.label',
    modifier: 'medium',
    optional: true,
  },
  billing_address_1: {
    fieldType: 'TextField',
    label: 'fields.billing_address_1.label',
    validate: 'required',
  },
  billing_address_2: {
    fieldType: 'TextField',
    label: 'fields.billing_address_2.label',
    optional: true,
    isLabelHidden: true,
    modifier: 'compact',
  },
  billing_address_town: {
    fieldType: 'TextField',
    label: 'fields.billing_address_town.label',
    validate: 'required',
  },
  billing_address_county: {
    fieldType: 'TextField',
    label: 'fields.billing_address_county.label',
    optional: true,
  },
  billing_address_postcode: {
    fieldType: 'TextField',
    label: 'fields.billing_address_postcode.label',
    modifier: 'short',
    validate: 'required',
  },
  billing_address_country: {
    fieldType: 'MultipleChoiceField',
    label: 'fields.billing_address_country.label',
    initialOption: '-- Select country --',
    options: [],
    validate: 'required',
  },
  amount: {
    fieldType: 'TextField',
    label: 'fields.amount.label',
    hint: 'fields.amount.hint',
    validate: 'required',
    modifier: 'medium',
  },
  received_on: {
    fieldType: 'TextField',
    label: 'fields.received_on.label',
    hint: 'fields.received_on.hint',
    validate: ['required', 'date', 'before'],
    modifier: 'medium',
  },
  cancellation_reason: {
    fieldType: 'MultipleChoiceField',
    label: 'fields.cancellation_reason.label',
    type: 'radio',
    options: [],
    validate: ['required'],
  },
})

module.exports = editFields
