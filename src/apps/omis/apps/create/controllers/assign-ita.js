const { sortBy } = require('lodash')

const Controller = require('./base')
const { getAdvisers } = require('../../../../adviser/repos')
const { transformObjectToOption } = require('../../../../transformers')

class AssignItaController extends Controller {
  async configure (req, res, next) {
    const advisers = await getAdvisers(req.session.token)
    const options = advisers.results.map(transformObjectToOption)

    req.form.options.fields.ita.options = sortBy(options, 'label')
    super.configure(req, res, next)
  }
}

module.exports = AssignItaController
