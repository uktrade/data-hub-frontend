const { searchCompanies } = require('../../../modules/search/services')
const { transformCompanyToListItem } = require('../../companies/transformers')
const {
  transformApiResponseToSearchCollection,
} = require('../../../modules/search/transformers')
const { updateInvestment } = require('../repos')
const { ENTITIES } = require('../../search/constants')

async function selectUKCompany(req, res, next) {
  if (!req.query.company) {
    return next()
  }

  try {
    await updateInvestment(req, req.params.investmentId, {
      uk_company: req.query.company,
    })

    const { projects } = res.locals.paths
    const { investmentId } = req.params

    req.flash('success', 'Investment details updated')
    res.redirect(`${projects}/${investmentId}/details`)
  } catch (error) {
    return next(error)
  }
}

async function searchForUKCompany(req, res, next) {
  const searchTerm = req.query.term

  if (!searchTerm) {
    return next()
  }

  try {
    res.locals.searchTerm = searchTerm

    res.locals.results = await searchCompanies({
      req,
      searchTerm,
      page: req.query.page,
      isUkBased: true,
    }).then(
      transformApiResponseToSearchCollection(
        { query: req.query },
        ENTITIES,
        transformCompanyToListItem,
        (item) => {
          return Object.assign({}, item, {
            url: `?company=${item.id}`,
          })
        }
      )
    )
  } catch (error) {
    return next(error)
  }
  next()
}

function renderCompanyResults(req, res) {
  return res.render('investments/views/ukcompany')
}

async function removeUKCompany(req, res, next) {
  try {
    await updateInvestment(req, req.params.investmentId, {
      uk_company: null,
    })

    const { projects } = res.locals.paths
    const { investmentId } = req.params

    req.flash('success', 'Investment details updated')
    res.redirect(`${projects}/${investmentId}/details`)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  selectUKCompany,
  searchForUKCompany,
  renderCompanyResults,
  removeUKCompany,
}
