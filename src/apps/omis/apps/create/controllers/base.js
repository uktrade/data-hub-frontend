const { get, last } = require('lodash')
const { Controller } = require('hmpo-form-wizard')

class CreateBaseController extends Controller {
  errorHandler (err, req, res, next) {
    if (get(err, 'code') === 'MISSING_PREREQ') {
      const lastStep = last(req.journeyModel.get('history'))

      if (!lastStep) {
        return res.redirect('/omis/create')
      }
      return res.redirect(lastStep.path)
    }

    super.errorHandler(err, req, res, next)
  }
}

module.exports = CreateBaseController
