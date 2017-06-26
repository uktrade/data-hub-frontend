const { getCompanyInvestmentProjects } = require('../../investment-projects/repos')
const { getInflatedDitCompany, getCommonTitlesAndlinks } = require('../services/data')

async function getAction (req, res, next) {
  const token = req.session.token
  const companyId = req.params.id

  try {
    const company = await getInflatedDitCompany(token, companyId)
    const projects = await getCompanyInvestmentProjects(token, companyId)

    getCommonTitlesAndlinks(req, res, company)

    res.render('companies/views/investments', {
      title: ['Investments', company.name, 'Companies'],
      tab: 'investments',
      company,
      projects,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAction,
}
