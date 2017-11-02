const { merge } = require('lodash')

const createSteps = require('../create/steps')
const EditAssigneesController = require('./controllers/assignees')
const EditAssigneeTimeController = require('./controllers/assignee-time')
const EditClientDetailsController = require('./controllers/client-details')
const EditSubscribersController = require('./controllers/subscribers')
const EditQuoteDetailsController = require('./controllers/quote-details')
const EditInternalDetailsController = require('./controllers/internal-details')
const EditBillingAddressController = require('./controllers/billing-address')
const EditPaymentReconciliationController = require('./controllers/payment-reconciliation')
const CompleteOrderController = require('./controllers/complete-order')

const steps = merge({}, createSteps, {
  '/client-details': {
    heading: 'Edit client details',
    controller: EditClientDetailsController,
  },
  '/subscribers': {
    heading: 'Add or remove advisers in the UK',
    fields: ['subscribers'],
    controller: EditSubscribersController,
  },
  '/assignees': {
    heading: 'Add or remove advisers in the market',
    fields: [
      'assignees',
    ],
    controller: EditAssigneesController,
  },
  '/assignee-time': {
    heading: 'Edit estimated hours of work',
    fields: [
      'assignee_time',
    ],
    controller: EditAssigneeTimeController,
    templatePath: 'omis/apps/edit/views',
    template: 'assignee-time.njk',
  },
  '/quote-details': {
    heading: 'Edit quote information',
    fields: [
      'description',
      'delivery_date',
    ],
    controller: EditQuoteDetailsController,
  },
  '/internal-details': {
    heading: 'Edit internal information',
    fields: [
      'service_types',
      'contacts_not_to_approach',
      'sector',
    ],
    controller: EditInternalDetailsController,
  },
  '/payment': {
    heading: 'Edit invoice details',
    fields: [
      'vat_status',
      'vat_number',
      'vat_verified',
      'po_number',
    ],
    templatePath: 'omis/apps/edit/views',
    template: 'payment.njk',
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
    controller: EditBillingAddressController,
  },
  '/payment-reconciliation': {
    heading: 'Payment reconciliation',
    fields: [
      'amount',
      'received_on',
      'transaction_reference',
    ],
    templatePath: 'omis/apps/edit/views',
    template: 'payment-reconciliation.njk',
    controller: EditPaymentReconciliationController,
  },
  '/complete-order': {
    heading: 'Complete order',
    fields: [
      'assignee_actual_time',
    ],
    templatePath: 'omis/apps/edit/views',
    template: 'complete-order.njk',
    controller: CompleteOrderController,
  },
})

// Market cannot be edited after creation
delete steps['/market']

module.exports = steps
