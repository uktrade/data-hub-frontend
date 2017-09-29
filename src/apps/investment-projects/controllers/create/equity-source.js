const { assign, get } = require('lodash')
const { getCompanyInvestmentProjects } = require('../../repos')
const { searchForeignCompanies } = require('../../../search/services')
const { transformApiResponseToSearchCollection } = require('../../../search/transformers')
const { transformCompanyToListItem } = require('../../../companies/transformers')

function renderEquitySourcePage (req, res, next) {
  return res
    .breadcrumb('Add investment project')
    .render('investment-projects/views/create/equity-source')
}

function transformListItemForEquitySource (company) {
  return function augmentItem (item) {
    if (!item || !company) { return }

    return assign({}, item, {
      url: `/investment-projects/create/project/${item.id}?client-company=${company.id}`,
      meta: item.meta.filter(x => x.label !== 'Sector'),
    })
  }
}

async function getHandler (req, res, next) {
  const company = res.locals.company
  const companyId = get(company, 'id')
  const searchTerm = req.query.term
  let searchResult

  res.locals.showSearch = !!req.query.search || get(company, 'uk_based', false)

  try {
    const companyInvestments = await getCompanyInvestmentProjects(req.session.token, companyId)

    if (searchTerm) {
      searchResult = await searchForeignCompanies({
        token: req.session.token,
        page: req.query.page,
        searchTerm,
      })
        .then(
          transformApiResponseToSearchCollection(
            { query: req.query },
            transformCompanyToListItem,
            transformListItemForEquitySource(company)
          )
        )
    }

    res.locals = Object.assign({}, res.locals, {
      company,
      companyInvestments,
      searchTerm,
      searchResult,
    })

    next()
  } catch (error) {
    next(error)
  }
}

function postHandler (req, res, next) {
  const isEquitySource = req.body['is_equity_source']
  const clientCompanyId = req.body['company_id']

  if (isEquitySource === 'true') {
    return res.redirect(`/investment-projects/create/project/${clientCompanyId}`)
  }

  if (isEquitySource === 'false') {
    return res.redirect(`/investment-projects/create/equity-source/${clientCompanyId}?search=true`)
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
