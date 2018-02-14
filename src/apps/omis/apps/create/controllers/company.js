const path = require('path')
const { assign, get } = require('lodash')

const { CreateController } = require('../../../controllers')
const { searchCompanies } = require('../../../../search/services')
const { transformApiResponseToSearchCollection } = require('../../../../search/transformers')
const { transformCompanyToListItem } = require('../../../../companies/transformers')

function transformListItemForOrderSource (item) {
  return assign({}, item, {
    url: `?company=${item.id}`,
  })
}

class CompanyController extends CreateController {
  middlewareLocals () {
    super.middlewareLocals()

    this.use(this.setTemplate)
    this.use(this.setResults)
  }

  setTemplate (req, res, next) {
    const company = req.sessionModel.get('company')
    const options = get(req, 'form.options')

    if (company && !req.query.search) {
      if (options.templatePath) {
        options.template = path.join(options.templatePath, 'company--edit')
      }
    }

    next()
  }

  async setResults (req, res, next) {
    const searchTerm = req.query.term

    if (searchTerm) {
      try {
        res.locals.searchResult = await searchCompanies({
          token: req.session.token,
          page: req.query.page,
          searchTerm,
        })
          .then(
            transformApiResponseToSearchCollection(
              { query: req.query },
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
