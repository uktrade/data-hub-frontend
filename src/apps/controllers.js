const companyRepository = require('./companies/repos')
const { buildCompanyUrl } = require('./companies/services/data')

async function viewCompanyResult (req, res, next) {
  try {
    const company = await companyRepository.getDitCompany(req.session.token, req.params.id)
    res.redirect(buildCompanyUrl(company))
  } catch (error) {
    next(error)
  }
}

module.exports = {
  viewCompanyResult,
}
