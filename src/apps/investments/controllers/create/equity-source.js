const { assign, get } = require('lodash')
const { getCompanyInvestmentProjects } = require('../../repos')
const {
  searchForeignCompanies,
} = require('../../../../modules/search/services')
const {
  transformApiResponseToSearchCollection,
} = require('../../../../modules/search/transformers')
const {
  transformCompanyToListItem,
} = require('../../../companies/transformers')
const { ENTITIES } = require('../../../search/constants')

function renderEquitySourcePage(req, res) {
  return res
    .breadcrumb('Add investment project')
    .render('investments/views/create/equity-source')
}

function transformListItemForEquitySource(company, projects) {
  return function augmentItem(item) {
    if (!item || !company) {
      return
    }

    return assign({}, item, {
      url: `${projects}/create/project/${item.id}?client-company=${company.id}`,
      meta: item.meta.filter((x) => x.label !== 'Sector'),
    })
  }
}

async function getHandler(req, res, next) {
  const company = res.locals.company
  const { projects } = res.locals.paths
  const companyId = get(company, 'id')
  const searchTerm = req.query.term
  let searchResult

  res.locals.showSearch = !!req.query.search || get(company, 'uk_based', false)

  try {
    const companyInvestments = await getCompanyInvestmentProjects(
      req,
      companyId
    )

    if (searchTerm) {
      searchResult = await searchForeignCompanies({
        req,
        page: req.query.page,
        searchTerm,
      }).then(
        transformApiResponseToSearchCollection(
          { query: req.query },
          ENTITIES,
          transformCompanyToListItem,
          transformListItemForEquitySource(company, projects)
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

function postHandler(req, res, next) {
  const isEquitySource = req.body.is_equity_source
  const clientCompanyId = req.body.company_id
  const { projects } = res.locals.paths

  if (isEquitySource === 'true') {
    return res.redirect(`${projects}/create/project/${clientCompanyId}`)
  }

  if (isEquitySource === 'false') {
    return res.redirect(
      `${projects}/create/equity-source/${clientCompanyId}?search=true`
    )
  }

  res.locals.form = {
    errors: {
      messages: {
        is_equity_source:
          'Please select whether this company will be the source of foreign equity',
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
