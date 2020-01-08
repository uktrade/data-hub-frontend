const { get, filter, flatten, forEach, mapValues } = require('lodash')
const { Controller } = require('hmpo-form-wizard')
const labels = require('../locales/en/default')

class FormController extends Controller {
  render(req, res, next) {
    const heading = req.form.options.heading

    if (heading) {
      res.breadcrumb(heading)
    }

    super.render(req, res, next)
  }

  getErrors(req, res) {
    const errors = super.getErrors(req, res)

    errors.messages = mapValues(errors, (item) => {
      /*
      In order to remove the i18n-future dependency this
      function has been introduced to replace code which was
      calling the translation library. Translations are not
      required at this stage.
      */
      const label = get(labels, `fields.${item.key}.label`)
      const error = get(labels, `validation.${item.type}`)
      return `${label} ${error}`
    })

    return errors
  }

  process(req, res, next) {
    const addKey = req.body['add-item']
    const removeKey = req.body['remove-item']

    if (addKey || removeKey) {
      if (addKey) {
        req.form.values[addKey] = flatten([req.form.values[addKey]])
        // add empty value to array to show add a new add adviser input
        req.form.values[addKey].push('')
      }

      if (removeKey) {
        const [key, index] = removeKey.split('::')
        req.form.values[key].splice(index, 1)
      }

      return super.saveValues(req, res, () => {
        res.redirect(req.baseUrl + req.path)
      })
    }

    const fields = req.form.options.fields
    forEach(fields, (options, key) => {
      if (options.repeatable) {
        req.form.values[key] = filter(flatten([req.form.values[key]]))
      }
    })

    next()
  }

  errorHandler(err, req, res, next) {
    if (err.redirect) {
      return res.redirect(err.redirect)
    }

    if (get(err, 'code') === 'SESSION_TIMEOUT') {
      return res
        .breadcrumb('Session expired')
        .render('omis/apps/create/views/timeout', {
          baseUrl: req.baseUrl,
        })
    }

    super.errorHandler(err, req, res, next)
  }
}

module.exports = FormController
