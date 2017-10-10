const { isArray, merge } = require('lodash')

const globalFields = require('../../fields')

function isDuration (value) {
  const regex = /^\d+:\d{2}$/

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

const editFields = merge({}, globalFields, {
  subscribers: {
    hint: 'fields.subscribers.hint.edit',
    optional: false,
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
  sector: {
    fieldType: 'MultipleChoiceField',
    label: 'fields.sector.label',
    optional: true,
    initialOption: '-- Select sector --',
    options: [],
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
    condition: {
      name: 'vat_status',
      value: 'eu',
    },
    innerHTML: '<p><a href="http://ec.europa.eu/taxation_customs/vies/">Validate the EU VAT number</a></p>',
  },
  vat_verified: {
    fieldType: 'MultipleChoiceField',
    type: 'radio',
    modifier: ['inline', 'subfield'],
    label: 'fields.vat_verified.label',
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
})

module.exports = editFields
