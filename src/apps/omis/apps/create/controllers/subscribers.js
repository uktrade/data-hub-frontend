const { sortBy } = require('lodash')

const { FormController } = require('../../../controllers')
const { getAllAdvisers } = require('../../../../adviser/repos')
const { transformObjectToOption } = require('../../../../transformers')

class SubscribersController extends FormController {
  async configure (req, res, next) {
    const advisers = await getAllAdvisers(req.session.token)
    const options = advisers.results.map(transformObjectToOption)

    req.form.options.fields.subscribers.options = sortBy(options, 'label')
    super.configure(req, res, next)
  }
}

module.exports = SubscribersController
