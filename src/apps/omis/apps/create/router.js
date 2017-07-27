const router = require('express').Router()
const wizard = require('hmpo-form-wizard')

const steps = require('./steps')
const fields = require('./fields')
const { params } = require('../../middleware')
const { BaseController } = require('./controllers')

const config = {
  controller: BaseController,
  name: 'omis-create-order',
  template: '_layouts/form-wizard-step',
}

router.param('companyId', params.getCompany)

router.use('/:companyId?', wizard(steps, fields, config))

module.exports = router
