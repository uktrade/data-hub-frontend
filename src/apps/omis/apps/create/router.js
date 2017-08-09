const path = require('path')
const router = require('express').Router()
const wizard = require('hmpo-form-wizard')
const i18nFuture = require('i18n-future')

const i18n = i18nFuture({
  path: path.resolve(__dirname, '../../locales/__lng__/__ns__.json'),
})
const steps = require('./steps')
const fields = require('../../fields')
const { FormController } = require('../../controllers')
const { params } = require('../../middleware')

const config = {
  controller: FormController,
  name: 'omis-create-order',
  journeyName: 'omis-create-order',
  template: '_layouts/form-wizard-step',
  translate: i18n.translate.bind(i18n),
}

router.param('companyId', params.getCompany)

router.use('/:companyId?', wizard(steps, fields, config))

module.exports = router
