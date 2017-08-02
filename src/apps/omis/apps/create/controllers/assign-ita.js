const { sortBy } = require('lodash')

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
}

module.exports = AssignItaController
