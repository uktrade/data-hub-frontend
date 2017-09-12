const path = require('path')
const i18nFuture = require('i18n-future')
const { reduce } = require('lodash')

const steps = require('../steps')
const fields = require('../fields')
const i18n = i18nFuture({
  path: path.resolve(__dirname, '../../../locales/__lng__/__ns__.json'),
})

function editHandler (req, res, next) {
  const step = steps[`/${req.params.step}`]

  if (!step) { return next() }

  const defaults = {
    buttonText: 'Save and return',
    returnText: 'Return without saving',
    journeyName: 'edit',
    name: 'edit',
    route: '/edit',
    template: '_layouts/form-wizard-step',
    translate: i18n.translate.bind(i18n),
  }
  const overrides = {
    fields: reduce(step.fields, (result, field) => {
      result[field] = fields[field] || {}
      return result
    }, {}),
    backLink: path.resolve(req.baseUrl, '..'),
  }
  const options = Object.assign(defaults, step, overrides)
  const ControllerClass = options.controller

  res.breadcrumb(options.heading)

  new ControllerClass(options).requestHandler()(req, res, next)
}

module.exports = editHandler
