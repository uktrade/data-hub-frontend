const router = require('express').Router()
const wizard = require('hmpo-form-wizard')

const steps = require('./steps')
const fields = require('../../fields')
const { CreateController } = require('../../controllers')

const config = {
  controller: CreateController,
  name: 'omis-create-order',
  journeyName: 'omis-create-order',
  template: '_layouts/form-wizard-step',
}

router.use(wizard(steps, fields, config))

module.exports = router
