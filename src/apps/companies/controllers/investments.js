const { getCompanyInvestmentProjects } = require('../../investment-projects/repos')
const { getDitCompany } = require('../repos')
const { getCommonTitlesAndlinks } = require('../services/data')
const { transformInvestmentProjectToListItem } = require('../../investment-projects/transformers')
const { transformApiResponseToCollection } = require('../../transformers')

async function getAction (req, res, next) {
  const token = req.session.token
  const companyId = req.params.id
  const page = req.query.page || 1

  try {
    const company = await getDitCompany(token, companyId)
    const results = await getCompanyInvestmentProjects(token, companyId, page)
      .then(transformApiResponseToCollection(
        { query: req.query },
        transformInvestmentProjectToListItem,
      ))

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
