const { merge } = require('lodash')

const createSteps = require('../create/steps')
const EditClientDetailsController = require('./controllers/client-details')
const EditSubscribersController = require('./controllers/subscribers')
const EditWorkDescriptionController = require('./controllers/work-description')

const steps = merge({}, createSteps, {
  '/client-details': {
    controller: EditClientDetailsController,
  },
  '/subscribers': {
    controller: EditSubscribersController,
  },
  '/work-description': {
    fields: [
      'service_types',
      'description',
      'contacts_not_to_approach',
      'sector',
      'delivery_date',
    ],
    controller: EditWorkDescriptionController,
  },
})

// Market cannot be edited after creation
delete steps['/market']

module.exports = steps
