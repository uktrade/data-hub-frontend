const { merge } = require('lodash')

const createSteps = require('../create/steps')
const EditAssigneesController = require('./controllers/assignees')
const EditAssigneeTimeController = require('./controllers/assignee-time')
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
  '/assignees': {
    fields: [
      'assignees',
    ],
    controller: EditAssigneesController,
  },
  '/assignee-time': {
    fields: [
      'assignee_time',
    ],
    controller: EditAssigneeTimeController,
    templatePath: 'omis/apps/edit/views',
    template: 'assignee-time.njk',
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
