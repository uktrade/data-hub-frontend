const { cloneDeep, mapValues, merge, omit } = require('lodash')

const createJourney = require('../create/steps')
const EditAssigneeTimeController = require('./controllers/assignee-time')
const EditContactController = require('./controllers/contact')
const EditQuoteDetailsController = require('./controllers/quote-details')
const EditInternalDetailsController = require('./controllers/internal-details')
const EditInvoiceDetailsController = require('./controllers/invoice-details')
const EditBillingAddressController = require('./controllers/billing-address')
const EditVatStatusController = require('./controllers/vat-status')
const EditPaymentReconciliationController = require('./controllers/payment-reconciliation')
const CompleteOrderController = require('./controllers/complete-order')
const CancelOrderController = require('./controllers/cancel-order')

const createSteps = mapValues(cloneDeep(createJourney), (step) => {
  return omit(step, ['next', 'backLink'])
})

const steps = merge({}, createSteps, {
  '/contact': {
    heading: 'Edit contact',
    controller: EditContactController,
  },
  '/assignee-time': {
    heading: 'Edit estimated hours of work',
    fields: ['assignee_time'],
    controller: EditAssigneeTimeController,
    templatePath: 'omis/apps/edit/views',
    template: 'assignee-time.njk',
  },
  '/quote-details': {
    heading: 'Edit quote information',
    fields: ['description', 'delivery_date'],
    controller: EditQuoteDetailsController,
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
    controller: EditInternalDetailsController,
  },
  '/invoice-details': {
    heading: 'Edit invoice details',
    fields: ['vat_status', 'vat_number', 'vat_verified', 'po_number'],
    templatePath: 'omis/apps/edit/views',
    template: 'invoice-details.njk',
    controller: EditInvoiceDetailsController,
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
    next: [{ fn: 'nextCondition', next: 'vat-status' }, 'invoice-details'],
    successMessage: 'Billing address saved',
    controller: EditBillingAddressController,
  },
  '/vat-status': {
    heading: 'Confirm VAT status',
    fields: ['vat_status', 'vat_number', 'vat_verified'],
    templatePath: 'omis/apps/edit/views',
    template: 'vat-status.njk',
    buttonText: 'Confirm VAT status',
    backLink: null,
    next: 'invoice-details',
    successMessage: 'Billing address and VAT status saved',
    controller: EditVatStatusController,
  },
  '/payment-reconciliation': {
    heading: 'Reconcile a payment',
    fields: ['amount', 'received_on'],
    templatePath: 'omis/apps/edit/views',
    template: 'payment-reconciliation.njk',
    controller: EditPaymentReconciliationController,
  },
  '/complete-order': {
    heading: 'Complete order',
    fields: ['assignee_actual_time', 'verify_work_sent'],
    templatePath: 'omis/apps/edit/views',
    template: 'complete-order.njk',
    successMessage: 'Order completed',
    controller: CompleteOrderController,
  },
  '/cancel-order': {
    heading: 'Cancel an order',
    fields: ['cancellation_reason'],
    successMessage: 'Order cancelled',
    controller: CancelOrderController,
  },
})

// Market cannot be edited after creation
delete steps['/market']

// Sector can be edited as part of a different section at this stage
delete steps['/sector']

module.exports = steps
