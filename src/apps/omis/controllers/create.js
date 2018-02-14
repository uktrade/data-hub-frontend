const FormController = require('./form')
const logger = require('../../../../config/logger')
const { getDitCompany } = require('../../companies/repos')

class CreateController extends FormController {
  process (req, res, next) {
    const companyId = req.query.company || req.sessionModel.get('company')

    if (companyId) {
      req.form.values.company = companyId
    }

    super.process(req, res, next)
  }

  middlewareChecks () {
    super.middlewareChecks()

    this.use(this.checkSkipCompany)
    this.use(this.checkSaveCompany)
  }

  middlewareLocals () {
    super.middlewareLocals()

    this.use(this.setCompany)
  }

  checkSkipCompany (req, res, next) {
    if (req.query['skip-company']) {
      req.sessionModel.set('skip-company', true)
    }

    next()
  }

  checkSaveCompany (req, res, next) {
    if (req.query.company) {
      if (typeof this.post === 'function') {
        return this.post(req, res, next)
      }
      return this.successHandler(req, res, next)
    }

    next()
  }

  async setCompany (req, res, next) {
    const companyId = req.sessionModel.get('company')

    if (companyId) {
      try {
        res.locals.company = await getDitCompany(req.session.token, companyId)
      } catch (error) {
        logger.error(error)
      }
    }

    next()
  }
}

module.exports = CreateController
