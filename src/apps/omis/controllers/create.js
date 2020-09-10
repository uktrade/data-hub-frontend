const FormController = require('./form')
const logger = require('../../../config/logger')
const { getDitCompany } = require('../../companies/repos')

class CreateController extends FormController {
  process(req, res, next) {
    const companyId = req.query.company || req.sessionModel.get('company')

    if (companyId) {
      req.form.values.company = companyId
    }

    super.process(req, res, next)
  }

  middlewareActions() {
    super.middlewareActions()

    this.use(this.saveCompany)
  }

  middlewareChecks() {
    super.middlewareChecks()

    this.use(this.checkSkipCompany)
  }

  middlewareLocals() {
    super.middlewareLocals()

    this.use(this.setCompany)
  }

  saveCompany(req, res, next) {
    if (req.query.company) {
      req.method = 'POST'
      return this._configure(req, res, next)
    }

    next()
  }

  checkSkipCompany(req, res, next) {
    if (req.query['skip-company']) {
      req.sessionModel.set('skip-company', true)
    }

    next()
  }

  async setCompany(req, res, next) {
    const companyId = req.sessionModel.get('company')

    if (companyId) {
      try {
        res.locals.company = await getDitCompany(req, companyId)
      } catch (error) {
        logger.error(error)
      }
    }

    next()
  }
}

module.exports = CreateController
