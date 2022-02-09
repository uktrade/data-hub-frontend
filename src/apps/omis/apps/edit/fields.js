const { merge } = require('lodash')

const globalFields = require('../../fields')
const { arrayrequired, duration, euvatnumber } = require('../../validators')

const editFields = merge({}, globalFields, {
  subscribers: {
    fieldType: 'AddAnother',
    legend: 'fields.subscribers.legend',
    label: 'fields.subscribers.label',
    hint: 'fields.subscribers.hint',
    name: 'subscribers',
    multiple: true,
    children: [
      {
        macroName: 'Typeahead',
        entity: 'adviser',
        name: 'subscribers',
        label: 'subscribers',
        placeholder: 'Search team member',
        classes: 'c-form-group--no-filter',
        options: [],
        optional: false,
        multipleSelect: false,
        isLabelHidden: true,
      },
    ],
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
  assignee_time: {
    fieldType: 'TextField',
    label: 'fields.assignee_time.label',
    modifier: ['shorter', 'soft'],
    multiple: true,
    validate: [duration],
  },
  assignee_actual_time: {
    fieldType: 'TextField',
    label: 'fields.assignee_actual_time.label',
    modifier: ['shorter', 'soft'],
    multiple: true,
    validate: [arrayrequired, duration],
  },
  vat_status: {
    fieldType: 'MultipleChoiceField',
    type: 'radio',
    label: 'fields.vat_status.label',
    hint: 'fields.vat_status.hint',
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
    validate: [euvatnumber],
    condition: {
      name: 'vat_status',
      value: 'eu',
    },
    innerHTML:
      '<p><a href="http://ec.europa.eu/taxation_customs/vies/" aria-labelledby="external-link-label">Validate the EU VAT number</a> <span id="external-link-label">(will open another website)</span></p>',
  },
  vat_verified: {
    fieldType: 'MultipleChoiceField',
    type: 'radio',
    modifier: ['inline', 'subfield'],
    label: 'fields.vat_verified.label',
    validate: ['required'],
    options: [
      {
        value: 'true',
        label: 'Yes',
      },
      {
        value: 'false',
        label: 'No',
      },
    ],
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
  verify_work_sent: {
    fieldType: 'MultipleChoiceField',
    label: 'fields.verify_work_sent.label',
    type: 'checkbox',
    options: [
      {
        value: 'true',
        label: 'I have completed the work and sent this to the contact',
      },
    ],
    validate: ['required'],
  },
})

module.exports = editFields
