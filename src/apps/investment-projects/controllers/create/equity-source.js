const { getCompanyInvestmentProjects } = require('../../repos')
const { searchForeignCompanies } = require('../../../search/services')
const { buildPagination } = require('../../../../lib/pagination')

function renderEquitySourcePage (req, res, next) {
  return res
    .breadcrumb('Add investment project')
    .render('investment-projects/views/create/equity-source')
}

function getHandler (req, res, next) {
  const company = res.locals.company
  const searchTerm = req.query['term']
  const promises = []

  if (company && company.id) {
    // TODO: remove this when the company endpoint returns a list of investments
    promises.push(getCompanyInvestmentProjects(req.session.token, company.id))
  } else {
    promises.push(Promise.resolve())
  }

  if (searchTerm) {
    promises.push(searchForeignCompanies({
      token: req.session.token,
      page: req.query.page,
      searchTerm,
    }))
  } else {
    promises.push(Promise.resolve())
  }

  Promise.all(promises)
    .then(([companyInvestments, searchResult]) => {
      let showSearch = req.query['show-search'] || false

      if (searchResult) {
        searchResult.pagination = buildPagination(req.query, searchResult)
      }

      if (company && company.uk_based) {
        showSearch = true
      }

      res.locals = Object.assign({}, res.locals, {
        company,
        companyInvestments,
        searchTerm,
        searchResult,
        showSearch,
      })

      next()
    })
    .catch(next)
}

function postHandler (req, res, next) {
  const isEquitySource = req.body['is_equity_source']
  const clientCompanyId = req.body['company_id']

  if (isEquitySource === 'true') {
    return res.redirect(`/investment-projects/create/project/${clientCompanyId}`)
  }

  if (isEquitySource === 'false') {
    return res.redirect(`/investment-projects/create/equity-source/${clientCompanyId}?show-search=true`)
  }

  res.locals.form = {
    errors: {
      messages: {
        is_equity_source: 'Please select whether this company will be the source of foreign equity',
      },
    },
  }

  next()
}

module.exports = {
  getHandler,
  postHandler,
  renderEquitySourcePage,
}
