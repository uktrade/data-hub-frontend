const { cloneDeep, mapValues, merge, omit } = require('lodash')

const createJourney = require('../create/steps')

const createSteps = mapValues(cloneDeep(createJourney), (step) => {
  return omit(step, ['next', 'backLink'])
})

const steps = merge({}, createSteps, {
  '/assignee-time': {
    heading: 'Edit estimated hours of work',
    fields: ['assignee_time'],
  },
  '/quote-details': {
    heading: 'Edit quote information',
    fields: ['description', 'delivery_date'],
  },
  '/internal-details': {
    heading: 'Edit internal information',
    fields: [
      'service_types',
      'sector',
      'further_info',
      'existing_agents',
      'contacts_not_to_approach',
    ],
  },
  '/invoice-details': {
    heading: 'Edit invoice details',
    fields: ['vat_status', 'vat_number', 'vat_verified', 'po_number'],
  },
  '/billing-address': {
    heading: 'Edit billing address',
    fields: [
      'billing_address_1',
      'billing_address_2',
      'billing_address_town',
      'billing_address_county',
      'billing_address_postcode',
      'billing_address_country',
    ],
  },
  '/vat-status': {
    heading: 'Confirm VAT status',
    fields: ['vat_status', 'vat_number', 'vat_verified'],
  },
  '/payment-reconciliation': {
    heading: 'Reconcile a payment',
    fields: ['amount', 'received_on'],
  },
})

// Market cannot be edited after creation
delete steps['/market']

// Sector can be edited as part of a different section at this stage
delete steps['/sector']

module.exports = steps
