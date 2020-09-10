const path = require('path')
const { assign, get } = require('lodash')

const { CreateController } = require('../../../controllers')
const { searchCompanies } = require('../../../../../modules/search/services')
const {
  transformApiResponseToSearchCollection,
} = require('../../../../../modules/search/transformers')
const {
  transformCompanyToListItem,
} = require('../../../../companies/transformers')
const { ENTITIES } = require('../../../../search/constants')

function transformListItemForOrderSource(item) {
  return assign({}, item, {
    url: `?company=${item.id}`,
  })
}

class CompanyController extends CreateController {
  middlewareChecks() {
    super.middlewareChecks()

    this.use(this.checkSkipCompany)
  }

  middlewareLocals() {
    super.middlewareLocals()

    this.use(this.setTemplate)
    this.use(this.setResults)
  }

  checkSkipCompany(req, res, next) {
    const skip = req.sessionModel.get('skip-company')

    if (skip) {
      req.sessionModel.unset('skip-company')
      return this.post(req, res, next)
    }

    next()
  }

  setTemplate(req, res, next) {
    const company = req.sessionModel.get('company')
    const options = get(req, 'form.options')

    if (company && !req.query.search) {
      if (options.templatePath) {
        options.template = path.join(options.templatePath, 'company--edit')
      }
    }

    next()
  }

  async setResults(req, res, next) {
    const searchTerm = req.query.term

    if (searchTerm) {
      try {
        res.locals.searchResult = await searchCompanies({
          req,
          page: req.query.page,
          searchTerm,
        }).then(
          transformApiResponseToSearchCollection(
            { query: req.query },
            ENTITIES,
            transformCompanyToListItem,
            transformListItemForOrderSource
          )
        )
      } catch (error) {
        return next(error)
      }
    }

    next()
  }
}

module.exports = CompanyController
