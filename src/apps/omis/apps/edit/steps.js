const { merge } = require('lodash')

const createSteps = require('../create/steps')
const EditAssigneesController = require('./controllers/assignees')
const EditAssigneeTimeController = require('./controllers/assignee-time')
const EditClientDetailsController = require('./controllers/client-details')
const EditSubscribersController = require('./controllers/subscribers')
const EditWorkDescriptionController = require('./controllers/work-description')

const steps = merge({}, createSteps, {
  '/client-details': {
    heading: 'Edit client details',
    controller: EditClientDetailsController,
  },
  '/subscribers': {
    heading: 'Add or remove ITAs',
    controller: EditSubscribersController,
  },
  '/assignees': {
    heading: 'Add or remove post advisers',
    fields: [
      'assignees',
    ],
    controller: EditAssigneesController,
  },
  '/assignee-time': {
    heading: 'Edit post adviser time',
    fields: [
      'assignee_time',
    ],
    controller: EditAssigneeTimeController,
    templatePath: 'omis/apps/edit/views',
    template: 'assignee-time.njk',
  },
  '/work-description': {
    heading: 'Edit work description',
    fields: [
      'service_types',
      'description',
      'contacts_not_to_approach',
      'sector',
      'delivery_date',
    ],
    controller: EditWorkDescriptionController,
  },
  '/payment': {
    heading: 'Edit quote and payment details',
    fields: [
      'vat_status',
      'vat_number',
      'vat_verified',
      'po_number',
    ],
  },
})

// Market cannot be edited after creation
delete steps['/market']

module.exports = steps
