const { merge } = require('lodash')

const createSteps = require('../create/steps')
const EditClientDetailsController = require('./controllers/client-details')
const EditAssignItaController = require('./controllers/assign-ita')

const steps = merge({}, createSteps, {
  '/client-details': {
    controller: EditClientDetailsController,
  },
  '/assign-ita': {
    controller: EditAssignItaController,
  },
})

// Market cannot be edited after creation
delete steps['/market']

module.exports = steps
