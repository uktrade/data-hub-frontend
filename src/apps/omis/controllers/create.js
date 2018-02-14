const FormController = require('./form')
const logger = require('../../../../config/logger')
const { getDitCompany } = require('../../companies/repos')

class CreateController extends FormController {
  middlewareLocals () {
    super.middlewareLocals()

    this.use(this.setCompany)
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
