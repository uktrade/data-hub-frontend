const { filter, flatten, forEach, sortBy } = require('lodash')

const { FormController } = require('../../../controllers')
const { getAdvisers } = require('../../../../adviser/repos')
const { transformObjectToOption } = require('../../../../transformers')

class AssignItaController extends FormController {
  async configure (req, res, next) {
    const advisers = await getAdvisers(req.session.token)
    const options = advisers.results.map(transformObjectToOption)

    req.form.options.fields.ita.options = sortBy(options, 'label')
    super.configure(req, res, next)
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
}

module.exports = AssignItaController
