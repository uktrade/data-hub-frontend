const { getCompanyInvestmentProjects } = require('../../investment-projects/repos')
const { getInflatedDitCompany, getCommonTitlesAndlinks } = require('../services/data')
const { transformResultsToCollection } = require('../../search/transformers')

async function getAction (req, res, next) {
  const token = req.session.token
  const companyId = req.params.id
  const page = req.query.page || 1

  try {
    const company = await getInflatedDitCompany(token, companyId)
    const results = await getCompanyInvestmentProjects(token, companyId, page)
      .then(result => transformResultsToCollection(result, 'investment_project', { query: req.query }))

    getCommonTitlesAndlinks(req, res, company)

    res.render('companies/views/investments', {
      tab: 'investments',
      company,
      results,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAction,
}
