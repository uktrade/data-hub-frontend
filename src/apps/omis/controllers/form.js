const { get, filter, flatten, forEach, last, mapValues } = require('lodash')
const { Controller } = require('hmpo-form-wizard')

class FormController extends Controller {
  configure (req, res, next) {
    const heading = req.form.options.heading

    if (heading) {
      res.breadcrumb(heading)
    }

    next()
  }

  getErrors (req, res) {
    const errors = super.getErrors(req, res)

    errors.messages = mapValues(errors, (item) => {
      return `${req.translate(`fields.${item.key}.label`)} ${item.message}`
    })

    return errors
  }

  process (req, res, next) {
    const addKey = req.body['add-item']
    const removeKey = req.body['remove-item']

    if (addKey || removeKey) {
      if (addKey) {
        req.form.values[addKey] = flatten([req.form.values[addKey]])
        // add empty value to array to show add a new add adviser input
        req.form.values[addKey].push('')
      }

      if (removeKey) {
        const [ key, index ] = removeKey.split('::')
        req.form.values[key].splice(index, 1)
      }

      return this.saveValues(req, res, () => {
        res.redirect(req.baseUrl + req.path)
      })
    }

    next()
  }

  saveValues (req, res, next) {
    if (!req.body['add-item'] && !req.body['remove-item']) {
      const fields = req.form.options.fields

      forEach(fields, (options, key) => {
        if (options.repeatable) {
          req.form.values[key] = filter(flatten([req.form.values[key]]))
        }
      })
    }

    super.saveValues(req, res, next)
  }

  errorHandler (err, req, res, next) {
    if (get(err, 'code') === 'MISSING_PREREQ') {
      const lastStep = last(req.journeyModel.get('history'))

      if (!lastStep) {
        return res.redirect(req.baseUrl)
      }
      return res.redirect(lastStep.path)
    }

    super.errorHandler(err, req, res, next)
  }
}

module.exports = FormController
