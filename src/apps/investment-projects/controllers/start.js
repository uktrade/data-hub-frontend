const { getInflatedDitCompany } = require('../../companies/services/data')
const { getCompanyInvestmentProjects } = require('../repos')
const { searchForeignCompanies } = require('../../search/services')
const { getPagination } = require('../../../lib/pagination')

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
      let pagination

      if (searchResult) {
        pagination = getPagination(req, searchResult)
      }

      if (clientCompanyId && clientCompany.uk_based) {
        showSearch = true
      }

      res.render('investment-projects/views/start', {
        title: 'Add investment project',
        clientCompany,
        clientCompanyInvestments,
        searchTerm,
        searchResult,
        pagination,
        showSearch,
      })
    })
    .catch(next)
}

function postHandler (req, res, next) {
  const isEquitySource = req.body['is-equity-source']
  const clientCompanyId = req.body['client-company']

  if (isEquitySource === 'true') {
    res.redirect(`/investment/create?equity-company=${clientCompanyId}`)
  } else if (isEquitySource === 'false') {
    res.redirect(`/investment/start?client-company=${clientCompanyId}&show-search=true`)
  } else {
    getInflatedDitCompany(req.session.token, clientCompanyId)
      .then((clientCompany) => {
        res.render('investment-projects/views/start', {
          title: 'Add investment project',
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
