const { getInflatedDitCompany } = require('../../companies/services/data')
const { getCompanyInvestmentProjects } = require('../repos')
const { searchForeignCompanies } = require('../../search/services')
const { buildPagination } = require('../../../lib/pagination')

function getHandler (req, res, next) {
  const clientCompanyId = req.query['client-company']
  const searchTerm = req.query['q']
  const promises = []

  if (clientCompanyId) {
    promises.push(getInflatedDitCompany(req.session.token, clientCompanyId))
    // TODO: remove this when the company endpoint returns a list of invesments
    promises.push(getCompanyInvestmentProjects(req.session.token, clientCompanyId))
  } else {
    promises.push(Promise.resolve(), Promise.resolve())
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
    .then(([clientCompany, clientCompanyInvestments, searchResult]) => {
      let showSearch = req.query['show-search'] || false

      if (searchResult) {
        searchResult.pagination = buildPagination(req, searchResult)
      }

      if (clientCompanyId && clientCompany.uk_based) {
        showSearch = true
      }

      res
        .breadcrumb('Add investment project')
        .render('investment-projects/views/create-1', {
          clientCompany,
          clientCompanyInvestments,
          searchTerm,
          searchResult,
          showSearch,
        })
    })
    .catch(next)
}

function postHandler (req, res, next) {
  const isEquitySource = req.body['is-equity-source']
  const clientCompanyId = req.body['client-company']

  if (isEquitySource === 'true') {
    res.redirect(`2?equity-company=${clientCompanyId}`)
  } else if (isEquitySource === 'false') {
    res.redirect(`1?client-company=${clientCompanyId}&show-search=true`)
  } else {
    getInflatedDitCompany(req.session.token, clientCompanyId)
      .then((clientCompany) => {
        res
          .breadcrumb('Add investment project')
          .render('investment-projects/views/create-1', {
            clientCompany,
            errors: {
              isEquitySource: 'Please select whether this company will be the source of foreign equity',
            },
          })
      })
      .catch(next)
  }
}

module.exports = {
  getHandler,
  postHandler,
}
